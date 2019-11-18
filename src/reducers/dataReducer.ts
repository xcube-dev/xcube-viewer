import {  OlVectorLayer } from '../components/ol/types';


import { DataState, newDataState } from '../states/dataState';
import { storeUserServers } from '../states/userSettings';
import {
    CONFIGURE_SERVERS,
    ADD_USER_PLACE,
    DataAction, REMOVE_ALL_TIME_SERIES,
    REMOVE_TIME_SERIES_GROUP,
    UPDATE_COLOR_BARS,
    UPDATE_DATASETS,
    UPDATE_TIME_SERIES, UPDATE_DATASET_PLACE_GROUP, REMOVE_USER_PLACE, REMOVE_ALL_USER_PLACES, UPDATE_SERVER_INFO,
    UPDATE_VARIABLE_COLOR_BAR
} from '../actions/dataActions';
import { MAP_OBJECTS } from '../states/controlState';
import { newId } from '../util/id';
import { Place } from "../model/place";
import { TimeSeries, TimeSeriesGroup } from "../model/timeSeries";


export function dataReducer(state: DataState, action: DataAction): DataState {
    if (typeof state === 'undefined') {
        state = newDataState();
    }
    switch (action.type) {
        case UPDATE_SERVER_INFO: {
            return {...state, serverInfo: action.serverInfo};
        }
        case UPDATE_DATASETS: {
            return {...state, datasets: action.datasets};
        }
        case UPDATE_VARIABLE_COLOR_BAR: {
            const datasetIndex = state.datasets.findIndex(ds => ds.id === action.datasetId);
            if (datasetIndex >= 0) {
                let dataset = state.datasets[datasetIndex];
                const variableIndex = dataset.variables.findIndex(v => v.name === action.variableName);
                if (variableIndex >= 0) {
                    let variable = dataset.variables[variableIndex];
                    let datasets = state.datasets.slice();
                    let variables = dataset.variables.slice();
                    variables[variableIndex] = {
                        ...variable,
                        colorBarMin: action.colorBarMinMax[0],
                        colorBarMax: action.colorBarMinMax[1],
                        colorBarName: action.colorBarName
                    };
                    datasets[datasetIndex] = {...dataset, variables};
                    return {...state, datasets};
                }
            }
            return state;
        }
        case UPDATE_DATASET_PLACE_GROUP: {
            const datasetIndex = state.datasets.findIndex(ds => ds.id === action.datasetId);
            if (datasetIndex >= 0) {
                let dataset = state.datasets[datasetIndex];
                if (dataset.placeGroups) {
                    const placeGroupIndex = dataset.placeGroups.findIndex(pg => pg.id === action.placeGroup.id);
                    if (placeGroupIndex >= 0) {
                        let datasets = state.datasets.slice();
                        let placeGroups = dataset.placeGroups.slice();
                        placeGroups[placeGroupIndex] = action.placeGroup;
                        datasets[datasetIndex] = {...dataset, placeGroups};
                        return {...state, datasets};
                    }
                }
            }
            return state;
        }
        case ADD_USER_PLACE: {
            const {id, label, color, geometry} = action;
            const feature = {
                type: 'Feature',
                id,
                geometry,
                properties: {label, color},
            };
            const features = [...state.userPlaceGroup.features, feature as Place];
            const userPlaceGroup = {...state.userPlaceGroup, features};
            return {
                ...state,
                userPlaceGroup,
            };
        }
        case REMOVE_USER_PLACE: {
            const {id} = action;
            const index = state.userPlaceGroup.features.findIndex(p => p.id == id);
            if (index >= 0) {
                removeUserPlacesFromLayer([id]);
                const features = [...state.userPlaceGroup.features];
                features.splice(index, 1);
                const userPlaceGroup = {...state.userPlaceGroup, features};
                const timeSeriesArray = getTimeSeriesArray(state.timeSeriesGroups, [id]);
                let timeSeriesGroups = state.timeSeriesGroups;
                timeSeriesArray.forEach(ts => {
                    timeSeriesGroups = updateTimeSeriesGroups(timeSeriesGroups,
                                                              ts, 'remove', 'append');
                });
                return {
                    ...state,
                    userPlaceGroup,
                    timeSeriesGroups
                };
            }
            return state;
        }
        case REMOVE_ALL_USER_PLACES: {
            const userPlaces = state.userPlaceGroup.features as Place[];
            const userPlaceIds = userPlaces.map(p => p.id);
            removeUserPlacesFromLayer(userPlaceIds);
            const userPlaceGroup = {...state.userPlaceGroup, features: []};
            const timeSeriesArray = getTimeSeriesArray(state.timeSeriesGroups, userPlaceIds);
            let timeSeriesGroups = state.timeSeriesGroups;
            timeSeriesArray.forEach(ts => {
                timeSeriesGroups = updateTimeSeriesGroups(timeSeriesGroups,
                                                          ts, 'remove', 'append');
            });
            return {
                ...state,
                userPlaceGroup,
                timeSeriesGroups,
            };
        }
        case UPDATE_COLOR_BARS: {
            return {...state, colorBars: action.colorBars};
        }
        case UPDATE_TIME_SERIES: {
            const {timeSeries, updateMode, dataMode} = action;
            const timeSeriesGroups = updateTimeSeriesGroups(state.timeSeriesGroups,
                                                            timeSeries, updateMode, dataMode);
            if (timeSeriesGroups !== state.timeSeriesGroups) {
                return {...state, timeSeriesGroups};
            }
            return state;
        }
        case REMOVE_TIME_SERIES_GROUP: {
            let tsgIndex = state.timeSeriesGroups.findIndex(tsg => tsg.id === action.id);
            if (tsgIndex >= 0) {
                const timeSeriesGroups = [...state.timeSeriesGroups];
                timeSeriesGroups.splice(tsgIndex, 1);
                return {...state, timeSeriesGroups};
            }
            return state;
        }
        case REMOVE_ALL_TIME_SERIES: {
            return {...state, timeSeriesGroups: []};
        }
        case CONFIGURE_SERVERS: {
            if (state.userServers !== action.servers) {
                storeUserServers(action.servers);
                return {...state, userServers: action.servers};
            }
            return state;
        }
    }

    return state;
}


function removeUserPlacesFromLayer(userPlaceIds: string[]) {
    if (MAP_OBJECTS.userLayer) {
        const userLayer = MAP_OBJECTS.userLayer as OlVectorLayer;
        const source = userLayer.getSource();
        userPlaceIds.forEach(placeId => {
            const feature = source.getFeatureById(placeId);
            if (feature) {
                source.removeFeature(feature);
            }
        });
    }
}


function updateTimeSeriesGroups(timeSeriesGroups: TimeSeriesGroup[],
                                timeSeries: TimeSeries,
                                updateMode: 'add' | 'replace' | 'remove',
                                dataMode: 'append' | 'new'): TimeSeriesGroup[] {
    let currentTimeSeries = timeSeries;

    let newTimeSeriesGroups;
    const tsgIndex = timeSeriesGroups.findIndex(tsg => tsg.variableUnits === currentTimeSeries.source.variableUnits);
    if (tsgIndex >= 0) {
        const timeSeriesGroup = timeSeriesGroups[tsgIndex];
        const timeSeriesArray = timeSeriesGroup.timeSeriesArray;
        const tsIndex = timeSeriesArray.findIndex(ts => ts.source.datasetId === currentTimeSeries.source.datasetId
                                                        && ts.source.variableName === currentTimeSeries.source.variableName
                                                        && ts.source.placeId === currentTimeSeries.source.placeId);
        let newTimeSeriesArray;
        if (tsIndex >= 0) {
            const oldTimeSeries = timeSeriesArray[tsIndex];
            if (dataMode === 'append') {
                currentTimeSeries = {
                    ...currentTimeSeries,
                    data: [...currentTimeSeries.data, ...oldTimeSeries.data]
                };
            }
            if (updateMode === 'replace') {
                newTimeSeriesArray = [currentTimeSeries];
            } else if (updateMode === 'add') {
                newTimeSeriesArray = timeSeriesArray.slice();
                newTimeSeriesArray[tsIndex] = currentTimeSeries;
            } else /*if (action.updateMode === 'remove')*/ {
                newTimeSeriesArray = timeSeriesArray.slice();
                newTimeSeriesArray.splice(tsIndex, 1);
            }
        } else {
            if (updateMode === 'replace') {
                newTimeSeriesArray = [currentTimeSeries];
            } else if (updateMode === 'add') {
                newTimeSeriesArray = [currentTimeSeries, ...timeSeriesArray];
            } else /*if (action.updateMode === 'remove')*/ {
                // Nothing to do here.
                newTimeSeriesArray = timeSeriesArray;
            }
        }
        if (updateMode === 'replace') {
            newTimeSeriesGroups = [{...timeSeriesGroup, timeSeriesArray: newTimeSeriesArray}];
        } else if (updateMode === 'add') {
            newTimeSeriesGroups = timeSeriesGroups.slice();
            newTimeSeriesGroups[tsgIndex] = {...timeSeriesGroup, timeSeriesArray: newTimeSeriesArray};
        } else /*if (action.updateMode === 'remove')*/ {
            if (newTimeSeriesArray.length >= 0) {
                newTimeSeriesGroups = timeSeriesGroups.slice();
                newTimeSeriesGroups[tsgIndex] = {...timeSeriesGroup, timeSeriesArray: newTimeSeriesArray};
            } else {
                newTimeSeriesGroups = timeSeriesGroups.slice();
                newTimeSeriesGroups.splice(tsgIndex, 1)
            }
        }
    } else {
        if (updateMode === 'replace') {
            const newTimeSeriesGroup = {
                id: newId(),
                variableUnits: currentTimeSeries.source.variableUnits,
                timeSeriesArray: [currentTimeSeries],
            };
            newTimeSeriesGroups = [newTimeSeriesGroup];
        } else if (updateMode === 'add') {
            const newTimeSeriesGroup = {
                id: newId(),
                variableUnits: currentTimeSeries.source.variableUnits,
                timeSeriesArray: [currentTimeSeries],
            };
            newTimeSeriesGroups = [newTimeSeriesGroup, ...timeSeriesGroups];
        } else /*if (action.updateMode === 'remove')*/ {
            // Nothing to do here.
            newTimeSeriesGroups = timeSeriesGroups;
        }
    }

    return newTimeSeriesGroups;
}


function getTimeSeriesArray(timeSeriesGroups: TimeSeriesGroup[], placeIds: string[]): TimeSeries[] {
    const timeSeriesArray: TimeSeries[] = [];
    timeSeriesGroups.forEach(tsg => {
        tsg.timeSeriesArray.forEach(ts => {
            placeIds.forEach(placeId => {
                if (ts.source.placeId === placeId) {
                    timeSeriesArray.push(ts);
                }
            });
        })
    });
    return timeSeriesArray;
}

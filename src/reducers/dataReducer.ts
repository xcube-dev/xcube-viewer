import * as ol from 'openlayers';

import { DataState, newDataState, storeUserServers } from '../states/dataState';
import {
    CONFIGURE_SERVERS,
    ADD_USER_PLACE,
    DataAction, REMOVE_ALL_TIME_SERIES,
    REMOVE_TIME_SERIES_GROUP,
    UPDATE_COLOR_BARS,
    UPDATE_DATASETS,
    UPDATE_TIME_SERIES, UPDATE_DATASET_PLACE_GROUP, REMOVE_USER_PLACE, REMOVE_ALL_USER_PLACES
} from '../actions/dataActions';
import { MAP_OBJECTS } from '../states/controlState';
import { newId } from '../util/id';
import { Place } from "../model/place";


export function dataReducer(state: DataState, action: DataAction): DataState {
    if (typeof state === 'undefined') {
        state = newDataState();
    }
    switch (action.type) {
        case UPDATE_DATASETS: {
            return {...state, datasets: action.datasets};
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
            const {id, label, color, geometry } = action;
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
                return {
                    ...state,
                    userPlaceGroup,
                };
            }
            return state;
        }
        case REMOVE_ALL_USER_PLACES: {
            const userPlaces = state.userPlaceGroup.features as Place[];
            removeUserPlacesFromLayer(userPlaces.map(p => p.id));
            const userPlaceGroup = {...state.userPlaceGroup, features: []};
            return {
                ...state,
                userPlaceGroup,
            };
        }
        case UPDATE_COLOR_BARS: {
            return {...state, colorBars: action.colorBars};
        }
        case UPDATE_TIME_SERIES: {
            let newTimeSeries = action.timeSeries;

            let newTimeSeriesGroups;
            const tsgIndex = state.timeSeriesGroups.findIndex(tsg => tsg.variableUnits === newTimeSeries.source.variableUnits);
            if (tsgIndex >= 0) {
                const timeSeriesGroup = state.timeSeriesGroups[tsgIndex];
                const timeSeriesArray = timeSeriesGroup.timeSeriesArray;
                const tsIndex = timeSeriesArray.findIndex(ts => ts.source.datasetId === newTimeSeries.source.datasetId
                                                                && ts.source.placeId === newTimeSeries.source.placeId
                                                                && ts.source.variableName === newTimeSeries.source.variableName);
                let newTimeSeriesArray;
                if (tsIndex >= 0) {
                    const oldTimeSeries = timeSeriesArray[tsIndex];
                    if (action.dataMode === 'append') {
                        newTimeSeries = {...newTimeSeries, data: [...newTimeSeries.data, ...oldTimeSeries.data]};
                    }
                    if (action.updateMode === 'replace') {
                        newTimeSeriesArray = [newTimeSeries];
                    } else {
                        newTimeSeriesArray = timeSeriesArray.slice();
                        newTimeSeriesArray[tsIndex] = newTimeSeries;
                    }
                } else {
                    if (action.updateMode === 'replace') {
                        newTimeSeriesArray = [newTimeSeries];
                    } else {
                        newTimeSeriesArray = [newTimeSeries, ...timeSeriesArray];
                    }
                }
                const newTimeSeriesGroup = {...timeSeriesGroup, timeSeriesArray: newTimeSeriesArray};
                if (action.updateMode === 'replace') {
                    newTimeSeriesGroups = [newTimeSeriesGroup];
                } else {
                    newTimeSeriesGroups = state.timeSeriesGroups.slice();
                    newTimeSeriesGroups[tsgIndex] = newTimeSeriesGroup;
                }
            } else {
                const newTimeSeriesGroup = {
                    id: newId(),
                    variableUnits: newTimeSeries.source.variableUnits,
                    timeSeriesArray: [newTimeSeries],
                };
                if (action.updateMode === 'replace') {
                    newTimeSeriesGroups = [newTimeSeriesGroup];
                } else {
                    newTimeSeriesGroups = [newTimeSeriesGroup, ...state.timeSeriesGroups];
                }
            }
            if (newTimeSeriesGroups) {
                return {
                    ...state,
                    timeSeriesGroups: newTimeSeriesGroups,
                };
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
        const userLayer = MAP_OBJECTS.userLayer as ol.layer.Vector;
        const source = userLayer.getSource();
        userPlaceIds.forEach(placeId => {
            const feature = source.getFeatureById(placeId);
            if (feature) {
                source.removeFeature(feature);
            }
        });
    }
}

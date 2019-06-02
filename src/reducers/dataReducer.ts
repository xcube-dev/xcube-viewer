import * as ol from 'openlayers';

import { DataState, newDataState, storeUserServers } from '../states/dataState';
import {
    CONFIGURE_SERVERS,
    DataAction, REMOVE_ALL_TIME_SERIES,
    REMOVE_TIME_SERIES_GROUP,
    UPDATE_COLOR_BARS,
    UPDATE_DATASETS,
    UPDATE_TIME_SERIES
} from '../actions/dataActions';
import { MAP_OBJECTS } from "../states/controlState";
import { newId } from "../util/id";
import { TimeSeriesGroup } from "../model/timeSeries";


export function dataReducer(state: DataState, action: DataAction): DataState {
    if (typeof state === 'undefined') {
        state = newDataState();
    }
    switch (action.type) {
        case UPDATE_DATASETS: {
            return {...state, datasets: action.datasets};
        }
        case UPDATE_COLOR_BARS: {
            return {...state, colorBars: action.colorBars};
        }
        case UPDATE_TIME_SERIES: {
            let newTimeSeries = action.timeSeries;

            if (action.updateMode === "replace" && action.dataMode === "new") {
                const featureId = newTimeSeries.source.featureId;
                state.timeSeriesGroups.forEach(tsg => {
                    removeTimeSeriesGroupFeatures(tsg, (fid: string) => fid !== featureId);
                });
            }

            let newTimeSeriesGroups;
            const tsgIndex = state.timeSeriesGroups.findIndex(tsg => tsg.variableUnits === newTimeSeries.source.variableUnits);
            if (tsgIndex >= 0) {
                const timeSeriesGroup = state.timeSeriesGroups[tsgIndex];
                const timeSeriesArray = timeSeriesGroup.timeSeriesArray;
                const tsIndex = timeSeriesArray.findIndex(ts => ts.source.datasetId === newTimeSeries.source.datasetId
                                                                && ts.source.featureId === newTimeSeries.source.featureId
                                                                && ts.source.variableName === newTimeSeries.source.variableName);
                let newTimeSeriesArray;
                if (tsIndex >= 0) {
                    const oldTimeSeries = timeSeriesArray[tsIndex];
                    if (action.dataMode === "append") {
                        newTimeSeries = {...newTimeSeries, data: [...newTimeSeries.data, ...oldTimeSeries.data]};
                    }
                    if (action.updateMode === "replace") {
                        newTimeSeriesArray = [newTimeSeries];
                    } else {
                        newTimeSeriesArray = timeSeriesArray.slice();
                        newTimeSeriesArray[tsIndex] = newTimeSeries;
                    }
                } else {
                    if (action.updateMode === "replace") {
                        newTimeSeriesArray = [newTimeSeries];
                    } else {
                        newTimeSeriesArray = [newTimeSeries, ...timeSeriesArray];
                    }
                }
                const newTimeSeriesGroup = {...timeSeriesGroup, timeSeriesArray: newTimeSeriesArray};
                if (action.updateMode === "replace") {
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
                if (action.updateMode === "replace") {
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
                removeTimeSeriesGroupFeatures(state.timeSeriesGroups[tsgIndex]);
                const timeSeriesGroups = state.timeSeriesGroups.slice();
                timeSeriesGroups.splice(tsgIndex, 1);
                return {...state, timeSeriesGroups};
            }
            return state;
        }
        case REMOVE_ALL_TIME_SERIES: {
            state.timeSeriesGroups.forEach(tsg => {
                removeTimeSeriesGroupFeatures(tsg);
            });
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


function removeTimeSeriesGroupFeatures(tsg: TimeSeriesGroup, predicate?: (fid: string) => boolean) {
    if (MAP_OBJECTS.userLayer) {
        const userLayer = MAP_OBJECTS.userLayer as ol.layer.Vector;
        tsg.timeSeriesArray.forEach(ts => {
            const fid = ts.source.featureId;
            if (!predicate || predicate(fid)) {
                const source = userLayer.getSource();
                const feature = source.getFeatureById(fid);
                if (feature) {
                    source.removeFeature(feature);
                }
            }
        });
    }
}

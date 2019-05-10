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
import { USER_PLACES_COLOR_NAMES } from "../config";
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
            if (action.updateMode === "add") {
                const timeSeries = action.timeSeries;
                const tsgIndex = state.timeSeriesGroups.findIndex(tsg => tsg.variableUnits === timeSeries.source.variableUnits);
                let timeSeriesGroups;
                if (tsgIndex >= 0) {
                    timeSeriesGroups = state.timeSeriesGroups.slice();
                    const timeSeriesGroup = timeSeriesGroups[tsgIndex];
                    const timeSeriesArray = timeSeriesGroup.timeSeries;
                    const colorIndex = timeSeriesArray.length % USER_PLACES_COLOR_NAMES.length;
                    const color = USER_PLACES_COLOR_NAMES[colorIndex];
                    timeSeriesGroups[tsgIndex] = {
                        ...timeSeriesGroup,
                        timeSeries: [{...timeSeries, color}, ...timeSeriesArray],
                    };
                } else {
                    const timeSeriesGroup = {
                        id: newId(),
                        variableUnits: timeSeries.source.variableUnits,
                        timeSeries: [{...timeSeries, color: USER_PLACES_COLOR_NAMES[0]}],
                    };
                    timeSeriesGroups = [timeSeriesGroup, ...state.timeSeriesGroups];
                }
                return {
                    ...state,
                    timeSeriesGroups,
                };
            } else if (action.updateMode === "replace") {
                const timeSeries = action.timeSeries;
                const featureId = timeSeries.source.featureId;
                state.timeSeriesGroups.forEach(tsg => {
                    removeTimeSeriesGroupFeatures(tsg, (fid: string) => fid !== featureId);
                });

                const timeSeriesGroup = {
                    id: newId(),
                    variableUnits: timeSeries.source.variableUnits || "-",
                    timeSeries: [{...timeSeries, color: USER_PLACES_COLOR_NAMES[0]}],
                };
                const timeSeriesGroups = [timeSeriesGroup];
                return {
                    ...state,
                    timeSeriesGroups,
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
        tsg.timeSeries.forEach(ts => {
            const fid = ts.source.featureId;
            if (!predicate || predicate(fid)) {
                const source = userLayer.getSource();
                const feature = source.getFeatureById(fid);
                source.removeFeature(feature);
            }
        });
    }
}
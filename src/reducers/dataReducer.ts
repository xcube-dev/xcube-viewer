import * as ol from 'openlayers';

import { DataState, newDataState, storeUserServers } from '../states/dataState';
import {
    CONFIGURE_SERVERS,
    DataAction,
    REMOVE_ALL_TIME_SERIES,
    UPDATE_COLOR_BARS,
    UPDATE_DATASETS,
    UPDATE_TIME_SERIES
} from '../actions/dataActions';
import { MAP_OBJECTS } from "../states/controlState";


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
                return {...state, timeSeriesCollection: [...state.timeSeriesCollection, action.timeSeries]};
            } else if (action.updateMode === "replace") {
                if (MAP_OBJECTS.userLayer) {
                    const userLayer = MAP_OBJECTS.userLayer as ol.layer.Vector;
                    state.timeSeriesCollection.forEach(timeSeries => {
                        const featureId = timeSeries.source.featureId;
                        if (featureId !== action.timeSeries.source.featureId) {
                            const source = userLayer.getSource();
                            const feature = source.getFeatureById(featureId);
                            source.removeFeature(feature);
                        }
                    });
                }
                return {...state, timeSeriesCollection: [action.timeSeries]};
            } else {
                return state;
            }
        }
        case REMOVE_ALL_TIME_SERIES: {
            if (MAP_OBJECTS.userLayer) {
                const userLayer = MAP_OBJECTS.userLayer as ol.layer.Vector;
                state.timeSeriesCollection.forEach(timeSeries => {
                    let source = userLayer.getSource();
                    let feature = source.getFeatureById(timeSeries.source.featureId);
                    source.removeFeature(feature);
                });
            }
            return {...state, timeSeriesCollection: []};
        }
        case CONFIGURE_SERVERS: {
            if (state.userServers !== action.servers) {
                storeUserServers(action.servers);
                return {...state, userServers: action.servers};
            }
        }
    }
    return state;
}

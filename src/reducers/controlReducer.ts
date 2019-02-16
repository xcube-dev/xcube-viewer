import * as ol from "openlayers";

import { ControlState, newControlState } from '../states/controlState';
import {
    SELECT_DATASET,
    SELECT_VARIABLE,
    SELECT_PLACE,
    SELECT_TIME,
    SELECT_TIME_SERIES_UPDATE_MODE,
    SELECT_USER_PLACE,
    SELECT_COORDINATE,
    ControlAction,
} from '../actions/controlActions';
import { findDataset, findDatasetVariable } from '../model';
import { findDatasetPlace } from "../model/dataset";


const SIMPLE_GEOMETRY_TYPES = ["Point" , "LineString" , "LinearRing" , "Polygon" , "MultiPoint" , "MultiLineString" , "MultiPolygon" , "Circle"];

export function controlReducer(state: ControlState, action: ControlAction): ControlState {
    if (typeof state === 'undefined') {
        state = newControlState();
    }
    switch (action.type) {
        case SELECT_DATASET: {
            let selectedVariableName = state.selectedVariableName;
            const dataset = findDataset(action.datasets, action.selectedDatasetId)!;
            const variable = findDatasetVariable(dataset, selectedVariableName);
            if (!variable && dataset.variables.length > 0) {
                selectedVariableName = dataset.variables[0].name;
            }
            let flyTo = state.flyTo;
            if (dataset.bbox) {
                flyTo = dataset.bbox;
            }
            return {
                ...state,
                selectedDatasetId: action.selectedDatasetId,
                selectedVariableName,
                flyTo: flyTo,
            };
        }
        case SELECT_PLACE: {
            const selectedPlaceId = action.selectedPlaceId;
            let flyTo = state.flyTo;
            if (selectedPlaceId) {
                const dataset = findDataset(action.datasets, state.selectedDatasetId)!;
                const place = findDatasetPlace(dataset, selectedPlaceId);
                if (place !== null) {
                    if (place.bbox && place.bbox.length === 4) {
                        flyTo = place.bbox as [number, number, number, number];
                    } else if (place.geometry && SIMPLE_GEOMETRY_TYPES.includes(place.geometry.type)) {
                        flyTo = new ol.format.GeoJSON().readGeometry(place.geometry) as ol.geom.SimpleGeometry;
                    }
                }
            }
            return {
                ...state,
                selectedPlaceId,
                flyTo
            };
        }
        case SELECT_VARIABLE: {
            return {
                ...state,
                selectedVariableName: action.selectedVariableName,
            };
        }
        case SELECT_USER_PLACE: {
            return {
                ...state,
                selectedUserPlaceId: action.selectedUserPlaceId,
            };
        }
        case SELECT_TIME: {
            return {
                ...state,
                selectedTime: action.selectedTime,
            };
        }
        case SELECT_TIME_SERIES_UPDATE_MODE: {
            return {
                ...state,
                timeSeriesUpdateMode: action.timeSeriesUpdateMode,
            };
        }
        case SELECT_COORDINATE: {
            return {
                ...state,
                selectedCoordinate: action.selectedCoordinate,
            };
        }
    }
    return state;
}


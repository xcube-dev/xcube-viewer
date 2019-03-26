import * as ol from 'openlayers';

import { findDataset, findDatasetVariable, findDatasetPlace, getDatasetTimeRange } from '../model/dataset';
import { TimeRange } from "../model/timeSeries";
import { ControlState, newControlState } from '../states/controlState';
import {
    SELECT_DATASET,
    SELECT_VARIABLE,
    SELECT_PLACE_GROUPS,
    SELECT_PLACE,
    SELECT_TIME,
    SELECT_TIME_SERIES_UPDATE_MODE,
    SELECT_USER_PLACE,
    SELECT_COORDINATE,
    ControlAction,
    SELECT_TIME_RANGE,
    UPDATE_VISIBLE_TIME_RANGE,
    UPDATE_TIME_ANIMATION,
    ADD_ACTIVITY,
    REMOVE_ACTIVITY,
    CHANGE_LOCALE, OPEN_DIALOG, CLOSE_DIALOG,
} from '../actions/controlActions';
import { I18N } from "../config";


const SIMPLE_GEOMETRY_TYPES = ['Point', 'LineString', 'LinearRing', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon', 'Circle'];

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
            const selectedDatasetId = action.selectedDatasetId;
            const selectedTimeRange = getDatasetTimeRange(dataset);
            const visibleTimeRange: TimeRange | null = selectedTimeRange ? [selectedTimeRange[0], selectedTimeRange[1]] : null;
            const selectedTime = selectedTimeRange ? selectedTimeRange[1] : null;
            return {
                ...state,
                selectedDatasetId,
                selectedVariableName,
                selectedTimeRange,
                visibleTimeRange,
                selectedTime,
                flyTo,
            };
        }
        case SELECT_PLACE_GROUPS: {
            const selectedPlaceGroupIds = action.selectedPlaceGroupIds;
            return {
                ...state,
                selectedPlaceGroupIds,
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
        case SELECT_TIME_RANGE: {
            return {
                ...state,
                selectedTimeRange: action.selectedTimeRange,
            };
        }
        case UPDATE_VISIBLE_TIME_RANGE: {
            return {
                ...state,
                visibleTimeRange: action.visibleTimeRange,
            };
        }
        case SELECT_TIME_SERIES_UPDATE_MODE: {
            return {
                ...state,
                timeSeriesUpdateMode: action.timeSeriesUpdateMode,
            };
        }
        case UPDATE_TIME_ANIMATION: {
            return {
                ...state,
                timeAnimationActive: action.timeAnimationActive,
                timeAnimationInterval: action.timeAnimationInterval,
            };
        }
        case SELECT_COORDINATE: {
            return {
                ...state,
                selectedCoordinate: action.selectedCoordinate,
            };
        }
        case ADD_ACTIVITY: {
            return {
                ...state,
                activities: {...state.activities, [action.id]: action.message},
            };
        }
        case REMOVE_ACTIVITY: {
            const activities = {...state.activities};
            delete activities[action.id];
            return {
                ...state,
                activities,
            };
        }
        case CHANGE_LOCALE: {
            const locale = action.locale;
            I18N.locale = locale;
            return {
                ...state,
                locale,
            };
        }
        case OPEN_DIALOG: {
            const dialogId = action.dialogId;
            return {
                ...state,
                dialogOpen: {...state.dialogOpen, [dialogId]: true},
            };
        }
        case CLOSE_DIALOG: {
            const dialogId = action.dialogId;
            return {
                ...state,
                dialogOpen: {...state.dialogOpen, [dialogId]: false},
            };
        }
    }
    return state;
}


import * as ol from 'openlayers';

import { findDataset, findDatasetVariable, getDatasetTimeRange, findDatasetOrUserPlace } from '../model/dataset';
import { ControlState, newControlState } from '../states/controlState';
import {
    SELECT_DATASET,
    SELECT_VARIABLE,
    SELECT_PLACE_GROUPS,
    SELECT_PLACE,
    SELECT_TIME,
    SELECT_TIME_SERIES_UPDATE_MODE,
    ControlAction,
    SELECT_TIME_RANGE,
    UPDATE_TIME_ANIMATION,
    ADD_ACTIVITY,
    REMOVE_ACTIVITY,
    CHANGE_LOCALE,
    OPEN_DIALOG,
    CLOSE_DIALOG,
    INC_SELECTED_TIME,
    UPDATE_SETTINGS,
} from '../actions/controlActions';
import { CONFIGURE_SERVERS, DataAction, ADD_USER_PLACE } from "../actions/dataActions";
import { I18N } from "../config";
import { AppState } from "../states/appState";
import { selectedTimeIndexSelector, timeCoordinatesSelector } from "../selectors/controlSelectors";
import { findIndexCloseTo } from "../util/find";
import { storeUserSettings } from '../states/userSettings';


const SIMPLE_GEOMETRY_TYPES = ['Point', 'LineString', 'LinearRing', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon', 'Circle'];

export function controlReducer(state: ControlState, action: ControlAction | DataAction, appState: AppState): ControlState {
    if (typeof state === 'undefined') {
        state = newControlState();
    }
    switch (action.type) {
        case UPDATE_SETTINGS:
            storeUserSettings(action.settings);
            return action.settings;
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
            const selectedTime = selectedTimeRange ? selectedTimeRange[1] : null;
            return {
                ...state,
                selectedDatasetId,
                selectedVariableName,
                selectedTimeRange,
                selectedTime,
                flyTo,
            };
        }
        case SELECT_PLACE_GROUPS: {
            const selectedPlaceGroupIds = action.selectedPlaceGroupIds;
            const selectedPlaceId = null;
            return {
                ...state,
                selectedPlaceGroupIds,
                selectedPlaceId,
            };
        }
        case SELECT_PLACE: {
            const selectedPlaceId = action.selectedPlaceId;
            let flyTo = state.flyTo;
            if (selectedPlaceId) {
                const place = findDatasetOrUserPlace(action.datasets, action.userPlaceGroup, selectedPlaceId);
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
        case SELECT_TIME: {
            let {selectedTime} = action;
            if (selectedTime !== null) {
                const timeCoordinates = timeCoordinatesSelector(appState)!;
                const index = timeCoordinates ? findIndexCloseTo(timeCoordinates, selectedTime) : -1;
                if (index >= 0) {
                    selectedTime = timeCoordinates[index];
                }
            }
            if (state.selectedTime !== selectedTime) {
                return {
                    ...state,
                    selectedTime,
                };
            }
            return state;
        }
        case INC_SELECTED_TIME: {
            let index = selectedTimeIndexSelector(appState);
            if (index >= 0) {
                const timeCoordinates = timeCoordinatesSelector(appState)!;
                index += action.increment;
                if (index < 0) {
                    index = timeCoordinates.length - 1;
                }
                if (index > timeCoordinates.length - 1) {
                    index = 0;
                }
                let selectedTime = timeCoordinates[index];
                let selectedTimeRange = state.selectedTimeRange;
                if (selectedTimeRange !== null) {
                    if (selectedTime < selectedTimeRange[0]) {
                        selectedTime = selectedTimeRange[0];
                    }
                    if (selectedTime > selectedTimeRange[1]) {
                        selectedTime = selectedTimeRange[1];
                    }
                }
                if (state.selectedTime !== selectedTime) {
                    return {
                        ...state,
                        selectedTime,
                    };
                }
            }
            return state;
        }
        case SELECT_TIME_RANGE: {
            return {
                ...state,
                selectedTimeRange: action.selectedTimeRange,
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
        case ADD_USER_PLACE: {
            let selectedPlaceGroupIds;
            if (!state.selectedPlaceGroupIds || state.selectedPlaceGroupIds.length === 0) {
                selectedPlaceGroupIds = ['user'];
            } else if (state.selectedPlaceGroupIds.find(id => id === 'user')) {
                selectedPlaceGroupIds = state.selectedPlaceGroupIds;
            } else {
                selectedPlaceGroupIds = [...state.selectedPlaceGroupIds, 'user']
            }
            return {
                ...state,
                selectedPlaceGroupIds,
                selectedPlaceId: action.id,
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
        case CONFIGURE_SERVERS: {
            if (state.selectedServerId !== action.selectedServerId) {
                return {...state, selectedServerId: action.selectedServerId};
            }
        }
    }
    return state;
}


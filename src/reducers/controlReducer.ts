import { default as OlGeoJSONFormat } from 'ol/format/GeoJSON';
import {
    ADD_ACTIVITY,
    CHANGE_LOCALE,
    CLOSE_DIALOG,
    ControlAction,
    FLY_TO_DATASET,
    INC_SELECTED_TIME,
    OPEN_DIALOG,
    REMOVE_ACTIVITY,
    SELECT_DATASET,
    SELECT_PLACE,
    SELECT_PLACE_GROUPS,
    SELECT_TIME,
    SELECT_TIME_RANGE,
    SELECT_TIME_SERIES_UPDATE_MODE,
    SELECT_VARIABLE,
    SET_MAP_INTERACTION,
    SHOW_INFO_CARD,
    UPDATE_SETTINGS,
    UPDATE_TIME_ANIMATION,
} from '../actions/controlActions';
import {
    ADD_USER_PLACE,
    CONFIGURE_SERVERS,
    DataAction,
    REMOVE_USER_PLACE,
    UPDATE_DATASETS
} from "../actions/dataActions";
import { I18N } from "../config";

import { findDataset, findDatasetVariable, getDatasetTimeRange } from '../model/dataset';
import { selectedTimeIndexSelector, timeCoordinatesSelector } from "../selectors/controlSelectors";
import { AppState } from "../states/appState";
import { ControlState, newControlState } from '../states/controlState';
import { storeUserSettings } from '../states/userSettings';
import { findIndexCloseTo } from "../util/find";
import { getGlobalCanvasImageSmoothing, setGlobalCanvasImageSmoothing } from '../util/hacks';


// TODO (forman): Refactor reducers for UPDATE_DATASETS, SELECT_DATASET, SELECT_PLACE, SELECT_VARIABLE
//                so they produce a consistent state. E.g. on selected dataset change, ensure selected
//                places and variables are still valid. Write tests for that.
//                We currently still receiving error logs from Material-UI, e.g.:
//                  SelectInput.js:304 Material-UI: you have provided an out-of-range value `local`
//                  for the select (name="dataset") component.
//                  Consider providing a value that matches one of the available options or ''.
//                  The available values are "".

const SIMPLE_GEOMETRY_TYPES = ['Point', 'LineString', 'LinearRing', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon', 'Circle'];

export function controlReducer(state: ControlState | undefined, action: ControlAction | DataAction, appState: AppState | undefined): ControlState {
    if (state === undefined) {
        state = newControlState();
    }
    switch (action.type) {
        case UPDATE_SETTINGS:
            storeUserSettings(action.settings);
            if (action.settings.imageSmoothingEnabled !== getGlobalCanvasImageSmoothing()) {
                setGlobalCanvasImageSmoothing(action.settings.imageSmoothingEnabled);
            }
            return action.settings;
        case UPDATE_DATASETS: {
            let selectedDatasetId = state!.selectedDatasetId;
            let selectedVariableName = state!.selectedVariableName;
            const selectedDataset = findDataset(action.datasets, selectedDatasetId);
            const selectedVariable = (selectedDataset
                                      && findDatasetVariable(selectedDataset, selectedVariableName))
                                     || null;
            if (selectedDataset) {
                if (selectedVariable) {
                    return state;
                } else {
                    selectedVariableName = selectedDataset.variables.length ? selectedDataset.variables[0].name : null;
                }
            } else {
                selectedDatasetId = action.datasets.length ? action.datasets[0].id : null;
            }
            return {...state, selectedDatasetId, selectedVariableName};
        }
        case SELECT_DATASET: {
            let selectedVariableName = state.selectedVariableName;
            const selectedDataset = findDataset(action.datasets, action.selectedDatasetId)!;
            const selectedVariable = findDatasetVariable(selectedDataset, selectedVariableName);
            if (!selectedVariable && selectedDataset.variables.length > 0) {
                selectedVariableName = selectedDataset.variables[0].name;
            }
            let flyTo = state.flyTo;
            if (selectedDataset.bbox) {
                flyTo = selectedDataset.bbox;
            }
            const selectedDatasetId = action.selectedDatasetId;
            const selectedTimeRange = getDatasetTimeRange(selectedDataset);
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
        case FLY_TO_DATASET: {
            const selectedDataset = findDataset(action.datasets, action.selectedDatasetId)!;
            let flyTo = state.flyTo;
            if (selectedDataset.bbox) {
                flyTo = selectedDataset.bbox;
            }
            return {
                ...state,
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
            if (selectedPlaceId && action.showInMap) {
                const place = action.places.find(p => p.id === selectedPlaceId);
                if (place) {
                    if (place.bbox && place.bbox.length === 4) {
                        flyTo = place.bbox as [number, number, number, number];
                    } else if (place.geometry && SIMPLE_GEOMETRY_TYPES.includes(place.geometry.type)) {
                        flyTo = new OlGeoJSONFormat().readGeometry(place.geometry);
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
            if (selectedTime !== null && appState) {
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
            if (appState) {
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
        case REMOVE_USER_PLACE: {
            const {id, places} = action;
            if (id === state.selectedPlaceId) {
                let selectedPlaceId = null;
                const index = places.findIndex(p => p.id === id);
                if (index >= 0) {
                    if (index < places.length - 1) {
                        selectedPlaceId = places[index + 1].id;
                    } else if (index > 0) {
                        selectedPlaceId = places[index - 1].id;
                    }
                }
                return {
                    ...state,
                    selectedPlaceId
                };
            }
            return state;
        }
        case SET_MAP_INTERACTION: {
            return {
                ...state,
                mapInteraction: action.mapInteraction
            };
        }
        case SHOW_INFO_CARD: {
            return {
                ...state,
                infoCardOpen: action.infoCardOpen,
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


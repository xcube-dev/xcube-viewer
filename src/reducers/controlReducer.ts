import { ControlState, newControlState } from '../states/controlState';
import {
    SELECT_DATASET,
    SELECT_VARIABLE,
    SELECT_PLACE,
    SELECT_TIME,
    ControlAction, SELECT_USER_PLACE, SELECT_COORDINATE
} from '../actions/controlActions';


export function controlReducer(state: ControlState, action: ControlAction): ControlState {
    if (typeof state === 'undefined') {
        state = newControlState();
    }
    switch (action.type) {
        case SELECT_DATASET: {
            return {
                ...state,
                selectedDatasetId: action.selectedDatasetId,
            };
        }
        case SELECT_VARIABLE: {
            return {
                ...state,
                selectedVariableName: action.selectedVariableName,
            };
        }
        case SELECT_PLACE: {
            return {
                ...state,
                selectedPlaceId: action.selectedPlaceId,
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
        case SELECT_COORDINATE: {
            return {
                ...state,
                selectedCoordinate: action.selectedCoordinate,
            };
        }
    }
    return state;
}


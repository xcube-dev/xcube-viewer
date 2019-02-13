import { ControlState, newControlState } from '../states/controlState';
import {
    SELECT_DATASET,
    SELECT_VARIABLE,
    SELECT_PLACE,
    ControlAction
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
                selectedVariableId: action.selectedVariableId,
            };
        }
        case SELECT_PLACE: {
            return {
                ...state,
                selectedPlaceId: action.selectedPlaceId,
            };
        }
    }
    return state;
}


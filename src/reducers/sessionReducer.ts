import { SessionState, newSessionState } from '../states/sessionState';
import { SELECT_DATASET, SessionAction } from "../actions/sessionActions";

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
    if (typeof state === 'undefined') {
        state = newSessionState();
    }
    switch (action.type) {
        case SELECT_DATASET: {
            return {...state, selectedDatasetId: action.selectedDatasetId}
        }
    }
    return state;
}

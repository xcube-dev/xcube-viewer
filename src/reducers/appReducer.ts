import { AppState } from '../states/appState';
import { dataReducer } from './dataReducer';
import { controlReducer } from './controlReducer';
import { messageLogReducer } from './messageLogReducer';
import { DataAction } from "../actions/dataActions";
import { ControlAction } from "../actions/controlActions";
import { MessageLogAction } from "../actions/messageLogActions";


export function appReducer(state: AppState | undefined, action: DataAction & ControlAction & MessageLogAction): AppState {
    // Not using redux.combineReducers(), because we need to pass app state into controlReducer()
    return {
        dataState: dataReducer(state && state.dataState, action),
        controlState: controlReducer(state && state.controlState, action, state),
        messageLogState: messageLogReducer(state && state.messageLogState, action),
    };
}


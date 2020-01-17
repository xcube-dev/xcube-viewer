import { AppState } from '../states/appState';

import { dataReducer } from './dataReducer';
import { DataAction } from "../actions/dataActions";

import { controlReducer } from './controlReducer';
import { ControlAction } from "../actions/controlActions";

import { messageLogReducer } from './messageLogReducer';
import { MessageLogAction } from "../actions/messageLogActions";

import { userAuthReducer } from './userAuthReducer';
import { UserAuthAction } from '../actions/userAuthActions';


export function appReducer(state: AppState | undefined,
                           action: DataAction & ControlAction & MessageLogAction & UserAuthAction): AppState {
    // Not using redux.combineReducers(), because we need to pass app state into controlReducer()
    return {
        dataState: dataReducer(state && state.dataState, action),
        controlState: controlReducer(state && state.controlState, action, state),
        messageLogState: messageLogReducer(state && state.messageLogState, action),
        userAuthState: userAuthReducer(state && state.userAuthState, action),
    };
}


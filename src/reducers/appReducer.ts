import { combineReducers } from 'redux';
import { AppState } from '../states/appState';
import { dataReducer } from './dataReducer';
import { controlReducer } from './controlReducer';
import { messageLogReducer } from './messageLogReducer';


export const appReducer = combineReducers<AppState>(
    {
        dataState: dataReducer,
        controlState: controlReducer,
        messageLogState: messageLogReducer,
    }
);

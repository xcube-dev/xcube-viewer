import { combineReducers } from 'redux';
import { AppState } from '../states/appState';
import { configReducer } from './configReducer';
import { dataReducer } from './dataReducer';
import { controlReducer } from './controlReducer';
import { messageLogReducer } from './messageLogReducer';

export const appReducer = combineReducers<AppState>(
    {
        configState: configReducer,
        dataState: dataReducer,
        controlState: controlReducer,
        messageLogState: messageLogReducer,
    }
);

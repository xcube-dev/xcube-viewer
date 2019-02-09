import { combineReducers } from 'redux';
import { configReducer } from './configReducer';
import { dataReducer } from "./dataReducer";
import { sessionReducer } from './sessionReducer';
import { messageLogReducer } from "./messageLogReducer";

export const viewerReducer = combineReducers(
    {
        configState: configReducer,
        dataState: dataReducer,
        sessionState: sessionReducer,
        messageLogState: messageLogReducer,
    }
);

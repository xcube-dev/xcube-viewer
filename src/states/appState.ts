import { MessageLogState } from "./messageLogState";
import { DataState } from "./dataState";
import { ControlState } from "./controlState";
import { UserAuthState } from './userAuthState';

export interface AppState {
    dataState: DataState;
    controlState: ControlState;
    messageLogState: MessageLogState;
    userAuthState: UserAuthState;
}

import { MessageLogState } from "./messageLogState";
import { DataState } from "./dataState";
import { ControlState } from "./controlState";

export interface AppState {
    dataState: DataState;
    controlState: ControlState;
    messageLogState: MessageLogState;
}

import { ConfigState } from "./configState";
import { MessageLogState } from "./messageLogState";
import { DataState } from "./dataState";
import { ControlState } from "./controlState";

export interface AppState {
    configState: ConfigState;
    dataState: DataState;
    controlState: ControlState;
    messageLogState: MessageLogState;
}

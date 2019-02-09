import { ConfigState } from "./configState";
import { MessageLogState } from "./messageLogState";
import { DataState } from "./dataState";
import { SessionState } from "./sessionState";

export interface ViewerState {
    configState: ConfigState;
    dataState: DataState;
    sessionState: SessionState;
    messageLogState: MessageLogState;
}

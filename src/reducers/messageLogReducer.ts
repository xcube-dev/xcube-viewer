import { MessageLogState, newMessageLogState } from '../states/messageLogState';

import { HIDE_MESSAGE, MessageLogAction, POST_MESSAGE } from "../actions/messageLogActions";

let numMessages = 0;

export function messageLogReducer(state: MessageLogState | undefined, action: MessageLogAction): MessageLogState  {
    if (state === undefined) {
        state = newMessageLogState();
    }
    const newMessageLogEntries = state.newEntries;
    switch (action.type) {
        case POST_MESSAGE: {
            const type = action.messageType;
            const text = action.messageText;
            let latestEntry = newMessageLogEntries.length ? newMessageLogEntries[0] : null;
            if (latestEntry && type === latestEntry.type && text === latestEntry.text) {
                return state;
            }
            latestEntry = {id: ++numMessages, type, text};
            return {...state, newEntries: [latestEntry, ...newMessageLogEntries]}
        }
        case HIDE_MESSAGE: {
            const i = newMessageLogEntries.findIndex(e => e.id === action.messageId);
            if (i >= 0) {
                const hiddenEntry = newMessageLogEntries[i];
                const newEntries = [...newMessageLogEntries];
                newEntries.splice(i, 1);
                const oldEntries = [hiddenEntry, ...state.oldEntries];
                return {...state, newEntries, oldEntries}
            }
        }
    }
    return state;
}

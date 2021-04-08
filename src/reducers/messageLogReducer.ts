/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2021 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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

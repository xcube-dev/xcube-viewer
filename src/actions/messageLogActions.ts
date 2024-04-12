/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
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

import { MessageType } from "../states/messageLogState";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const POST_MESSAGE = "POST_MESSAGE";

export interface PostMessage {
  type: typeof POST_MESSAGE;
  messageType: MessageType;
  messageText: string;
}

export function postMessage(
  messageType: MessageType,
  messageText: string | Error,
): PostMessage {
  return {
    type: POST_MESSAGE,
    messageType,
    messageText:
      typeof messageText === "string" ? messageText : messageText.message,
  };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const HIDE_MESSAGE = "HIDE_MESSAGE";

export interface HideMessage {
  type: typeof HIDE_MESSAGE;
  messageId: number;
}

export function hideMessage(messageId: number): HideMessage {
  return { type: HIDE_MESSAGE, messageId };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type MessageLogAction = PostMessage | HideMessage;

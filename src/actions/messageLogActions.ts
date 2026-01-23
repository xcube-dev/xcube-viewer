/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { MessageType } from "@/states/messageLogState";

////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////

export const HIDE_MESSAGE = "HIDE_MESSAGE";

export interface HideMessage {
  type: typeof HIDE_MESSAGE;
  messageId: number;
}

export function hideMessage(messageId: number): HideMessage {
  return { type: HIDE_MESSAGE, messageId };
}

////////////////////////////////////////////////////////////////////////////////

export type MessageLogAction = PostMessage | HideMessage;

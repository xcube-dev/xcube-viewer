import { MessageType } from '../states/messageLogState';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const POST_MESSAGE = 'POST_MESSAGE';
export type POST_MESSAGE = typeof POST_MESSAGE;

export interface PostMessage {
    type: POST_MESSAGE;
    messageType: MessageType;
    messageText: string;
}

export function postMessage(messageType: MessageType, messageText: string | Error): PostMessage {
    return {type: POST_MESSAGE, messageType, messageText: (messageText as any).message || messageText + ''};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const HIDE_MESSAGE = 'HIDE_MESSAGE';
export type HIDE_MESSAGE = typeof HIDE_MESSAGE;

export interface HideMessage {
    type: HIDE_MESSAGE;
    messageId: number;
}

export function hideMessage(messageId: number): HideMessage {
    return {type: HIDE_MESSAGE, messageId};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type MessageLogAction = PostMessage | HideMessage;

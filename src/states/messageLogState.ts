export type MessageType = "error" | "warning" | "info" | "success";

export interface MessageLogEntry {
    id: number;
    type: MessageType;
    text: string;
}

export interface MessageLogState {
    newEntries: MessageLogEntry[];
    oldEntries: MessageLogEntry[];
}

export function newMessageLogState() {
    return {
        newEntries: [],
        oldEntries: [],
    }
}

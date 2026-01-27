/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

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
  };
}

/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { MessageLogState } from "./messageLogState";
import { DataState } from "./dataState";
import { ControlState } from "./controlState";
import { UserAuthState } from "./userAuthState";

export interface AppState {
  dataState: DataState;
  controlState: ControlState;
  messageLogState: MessageLogState;
  userAuthState: UserAuthState;
}

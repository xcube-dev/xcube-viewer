/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { AppState } from "@/states/appState";
import { ChangeLocale, ControlAction } from "@/actions/controlActions";
import { DataAction } from "@/actions/dataActions";
import { MessageLogAction } from "@/actions/messageLogActions";
import { UserAuthAction } from "@/actions/userAuthActions";
import { controlReducer } from "./controlReducer";
import { dataReducer } from "./dataReducer";
import { messageLogReducer } from "./messageLogReducer";
import { userAuthReducer } from "./userAuthReducer";

export function appReducer(
  state: AppState | undefined,
  action: DataAction &
    ControlAction &
    MessageLogAction &
    UserAuthAction &
    ChangeLocale,
): AppState {
  // Not using redux.combineReducers(), because we need to pass app state into controlReducer()
  return {
    dataState: dataReducer(state && state.dataState, action),
    controlState: controlReducer(state && state.controlState, action, state),
    messageLogState: messageLogReducer(state && state.messageLogState, action),
    userAuthState: userAuthReducer(state && state.userAuthState, action),
  };
}

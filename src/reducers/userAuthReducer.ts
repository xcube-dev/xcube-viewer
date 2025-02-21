/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { UPDATE_ACCESS_TOKEN, UserAuthAction } from "@/actions/userAuthActions";
import { newUserAuthState, UserAuthState } from "@/states/userAuthState";

export function userAuthReducer(
  state: UserAuthState | undefined,
  action: UserAuthAction,
): UserAuthState {
  if (state === undefined) {
    state = newUserAuthState();
  }
  switch (action.type) {
    case UPDATE_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.accessToken,
      };
  }
  return state!;
}

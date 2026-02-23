/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

////////////////////////////////////////////////////////////////////////////////

import { Action, Dispatch } from "redux";

import { AppState } from "@/states/appState";
import { updateDatasets } from "./dataActions";

export const UPDATE_ACCESS_TOKEN = "UPDATE_ACCESS_TOKEN";

export interface UpdateAccessToken {
  type: typeof UPDATE_ACCESS_TOKEN;
  accessToken: string | null;
}

export function updateAccessToken(accessToken: string | null) {
  return (dispatch: Dispatch, getState: () => AppState) => {
    const prevAccessToken = getState().userAuthState.accessToken;
    if (prevAccessToken !== accessToken) {
      dispatch(_updateAccessToken(accessToken));
      if (accessToken === null || prevAccessToken === null) {
        dispatch(updateDatasets() as unknown as Action);
      }
    }
  };
}

function _updateAccessToken(accessToken: string | null): UpdateAccessToken {
  return { type: UPDATE_ACCESS_TOKEN, accessToken };
}

////////////////////////////////////////////////////////////////////////////////

export type UserAuthAction = UpdateAccessToken;

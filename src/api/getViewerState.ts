/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { PersistedState } from "@/states/persistedState";
import { callJsonApi, makeRequestInit, makeRequestUrl } from "./callApi";

export function getViewerState(
  apiServerUrl: string,
  accessToken: string | null,
  stateKey: string,
): Promise<PersistedState | string> {
  const url = makeRequestUrl(`${apiServerUrl}/viewer/state`, [
    ["key", stateKey],
  ]);
  return callJsonApi<PersistedState>(url, makeRequestInit(accessToken))
    .then((state) => {
      return state;
    })
    .catch((error) => {
      return `${error}`;
    });
}

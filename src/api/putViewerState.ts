/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { PersistedState } from "@/states/persistedState";
import { callJsonApi, makeRequestInit, makeRequestUrl } from "./callApi";

export function putViewerState(
  apiServerUrl: string,
  accessToken: string | null,
  state: PersistedState,
): Promise<string | undefined> {
  const url = makeRequestUrl(`${apiServerUrl}/viewer/state`, []);
  const init = {
    ...makeRequestInit(accessToken),
    method: "PUT",
    body: JSON.stringify(state),
  };
  try {
    return callJsonApi<{ key: string }>(url, init)
      .then((result) => {
        return result.key;
      })
      .catch((error) => {
        console.error(error);
        return undefined;
      });
  } catch (error) {
    console.error(error);
    return Promise.resolve(undefined);
  }
}

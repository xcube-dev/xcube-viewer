/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { callJsonApi, makeRequestInit, makeRequestUrl } from "./callApi";

export function updateResources(
  apiServerUrl: string,
  accessToken: string | null,
): Promise<boolean> {
  const url = makeRequestUrl(`${apiServerUrl}/maintenance/update`, []);
  const init = makeRequestInit(accessToken);
  try {
    return callJsonApi<boolean>(url, init)
      .then(() => {
        return true;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  } catch (error) {
    console.error(error);
    return Promise.resolve(false);
  }
}

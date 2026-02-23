/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { makeRequestUrl } from "./callApi";

export function hasViewerStateApi(apiServerUrl: string): Promise<boolean> {
  const url = makeRequestUrl(`${apiServerUrl}/viewer/state`, [
    ["key", "sentinel"],
  ]);
  try {
    return fetch(url)
      .then((response) => {
        // status 501 = "Not Implemented"
        return response.status !== 501;
      })
      .catch(() => {
        return false;
      });
  } catch (_) {
    return Promise.resolve(false);
  }
}

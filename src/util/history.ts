/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { Action, createBrowserHistory, Location } from "history";

const history = createBrowserHistory();

if (import.meta.env.DEV) {
  history.listen((location: Location, action: Action) => {
    if (import.meta.env.DEV) {
      console.debug(`history ${action}:`, location);
    }
  });
}

export default history;

/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { Dispatch, Store } from "redux";
import { initializeContributions } from "chartlets";
import mui from "chartlets/plugins/mui";
import vega from "chartlets/plugins/vega";

import { AppState } from "@/states/appState";
import { selectedServerSelector } from "@/selectors/controlSelectors";
import { newDerivedStore } from "./store";
import { loggingEnabled } from "./config";
import xc_viewer from "./plugin";

export function initializeExtensions(store: Store) {
  return (_dispatch: Dispatch, getState: () => AppState) => {
    const apiServer = selectedServerSelector(getState());
    initializeContributions({
      plugins: [mui(), vega(), xc_viewer()],
      hostStore: newDerivedStore(store),
      logging: { enabled: loggingEnabled },
      api: {
        serverUrl: apiServer.url,
        endpointName: "viewer/ext",
      },
    });
  };
}

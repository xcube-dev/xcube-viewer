import { Dispatch, Store } from "redux";
import { initializeContributions } from "chartlets";

import { AppState } from "@/states/appState";
import { selectedServerSelector } from "@/selectors/controlSelectors";
import { newDerivedStore } from "./store";

export function initializeExtensions(store: Store) {
  return (_dispatch: Dispatch, getState: () => AppState) => {
    const apiServer = selectedServerSelector(getState());
    initializeContributions({
      hostStore: newDerivedStore(store),
      logging: { enabled: import.meta.env.DEV },
      api: {
        serverUrl: apiServer.url,
        endpointName: "viewer/ext",
      },
    });
  };
}

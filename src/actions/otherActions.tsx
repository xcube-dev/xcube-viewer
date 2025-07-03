/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { Dispatch } from "redux";
import { default as OlView } from "ol/View";

import { PersistedMapState, PersistedState } from "@/states/persistedState";
import { MAP_OBJECTS } from "@/states/controlState";
import { default as OlMap } from "ol/Map";

////////////////////////////////////////////////////////////////////////////////

export const APPLY_PERSISTED_STATE = "APPLY_PERSISTED_STATE";

export interface ApplyPersistedState {
  type: typeof APPLY_PERSISTED_STATE;
  persistedState: PersistedState;
}

export function applyPersistentState(persistedState: PersistedState) {
  return (dispatch: Dispatch) => {
    console.debug("Restoring persisted state:", persistedState);
    dispatch(_applyPersistentState(persistedState));
    const { mapState } = persistedState.state;
    if (mapState) {
      restoreMapView(mapState);
    }
  };
}

function _applyPersistentState(
  persistedState: PersistedState,
): ApplyPersistedState {
  return { type: APPLY_PERSISTED_STATE, persistedState };
}

function restoreMapView(mapState: PersistedMapState) {
  if (MAP_OBJECTS["map"]) {
    console.debug("Restoring map:", mapState);
    const map = MAP_OBJECTS["map"] as OlMap;
    map.setView(new OlView(mapState.view));
  }
}

export function getHiddenElements(element: HTMLElement | null) {
  if (!element) return [];

  return [
    // Map Elements
    element.querySelector(".ol-unselectable.ol-control.MuiBox-root.css-0"),
    element.querySelector(".ol-zoom.ol-unselectable.ol-control"),
    // Statistics-Panel Elements
    element.querySelector("#statistics-row-buttons"),
  ].filter(Boolean) as HTMLElement[];
}

////////////////////////////////////////////////////////////////////////////////

export type OtherAction = ApplyPersistedState;

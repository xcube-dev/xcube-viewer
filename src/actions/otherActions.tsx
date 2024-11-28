/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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
    console.log("Restoring map:", mapState);
    const map = MAP_OBJECTS["map"] as OlMap;
    map.setView(new OlView(mapState.view));
  }
}

////////////////////////////////////////////////////////////////////////////////

export type OtherAction = ApplyPersistedState;

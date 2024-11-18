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

import version from "@/version";
import { AppState } from "./appState";
import { ControlState, MAP_OBJECTS } from "./controlState";
import { DataState } from "./dataState";
import { default as OlMap } from "ol/Map";
import { selectedServerSelector } from "@/selectors/controlSelectors";
import baseUrl from "@/util/baseurl";

const dataStateProps: readonly (keyof DataState)[] = [
  "userPlaceGroups",
  "timeSeriesGroups",
  "statistics",
];

const controlStateProps: readonly (keyof ControlState)[] = [
  "selectedDatasetId",
  "selectedVariableName",
  "selectedDataset2Id",
  "selectedVariable2Name",
  "selectedTime",
  "selectedTimeRange",
  "selectedUserPlaceId",
  "selectedPlaceId",
  "selectedPlaceGroupIds",
  "sidebarPanelId",
  "layerMenuOpen",
  "sidebarOpen",
  "sidebarPosition",
  "variableSplitPos",
  "variableCompareMode",
  "selectedBaseMapId",
  "selectedOverlayId",
  "userBaseMaps",
  "userOverlays",
  "userColorBars",
  "mapProjection",
];

type PersistedDataState = Pick<DataState, (typeof dataStateProps)[number]>;
type PersistedControlState = Pick<
  ControlState,
  (typeof controlStateProps)[number]
>;

export interface PersistedMapState {
  view: {
    projection: string;
    center: number[];
    zoom?: number;
    rotation?: number;
  };
}

export interface PersistedState {
  version: string;
  creationDate: string;
  apiUrl: string;
  viewerUrl: string;
  state: {
    dataState: PersistedDataState;
    controlState: PersistedControlState;
    mapState?: PersistedMapState;
  };
}

export function newPersistentAppState(appState: AppState): PersistedState {
  return {
    version,
    creationDate: new Date().toUTCString(),
    apiUrl: selectedServerSelector(appState).url,
    viewerUrl: baseUrl.origin,
    state: {
      dataState: newSubsetState(appState.dataState, dataStateProps),
      controlState: newSubsetState(appState.controlState, controlStateProps),
      mapState: newMapState(),
    },
  };
}

function newSubsetState<S, A extends readonly (keyof S)[]>(
  state: S,
  keys: A,
): Pick<S, A[number]> {
  const subsetState: Record<string, unknown> = {};
  keys.forEach((k) => {
    subsetState[k as string] = state[k];
  });
  return subsetState as Pick<S, A[number]>;
}

function newMapState(): PersistedMapState | undefined {
  if (MAP_OBJECTS["map"]) {
    const map = MAP_OBJECTS["map"] as OlMap;
    const view = map.getView();
    const projection = view.getProjection().getCode();
    const center = view.getCenter();
    if (center !== undefined) {
      const zoom = view.getZoom();
      const rotation = view.getRotation();
      return { view: { projection, center, zoom, rotation } };
    }
  }
  return undefined;
}

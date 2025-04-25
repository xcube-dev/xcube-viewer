/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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
  "datasets",
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
  "layerMenuOpen",
  "layerVisibilities",
  "sidePanelOpen",
  "sidePanelId",
  "sidePanelSize",
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

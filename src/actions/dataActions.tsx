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

import { Action, Dispatch, Store } from "redux";
import * as geojson from "geojson";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import * as api from "@/api";
import i18n from "@/i18n";
import { appParams } from "@/config";
import { ApiServerConfig, ApiServerInfo } from "@/model/apiServer";
import { ColorBar, ColorBars } from "@/model/colorBar";
import { Dataset, getDatasetUserVariables } from "@/model/dataset";
import {
  findPlaceInPlaceGroups,
  Place,
  PlaceGroup,
  PlaceStyle,
} from "@/model/place";
import { getUserPlacesFromCsv } from "@/model/user-place/csv";
import { getUserPlacesFromGeoJson } from "@/model/user-place/geojson";
import { getUserPlacesFromWkt } from "@/model/user-place/wkt";
import {
  TimeSeries,
  TimeSeriesGroup,
  timeSeriesGroupsToTable,
} from "@/model/timeSeries";
import { initializeExtensions } from "@/ext/actions";
import {
  mapProjectionSelector,
  selectedDatasetSelector,
  selectedDatasetTimeDimensionSelector,
  selectedDatasetTimeLabelSelector,
  selectedPlaceGroupPlacesSelector,
  selectedPlaceGroupsSelector,
  selectedPlaceIdSelector,
  selectedPlaceInfoSelector,
  selectedPlaceSelector,
  selectedServerSelector,
  selectedTimeChunkSizeSelector,
  selectedVariableSelector,
  userPlacesFormatNameSelector,
  userPlacesFormatOptionsCsvSelector,
  userPlacesFormatOptionsGeoJsonSelector,
  userPlacesFormatOptionsWktSelector,
} from "@/selectors/controlSelectors";
import {
  datasetsSelector,
  placeGroupsSelector,
  userPlaceGroupsSelector,
} from "@/selectors/dataSelectors";
import { AppState } from "@/states/appState";
import { VolumeRenderMode } from "@/states/controlState";
import { ColorBarNorm } from "@/model/variable";
import { StatisticsRecord } from "@/model/statistics";
import { ExpressionCapabilities, UserVariable } from "@/model/userVariable";
import { loadUserVariables, storeUserVariables } from "@/states/userSettings";
import { MessageLogAction, postMessage } from "./messageLogActions";
import { renameUserPlaceInLayer, restyleUserPlaceInLayer } from "./mapActions";
import {
  AddActivity,
  addActivity,
  openDialog,
  RemoveActivity,
  removeActivity,
  SelectDataset,
  selectDataset,
  selectPlace,
  SetSidebarOpen,
  setSidebarOpen,
  SetSidebarPanelId,
  setSidebarPanelId,
} from "./controlActions";
import baseUrl from "@/util/baseurl";
import { newPersistentAppState, PersistedState } from "@/states/persistedState";
import { applyPersistentState } from "@/actions/otherActions";

////////////////////////////////////////////////////////////////////////////////

export const UPDATE_SERVER_INFO = "UPDATE_SERVER_INFO";

export interface UpdateServerInfo {
  type: typeof UPDATE_SERVER_INFO;
  serverInfo: ApiServerInfo;
}

export function updateServerInfo() {
  return (
    dispatch: Dispatch<
      UpdateServerInfo | AddActivity | RemoveActivity | MessageLogAction
    >,
    getState: () => AppState,
  ) => {
    const apiServer = selectedServerSelector(getState());

    dispatch(addActivity(UPDATE_SERVER_INFO, i18n.get("Connecting to server")));

    api
      .getServerInfo(apiServer.url)
      .then((serverInfo: ApiServerInfo) => {
        dispatch(_updateServerInfo(serverInfo));
      })
      .catch((error: Error) => {
        dispatch(postMessage("error", error));
      })
      // 'then' because Microsoft Edge does not understand method finally
      .then(() => {
        dispatch(removeActivity(UPDATE_SERVER_INFO));
      });
  };
}

export function _updateServerInfo(serverInfo: ApiServerInfo): UpdateServerInfo {
  return { type: UPDATE_SERVER_INFO, serverInfo };
}

////////////////////////////////////////////////////////////////////////////////

const SHARE_STATE_PERMALINK = "SHARE_STATE_PERMALINK";

export function shareStatePermalink() {
  return (
    dispatch: Dispatch<AddActivity | RemoveActivity | MessageLogAction>,
    getState: () => AppState,
  ) => {
    const apiServer = selectedServerSelector(getState());
    dispatch(
      addActivity(SHARE_STATE_PERMALINK, i18n.get("Creating permalink")),
    );
    api
      .putViewerState(
        apiServer.url,
        getState().userAuthState.accessToken,
        newPersistentAppState(getState()),
      )
      .then((stateKey) => {
        if (stateKey) {
          const viewerUrl = `${baseUrl.origin}?stateKey=${stateKey}`;
          navigator.clipboard.writeText(viewerUrl).then(() => {
            dispatch(
              postMessage("success", i18n.get("Permalink copied to clipboard")),
            );
          });
        } else {
          dispatch(
            postMessage("error", i18n.get("Failed to create permalink")),
          );
        }
      })
      .finally(() => dispatch(removeActivity(SHARE_STATE_PERMALINK)));
  };
}

////////////////////////////////////////////////////////////////////////////////

export const UPDATE_RESOURCES = "UPDATE_RESOURCES";

export function updateResources() {
  return (
    dispatch: Dispatch<
      | UpdateDatasets
      | SelectDataset
      | AddActivity
      | RemoveActivity
      | MessageLogAction
    >,
    getState: () => AppState,
  ) => {
    const apiServer = selectedServerSelector(getState());
    dispatch(addActivity(UPDATE_RESOURCES, i18n.get("Updating resources")));
    api
      .updateResources(apiServer.url, getState().userAuthState.accessToken)
      .then((ok) => {
        if (ok) {
          window.location.reload();
        }
      })
      .finally(() => dispatch(removeActivity(UPDATE_RESOURCES)));
  };
}

////////////////////////////////////////////////////////////////////////////////

export const UPDATE_DATASETS = "UPDATE_DATASETS";

export interface UpdateDatasets {
  type: typeof UPDATE_DATASETS;
  datasets: Dataset[];
}

export function updateDatasets() {
  return (dispatch: Dispatch, getState: () => AppState) => {
    const apiServer = selectedServerSelector(getState());

    dispatch(addActivity(UPDATE_DATASETS, i18n.get("Loading data")));

    api
      .getDatasets(apiServer.url, getState().userAuthState.accessToken)
      .then((datasets: Dataset[]) => {
        // Add user variables from local storage
        const userVariables = loadUserVariables();
        datasets = datasets.map((ds) => ({
          ...ds,
          variables: [...ds.variables, ...(userVariables[ds.id] || [])],
        }));
        // Dispatch updated dataset
        dispatch(_updateDatasets(datasets));
        // Adjust selection state
        if (datasets.length > 0) {
          const selectedDatasetId =
            getState().controlState.selectedDatasetId || datasets[0].id;
          dispatch(
            selectDataset(
              selectedDatasetId,
              datasets,
              true,
            ) as unknown as Action,
          );
        }
      })
      .catch((error: Error) => {
        dispatch(postMessage("error", error));
        dispatch(_updateDatasets([]));
      })
      // 'then' because Microsoft Edge does not understand method finally
      .then(() => {
        dispatch(removeActivity(UPDATE_DATASETS));
      });
  };
}

export function _updateDatasets(datasets: Dataset[]): UpdateDatasets {
  return { type: UPDATE_DATASETS, datasets };
}

////////////////////////////////////////////////////////////////////////////////

export function updateDatasetUserVariables(
  datasetId: string,
  variables: UserVariable[],
) {
  return (dispatch: Dispatch, getState: () => AppState) => {
    dispatch(_updateDatasetUserVariables(datasetId, variables));
    const userVariables: Record<string, UserVariable[]> = {};
    getState().dataState.datasets.forEach((dataset) => {
      const [_, variables] = getDatasetUserVariables(dataset);
      if (variables.length >= 0) {
        userVariables[dataset.id] = variables;
      }
    });
    storeUserVariables(userVariables);
  };
}

export const UPDATE_DATASET_USER_VARIABLES = "UPDATE_DATASET_USER_VARIABLES";

export interface UpdateDatasetUserVariables {
  type: typeof UPDATE_DATASET_USER_VARIABLES;
  datasetId: string;
  userVariables: UserVariable[];
}

export function _updateDatasetUserVariables(
  datasetId: string,
  userVariables: UserVariable[],
): UpdateDatasetUserVariables {
  return { type: UPDATE_DATASET_USER_VARIABLES, datasetId, userVariables };
}

////////////////////////////////////////////////////////////////////////////////

export const UPDATE_DATASET_PLACE_GROUP = "UPDATE_DATASET_PLACE_GROUP";

export interface UpdateDatasetPlaceGroup {
  type: typeof UPDATE_DATASET_PLACE_GROUP;
  datasetId: string;
  placeGroup: PlaceGroup;
}

export function updateDatasetPlaceGroup(
  datasetId: string,
  placeGroup: PlaceGroup,
): UpdateDatasetPlaceGroup {
  return { type: UPDATE_DATASET_PLACE_GROUP, datasetId, placeGroup };
}

////////////////////////////////////////////////////////////////////////////////

export const ADD_DRAWN_USER_PLACE = "ADD_DRAWN_USER_PLACE";

export interface AddDrawnUserPlace {
  type: typeof ADD_DRAWN_USER_PLACE;
  placeGroupTitle: string;
  id: string;
  properties: { [name: string]: unknown };
  geometry: geojson.Geometry;
  selected: boolean;
}

export function addDrawnUserPlace(
  placeGroupTitle: string,
  id: string,
  properties: { [name: string]: unknown },
  geometry: geojson.Geometry,
  selected: boolean,
) {
  return (dispatch: Dispatch, getState: () => AppState) => {
    dispatch(
      _addDrawnUserPlace(placeGroupTitle, id, properties, geometry, selected),
    );
    if (
      getState().controlState.autoShowTimeSeries &&
      getState().controlState.selectedPlaceId === id
    ) {
      dispatch(addTimeSeries() as unknown as Action);
    }
  };
}

export function _addDrawnUserPlace(
  placeGroupTitle: string,
  id: string,
  properties: { [name: string]: unknown },
  geometry: geojson.Geometry,
  selected: boolean,
): AddDrawnUserPlace {
  return {
    type: ADD_DRAWN_USER_PLACE,
    placeGroupTitle,
    id,
    properties,
    geometry,
    selected,
  };
}

////////////////////////////////////////////////////////////////////////////////

export const ADD_IMPORTED_USER_PLACE_GROUPS = "ADD_IMPORTED_USER_PLACES";

export interface AddImportedUserPlaces {
  type: typeof ADD_IMPORTED_USER_PLACE_GROUPS;
  placeGroups: PlaceGroup[];
  mapProjection: string;
  selected: boolean;
}

export function addImportedUserPlaces(
  placeGroups: PlaceGroup[],
  mapProjection: string,
  selected: boolean,
): AddImportedUserPlaces {
  return {
    type: ADD_IMPORTED_USER_PLACE_GROUPS,
    placeGroups,
    mapProjection,
    selected,
  };
}

////////////////////////////////////////////////////////////////////////////////

export function importUserPlacesFromText(text: string) {
  return (dispatch: Dispatch, getState: () => AppState) => {
    const formatName = userPlacesFormatNameSelector(getState());
    let placeGroups: PlaceGroup[];
    try {
      if (formatName === "csv") {
        const options = userPlacesFormatOptionsCsvSelector(getState());
        placeGroups = getUserPlacesFromCsv(text, options);
      } else if (formatName === "geojson") {
        const options = userPlacesFormatOptionsGeoJsonSelector(getState());
        placeGroups = getUserPlacesFromGeoJson(text, options);
      } else if (formatName === "wkt") {
        const options = userPlacesFormatOptionsWktSelector(getState());
        placeGroups = getUserPlacesFromWkt(text, options);
      } else {
        placeGroups = [];
      }
    } catch (error: unknown) {
      dispatch(postMessage("error", error as Error));
      dispatch(openDialog("addUserPlacesFromText"));
      placeGroups = [];
    }
    if (placeGroups.length > 0) {
      dispatch(
        addImportedUserPlaces(
          placeGroups,
          mapProjectionSelector(getState()),
          true,
        ),
      );
      // dispatch(selectPlaceGroups(placeGroups.map(pg => pg.id)) as any);
      if (placeGroups.length === 1 && placeGroups[0].features.length === 1) {
        const place = placeGroups[0].features[0];
        dispatch(
          selectPlace(
            place.id,
            selectedPlaceGroupPlacesSelector(getState()),
            true,
          ) as unknown as Action,
        );
        if (getState().controlState.autoShowTimeSeries) {
          dispatch(addTimeSeries() as unknown as Action);
        }
      }
      let numPlaces = 0;
      placeGroups.forEach((placeGroup) => {
        numPlaces += placeGroup.features ? placeGroup.features.length : 0;
      });
      dispatch(
        postMessage(
          "info",
          i18n.get(
            `Imported ${numPlaces} place(s) in ${placeGroups.length} groups(s), 1 selected`,
          ),
        ),
      );
    } else {
      dispatch(postMessage("warning", i18n.get("No places imported")));
    }
  };
}

////////////////////////////////////////////////////////////////////////////////

export const RENAME_USER_PLACE_GROUP = "RENAME_USER_PLACE_GROUP";

export interface RenameUserPlaceGroup {
  type: typeof RENAME_USER_PLACE_GROUP;
  placeGroupId: string;
  newName: string;
}

export function renameUserPlaceGroup(
  placeGroupId: string,
  newName: string,
): RenameUserPlaceGroup {
  return { type: RENAME_USER_PLACE_GROUP, placeGroupId, newName };
}

////////////////////////////////////////////////////////////////////////////////

export const RENAME_USER_PLACE = "RENAME_USER_PLACE";

export interface RenameUserPlace {
  type: typeof RENAME_USER_PLACE;
  placeGroupId: string;
  placeId: string;
  newName: string;
}

export function renameUserPlace(
  placeGroupId: string,
  placeId: string,
  newName: string,
) {
  return (dispatch: Dispatch<RenameUserPlace>) => {
    dispatch(_renameUserPlace(placeGroupId, placeId, newName));
    renameUserPlaceInLayer(placeGroupId, placeId, newName);
  };
}

export function _renameUserPlace(
  placeGroupId: string,
  placeId: string,
  newName: string,
): RenameUserPlace {
  return { type: RENAME_USER_PLACE, placeGroupId, placeId, newName };
}

////////////////////////////////////////////////////////////////////////////////

export const RESTYLE_USER_PLACE = "RESTYLE_USER_PLACE";

export interface RestyleUserPlace {
  type: typeof RESTYLE_USER_PLACE;
  placeGroupId: string;
  placeId: string;
  placeStyle: PlaceStyle;
}

export function restyleUserPlace(
  placeGroupId: string,
  placeId: string,
  placeStyle: PlaceStyle,
) {
  return (dispatch: Dispatch<RestyleUserPlace>) => {
    dispatch(_restyleUserPlace(placeGroupId, placeId, placeStyle));
    restyleUserPlaceInLayer(placeGroupId, placeId, placeStyle);
  };
}

export function _restyleUserPlace(
  placeGroupId: string,
  placeId: string,
  placeStyle: PlaceStyle,
): RestyleUserPlace {
  return { type: RESTYLE_USER_PLACE, placeGroupId, placeId, placeStyle };
}

////////////////////////////////////////////////////////////////////////////////

export const REMOVE_USER_PLACE = "REMOVE_USER_PLACE";

export interface RemoveUserPlace {
  type: typeof REMOVE_USER_PLACE;
  placeGroupId: string;
  placeId: string;
  places: Place[];
}

export function removeUserPlace(
  placeGroupId: string,
  placeId: string,
  places: Place[],
): RemoveUserPlace {
  return { type: REMOVE_USER_PLACE, placeGroupId, placeId, places };
}

////////////////////////////////////////////////////////////////////////////////

export const REMOVE_USER_PLACE_GROUP = "REMOVE_USER_PLACE_GROUP";

export interface RemoveUserPlaceGroup {
  type: typeof REMOVE_USER_PLACE_GROUP;
  placeGroupId: string;
}

export function removeUserPlaceGroup(
  placeGroupId: string,
): RemoveUserPlaceGroup {
  return { type: REMOVE_USER_PLACE_GROUP, placeGroupId };
}

////////////////////////////////////////////////////////////////////////////////

export function addStatistics() {
  return (
    dispatch: Dispatch<
      SetSidebarOpen | SetSidebarPanelId | AddStatistics | MessageLogAction
    >,
    getState: () => AppState,
  ) => {
    const apiServer = selectedServerSelector(getState());

    const selectedDataset = selectedDatasetSelector(getState());
    const selectedVariable = selectedVariableSelector(getState());
    const selectedPlaceInfo = selectedPlaceInfoSelector(getState());
    const selectedTimeLabel = selectedDatasetTimeLabelSelector(getState());
    const sidebarOpen = getState().controlState.sidebarOpen;
    const sidebarPanelId = getState().controlState.sidebarPanelId;

    if (!(selectedDataset && selectedVariable && selectedPlaceInfo)) {
      return;
    }

    if (sidebarPanelId !== "stats") {
      dispatch(setSidebarPanelId("stats"));
    }
    if (!sidebarOpen) {
      dispatch(setSidebarOpen(true));
    }
    dispatch(_addStatistics(null));
    api
      .getStatistics(
        apiServer.url,
        selectedDataset,
        selectedVariable,
        selectedPlaceInfo,
        selectedTimeLabel,
        getState().userAuthState.accessToken,
      )
      .then((stats) => dispatch(_addStatistics(stats)))
      .catch((error: Error) => {
        dispatch(postMessage("error", error));
      });
  };
}

export const ADD_STATISTICS = "ADD_STATISTICS";

export interface AddStatistics {
  type: typeof ADD_STATISTICS;
  statistics: StatisticsRecord | null;
}

export function _addStatistics(
  statistics: StatisticsRecord | null,
): AddStatistics {
  return { type: ADD_STATISTICS, statistics };
}

////////////////////////////////////////////////////////////////////////////////

export const REMOVE_STATISTICS = "REMOVE_STATISTICS";

export interface RemoveStatistics {
  type: typeof REMOVE_STATISTICS;
  index: number;
}

export function removeStatistics(index: number): RemoveStatistics {
  return { type: REMOVE_STATISTICS, index };
}

////////////////////////////////////////////////////////////////////////////////

export function addTimeSeries() {
  return (
    dispatch: Dispatch<
      SetSidebarOpen | SetSidebarPanelId | UpdateTimeSeries | MessageLogAction
    >,
    getState: () => AppState,
  ) => {
    const apiServer = selectedServerSelector(getState());

    const selectedDataset = selectedDatasetSelector(getState());
    const selectedDatasetTimeDim =
      selectedDatasetTimeDimensionSelector(getState());
    const selectedVariable = selectedVariableSelector(getState());
    const selectedPlaceId = selectedPlaceIdSelector(getState());
    const selectedPlace = selectedPlaceSelector(getState())!;
    const timeSeriesUpdateMode = getState().controlState.timeSeriesUpdateMode;
    const useMedian = getState().controlState.timeSeriesUseMedian;
    const includeStdev = getState().controlState.timeSeriesIncludeStdev;
    let timeChunkSize = selectedTimeChunkSizeSelector(getState());
    const sidebarOpen = getState().controlState.sidebarOpen;
    const sidebarPanelId = getState().controlState.sidebarPanelId;

    const placeGroups = placeGroupsSelector(getState());

    if (
      selectedDataset &&
      selectedVariable &&
      selectedPlaceId &&
      selectedDatasetTimeDim
    ) {
      if (sidebarPanelId !== "timeSeries") {
        dispatch(setSidebarPanelId("timeSeries"));
      }
      if (!sidebarOpen) {
        dispatch(setSidebarOpen(true));
      }

      const timeLabels = selectedDatasetTimeDim.labels;
      const numTimeLabels = timeLabels.length;

      timeChunkSize = timeChunkSize > 0 ? timeChunkSize : numTimeLabels;

      let endTimeIndex = numTimeLabels - 1;
      let startTimeIndex = endTimeIndex - timeChunkSize + 1;

      const getTimeSeriesChunk = () => {
        const startDateLabel =
          startTimeIndex >= 0 ? timeLabels[startTimeIndex] : null;
        const endDateLabel = timeLabels[endTimeIndex];
        return api.getTimeSeriesForGeometry(
          apiServer.url,
          selectedDataset,
          selectedVariable,
          selectedPlace.id,
          selectedPlace.geometry,
          startDateLabel,
          endDateLabel,
          useMedian,
          includeStdev,
          getState().userAuthState.accessToken,
        );
      };

      const successAction = (timeSeries: TimeSeries | null) => {
        if (
          timeSeries !== null &&
          isValidPlace(placeGroups, selectedPlace.id)
        ) {
          const hasMore = startTimeIndex > 0;
          const dataProgress = hasMore
            ? (numTimeLabels - startTimeIndex) / numTimeLabels
            : 1.0;
          dispatch(
            updateTimeSeries(
              { ...timeSeries, dataProgress },
              timeSeriesUpdateMode,
              endTimeIndex === numTimeLabels - 1 ? "new" : "append",
            ),
          );
          if (hasMore && isValidPlace(placeGroups, selectedPlace.id)) {
            // TODO (forman): Exit loop if current time-series is no longer alive.
            //      We currently keep this loop busy although this time-series
            //      may have been removed already!
            //      For this, introduce time-series ID.
            startTimeIndex -= timeChunkSize;
            endTimeIndex -= timeChunkSize;
            getTimeSeriesChunk().then(successAction);
          }
        } else {
          dispatch(postMessage("info", "No data found here"));
        }
      };

      getTimeSeriesChunk()
        .then(successAction)
        .catch((error: Error) => {
          dispatch(postMessage("error", error));
        });
    }
  };
}

function isValidPlace(placeGroups: PlaceGroup[], placeId: string) {
  return findPlaceInPlaceGroups(placeGroups, placeId) !== null;
}

////////////////////////////////////////////////////////////////////////////////

export const UPDATE_TIME_SERIES = "UPDATE_TIME_SERIES";

export interface UpdateTimeSeries {
  type: typeof UPDATE_TIME_SERIES;
  timeSeries: TimeSeries;
  updateMode: "add" | "replace" | "remove";
  dataMode: "new" | "append";
}

export function updateTimeSeries(
  timeSeries: TimeSeries,
  updateMode: "add" | "replace" | "remove",
  dataMode: "new" | "append",
): UpdateTimeSeries {
  return { type: UPDATE_TIME_SERIES, timeSeries, updateMode, dataMode };
}

////////////////////////////////////////////////////////////////////////////////

export const ADD_PLACE_GROUP_TIME_SERIES = "ADD_PLACE_GROUP_TIME_SERIES";

export interface AddPlaceGroupTimeSeries {
  type: typeof ADD_PLACE_GROUP_TIME_SERIES;
  timeSeriesGroupId: string;
  timeSeries: TimeSeries;
}

export function addPlaceGroupTimeSeries(
  timeSeriesGroupId: string,
  timeSeries: TimeSeries,
): AddPlaceGroupTimeSeries {
  return { type: ADD_PLACE_GROUP_TIME_SERIES, timeSeriesGroupId, timeSeries };
}

////////////////////////////////////////////////////////////////////////////////

export const REMOVE_TIME_SERIES = "REMOVE_TIME_SERIES";

export interface RemoveTimeSeries {
  type: typeof REMOVE_TIME_SERIES;
  groupId: string;
  index: number;
}

export function removeTimeSeries(
  groupId: string,
  index: number,
): RemoveTimeSeries {
  return { type: REMOVE_TIME_SERIES, groupId, index };
}

////////////////////////////////////////////////////////////////////////////////

export const REMOVE_TIME_SERIES_GROUP = "REMOVE_TIME_SERIES_GROUP";

export interface RemoveTimeSeriesGroup {
  type: typeof REMOVE_TIME_SERIES_GROUP;
  id: string;
}

export function removeTimeSeriesGroup(id: string): RemoveTimeSeriesGroup {
  return { type: REMOVE_TIME_SERIES_GROUP, id };
}

////////////////////////////////////////////////////////////////////////////////

export const REMOVE_ALL_TIME_SERIES = "REMOVE_ALL_TIME_SERIES";

export interface RemoveAllTimeSeries {
  type: typeof REMOVE_ALL_TIME_SERIES;
}

export function removeAllTimeSeries(): RemoveAllTimeSeries {
  return { type: REMOVE_ALL_TIME_SERIES };
}

////////////////////////////////////////////////////////////////////////////////

export const CONFIGURE_SERVERS = "CONFIGURE_SERVERS";

export interface ConfigureServers {
  type: typeof CONFIGURE_SERVERS;
  servers: ApiServerConfig[];
  selectedServerId: string;
}

export function configureServers(
  servers: ApiServerConfig[],
  selectedServerId: string,
  store: Store,
) {
  return (dispatch: Dispatch, getState: () => AppState) => {
    if (getState().controlState.selectedServerId !== selectedServerId) {
      dispatch(removeAllTimeSeries());
      dispatch(_configureServers(servers, selectedServerId));
      dispatch(syncWithServer(store) as unknown as Action);
    } else if (getState().dataState.userServers !== servers) {
      dispatch(_configureServers(servers, selectedServerId));
    }
  };
}

export function _configureServers(
  servers: ApiServerConfig[],
  selectedServerId: string,
): ConfigureServers {
  return { type: CONFIGURE_SERVERS, servers, selectedServerId };
}

////////////////////////////////////////////////////////////////////////////////

export function syncWithServer(store: Store, init: boolean = false) {
  return (dispatch: Dispatch, getState: () => AppState) => {
    dispatch(updateServerInfo() as unknown as Action);
    dispatch(updateDatasets() as unknown as Action);
    dispatch(updateExpressionCapabilities() as unknown as Action);
    dispatch(updateColorBars() as unknown as Action);
    dispatch(initializeExtensions(store) as unknown as Action);

    const stateKey = appParams.get("stateKey");
    if (stateKey && init) {
      const serverUrl = selectedServerSelector(store.getState()).url;
      api
        .getViewerState(
          serverUrl,
          getState().userAuthState.accessToken,
          stateKey,
        )
        .then((stateResult) => {
          if (typeof stateResult === "object") {
            const persistedState = stateResult as PersistedState;
            const { apiUrl } = persistedState as PersistedState;
            if (apiUrl === serverUrl) {
              dispatch(
                applyPersistentState(persistedState) as unknown as Action,
              );
            } else {
              dispatch(
                postMessage(
                  "warning",
                  "Failed to restore state, backend mismatch",
                ),
              );
            }
          } else {
            dispatch(postMessage("warning", stateResult));
          }
        });
    }
  };
}

function newHostStore(store: Store): StoreApi<AppState> & {
  _initialState: AppState;
  _prevState: AppState;
} {
  return {
    _initialState: store.getState(),
    getInitialState(): AppState {
      // noinspection JSPotentiallyInvalidUsageOfThis
      return this._initialState;
    },
    getState(): AppState {
      return store.getState();
    },
    setState(
      _state:
        | AppState
        | Partial<AppState>
        | ((state: AppState) => AppState | Partial<AppState>),
      _replace?: boolean,
    ): void {
      throw new Error(
        "Changing the host state from contributions is not yet supported",
      );
    },
    _prevState: store.getState(),
    subscribe(
      listener: (store: AppState, prevState: AppState) => void,
    ): () => void {
      return store.subscribe(() => {
        const state = store.getState();
        if (state !== this._prevState) {
          listener(state, this._prevState);
          this._prevState = state;
        }
      });
    },
  };
}

////////////////////////////////////////////////////////////////////////////////

export const UPDATE_EXPRESSION_CAPABILITIES = "UPDATE_EXPRESSION_CAPABILITIES";

export interface UpdateExpressionCapabilities {
  type: typeof UPDATE_EXPRESSION_CAPABILITIES;
  expressionCapabilities: ExpressionCapabilities;
}

export function updateExpressionCapabilities() {
  return (
    dispatch: Dispatch<UpdateExpressionCapabilities | MessageLogAction>,
    getState: () => AppState,
  ) => {
    const apiServer = selectedServerSelector(getState());

    api
      .getExpressionCapabilities(apiServer.url)
      .then((expressionCapabilities: ExpressionCapabilities) => {
        dispatch(_updateExpressionCapabilities(expressionCapabilities));
      })
      .catch((error: Error) => {
        dispatch(postMessage("error", error));
      });
  };
}

export function _updateExpressionCapabilities(
  expressionCapabilities: ExpressionCapabilities,
): UpdateExpressionCapabilities {
  return {
    type: UPDATE_EXPRESSION_CAPABILITIES,
    expressionCapabilities: expressionCapabilities,
  };
}

////////////////////////////////////////////////////////////////////////////////

export const UPDATE_COLOR_BARS = "UPDATE_COLOR_BARS";

export interface UpdateColorBars {
  type: typeof UPDATE_COLOR_BARS;
  colorBars: ColorBars;
}

export function updateColorBars() {
  return (
    dispatch: Dispatch<UpdateColorBars | MessageLogAction>,
    getState: () => AppState,
  ) => {
    const apiServer = selectedServerSelector(getState());

    api
      .getColorBars(apiServer.url)
      .then((colorBars: ColorBars) => {
        dispatch(_updateColorBars(colorBars));
      })
      .catch((error: Error) => {
        dispatch(postMessage("error", error));
      });
  };
}

export function _updateColorBars(colorBars: ColorBars): UpdateColorBars {
  return { type: UPDATE_COLOR_BARS, colorBars };
}

////////////////////////////////////////////////////////////////////////////////

export const UPDATE_VARIABLE_COLOR_BAR = "UPDATE_VARIABLE_COLOR_BAR";

export interface UpdateVariableColorBar {
  type: typeof UPDATE_VARIABLE_COLOR_BAR;
  datasetId: string;
  variableName: string;
  colorBarName: string;
  colorBarMinMax: [number, number];
  colorBarNorm: ColorBarNorm;
  opacity: number;
}

export function updateVariableColorBar(
  colorBarName: string,
  colorBarMinMax: [number, number],
  colorBarNorm: ColorBarNorm,
  opacity: number,
) {
  return (
    dispatch: Dispatch<UpdateVariableColorBar>,
    getState: () => AppState,
  ) => {
    const selectedDatasetId = getState().controlState.selectedDatasetId;
    const selectedVariableName = getState().controlState.selectedVariableName;
    if (selectedDatasetId && selectedVariableName) {
      dispatch(
        _updateVariableColorBar(
          selectedDatasetId,
          selectedVariableName,
          colorBarName,
          colorBarMinMax,
          colorBarNorm,
          opacity,
        ),
      );
    }
  };
}

export function updateVariable2ColorBar(
  colorBarName: string,
  colorBarMinMax: [number, number],
  colorBarNorm: ColorBarNorm,
  opacity: number,
) {
  return (
    dispatch: Dispatch<UpdateVariableColorBar>,
    getState: () => AppState,
  ) => {
    const selectedDatasetId = getState().controlState.selectedDatasetId;
    const selectedVariableName = getState().controlState.selectedVariable2Name;
    if (selectedDatasetId && selectedVariableName) {
      dispatch(
        _updateVariableColorBar(
          selectedDatasetId,
          selectedVariableName,
          colorBarName,
          colorBarMinMax,
          colorBarNorm,
          opacity,
        ),
      );
    }
  };
}

export function _updateVariableColorBar(
  datasetId: string,
  variableName: string,
  colorBarName: string,
  colorBarMinMax: [number, number],
  colorBarNorm: ColorBarNorm,
  opacity: number,
): UpdateVariableColorBar {
  if (colorBarNorm === "log") {
    // Adjust range in case of log norm: Make sure xcube server can use
    // matplotlib.colors.LogNorm(vmin, vmax) without errors
    let [vMin, vMax] = colorBarMinMax;
    if (vMin <= 0) {
      vMin = 1e-3;
    }
    if (vMax <= vMin) {
      vMax = 1;
    }
    colorBarMinMax = [vMin, vMax];
  }
  return {
    type: UPDATE_VARIABLE_COLOR_BAR,
    datasetId,
    variableName,
    colorBarName,
    colorBarMinMax,
    colorBarNorm,
    opacity,
  };
}

////////////////////////////////////////////////////////////////////////////////

export const UPDATE_VARIABLE_VOLUME = "UPDATE_VARIABLE_VOLUME";

export interface UpdateVariableVolume {
  type: typeof UPDATE_VARIABLE_VOLUME;
  datasetId: string;
  variableName: string;
  variableColorBar: ColorBar;
  volumeRenderMode: VolumeRenderMode;
  volumeIsoThreshold: number;
}

export function updateVariableVolume(
  datasetId: string,
  variableName: string,
  variableColorBar: ColorBar,
  volumeRenderMode: VolumeRenderMode,
  volumeIsoThreshold: number,
): UpdateVariableVolume {
  return {
    type: UPDATE_VARIABLE_VOLUME,
    datasetId,
    variableName,
    variableColorBar,
    volumeRenderMode,
    volumeIsoThreshold,
  };
}

////////////////////////////////////////////////////////////////////////////////

export function exportData() {
  return (
    _dispatch: Dispatch<UpdateVariableColorBar>,
    getState: () => AppState,
  ) => {
    const {
      exportTimeSeries,
      exportTimeSeriesSeparator,
      exportPlaces,
      exportPlacesAsCollection,
      exportZipArchive,
      exportFileName,
    } = getState().controlState;

    let placeGroups: PlaceGroup[] = [];

    if (exportTimeSeries) {
      // Time series may reference any place, so collect all known place groups.
      placeGroups = [];
      const datasets = datasetsSelector(getState());
      datasets.forEach((dataset) => {
        if (dataset.placeGroups) {
          placeGroups = placeGroups.concat(dataset.placeGroups);
        }
      });
      placeGroups = [...placeGroups, ...userPlaceGroupsSelector(getState())];
    } else if (exportPlaces) {
      // Just export all visible places.
      placeGroups = selectedPlaceGroupsSelector(getState());
    }

    _exportData(getState().dataState.timeSeriesGroups, placeGroups, {
      includeTimeSeries: exportTimeSeries,
      includePlaces: exportPlaces,
      separator: exportTimeSeriesSeparator,
      placesAsCollection: exportPlacesAsCollection,
      zip: exportZipArchive,
      fileName: exportFileName,
    });
  };
}

abstract class Exporter {
  abstract write(path: string, content: string): void;

  abstract close(): void;
}

class ZipExporter extends Exporter {
  fileName: string;
  zipArchive: JSZip;

  constructor(fileName: string) {
    super();
    this.fileName = fileName;
    this.zipArchive = new JSZip();
  }

  write(path: string, content: string) {
    this.zipArchive.file(path, content);
  }

  close() {
    this.zipArchive
      .generateAsync({ type: "blob" })
      .then((content) => saveAs(content, this.fileName));
  }
}

class FileExporter extends Exporter {
  write(path: string, content: string) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, path);
  }

  close() {}
}

interface ExportOptions {
  includeTimeSeries?: boolean;
  separator?: string;
  includePlaces?: boolean;
  fileName?: string;
  placesAsCollection?: boolean;
  zip?: boolean;
}

function _exportData(
  timeSeriesGroups: TimeSeriesGroup[],
  placeGroups: PlaceGroup[],
  options: ExportOptions,
) {
  const { includeTimeSeries, includePlaces, placesAsCollection, zip } = options;

  let { separator, fileName } = options;

  separator = separator || "TAB";
  if (separator.toUpperCase() === "TAB") {
    separator = "\t";
  }

  fileName = fileName || "export";

  if (!includeTimeSeries && !includePlaces) {
    return;
  }

  let exporter: Exporter;
  if (zip) {
    exporter = new ZipExporter(`${fileName}.zip`);
  } else {
    exporter = new FileExporter();
  }

  let placesToExport: { [placeId: string]: Place };

  if (includeTimeSeries) {
    const { colNames, dataRows, referencedPlaces } = timeSeriesGroupsToTable(
      timeSeriesGroups,
      placeGroups,
    );
    const validTypes: { [typeName: string]: boolean } = {
      number: true,
      string: true,
    };
    const csvHeaderRow = colNames.join(separator);
    const csvDataRows = dataRows.map((row) =>
      row
        .map((value) => (validTypes[typeof value] ? value + "" : ""))
        .join(separator),
    );
    const csvText = [csvHeaderRow].concat(csvDataRows).join("\n");
    exporter.write(`${fileName}.txt`, csvText);
    placesToExport = referencedPlaces;
  } else {
    placesToExport = {};
    placeGroups.forEach((placeGroup) => {
      if (placeGroup.features) {
        placeGroup.features.forEach((place) => {
          placesToExport[place.id] = place;
        });
      }
    });
  }

  if (includePlaces) {
    if (placesAsCollection) {
      const collection = {
        type: "FeatureCollection",
        features: Object.keys(placesToExport).map(
          (placeId) => placesToExport![placeId],
        ),
      };
      exporter.write(
        `${fileName}.geojson`,
        JSON.stringify(collection, null, 2),
      );
    } else {
      Object.keys(placesToExport).forEach((placeId) => {
        exporter.write(
          `${placeId}.geojson`,
          JSON.stringify(placesToExport![placeId], null, 2),
        );
      });
    }
  }

  exporter.close();
}

/*
function _downloadTimeSeriesGeoJSON(timeSeriesGroups: TimeSeriesGroup[],
                                    placeGroups: PlaceGroup[],
                                    format: 'GeoJSON' | 'CSV',
                                    fileName: string = 'time-series',
                                    multiFile: boolean = true,
                                    zipArchive: boolean = true) {
    const featureCollection = timeSeriesGroupsToGeoJSON(timeSeriesGroups);

    if (format === 'GeoJSON') {
        if (zipArchive) {
            const zip = new JSZip();
            if (multiFile) {
                zip.file(`${fileName}.geojson`,
                         JSON.stringify(featureCollection, null, 2));
            } else {
                for (let feature of featureCollection.features) {
                    zip.file(`${feature.id}.geojson`,
                             JSON.stringify(feature, null, 2));
                }
            }
            zip.generateAsync({type: "blob"})
               .then((content) => saveAs(content, `${fileName}.zip`));
        } else {
            if (multiFile) {
                throw new Error('Cannot download multi-file exports');
            }
            const blob = new Blob([JSON.stringify(featureCollection, null, 2)],
                                  {type: "text/plain;charset=utf-8"});
            saveAs(blob, `${fileName}.geojson`);
        }
    } else {
        // TODO (forman): implement CSV export
        throw new Error(`Download as ${format} is not yet implemented`);
    }

}
*/

////////////////////////////////////////////////////////////////////////////////

export type DataAction =
  | UpdateServerInfo
  | UpdateExpressionCapabilities
  | UpdateDatasets
  | UpdateDatasetUserVariables
  | UpdateDatasetPlaceGroup
  | AddPlaceGroupTimeSeries
  | AddDrawnUserPlace
  | AddImportedUserPlaces
  | RenameUserPlaceGroup
  | RenameUserPlace
  | RestyleUserPlace
  | RemoveUserPlace
  | RemoveUserPlaceGroup
  | AddStatistics
  | RemoveStatistics
  | UpdateTimeSeries
  | RemoveTimeSeries
  | RemoveTimeSeriesGroup
  | RemoveAllTimeSeries
  | ConfigureServers
  | UpdateColorBars
  | UpdateVariableColorBar
  | UpdateVariableVolume;

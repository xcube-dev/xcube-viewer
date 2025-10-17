/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type { Action, Dispatch } from "redux";
import type { Extent as OlExtent } from "ol/extent";
import { default as OlGeoJSONFormat } from "ol/format/GeoJSON";
import type { Geometry as OlGeometry } from "ol/geom";

import * as api from "@/api";
import i18n from "@/i18n";
import { Dataset, findDataset } from "@/model/dataset";
import {
  findPlaceInPlaceGroups,
  isValidPlaceGroup,
  type Place,
  type PlaceGroup,
} from "@/model/place";
import type { Time, TimeRange } from "@/model/timeSeries";
import { renderUserColorBarAsBase64, UserColorBar } from "@/model/userColorBar";
import {
  selectedDatasetIdSelector,
  selectedDatasetSelectedPlaceGroupsSelector,
  selectedDatasetSelector,
  selectedPlaceGroupsSelector,
  selectedPlaceIdSelector,
  selectedServerSelector,
} from "@/selectors/controlSelectors";
import { datasetsSelector } from "@/selectors/dataSelectors";
import type { AppState } from "@/states/appState";
import type {
  ControlState,
  LayerVisibilities,
  LayerGroupStates,
  MapInteraction,
  TimeAnimationInterval,
  ViewMode,
  VolumeRenderMode,
  VolumeState,
} from "@/states/controlState";
import {
  // TODO: strange dependency here, invert!
  UPDATE_DATASET_PLACE_GROUP,
  updateDatasetPlaceGroup,
  UpdateDatasetPlaceGroup,
} from "./dataActions";
import { type MessageLogAction, postMessage } from "./messageLogActions";
import { locateInMap } from "./mapActions";

////////////////////////////////////////////////////////////////////////////////

export const SELECT_DATASET = "SELECT_DATASET";

export interface SelectDataset {
  type: typeof SELECT_DATASET;
  selectedDatasetId: string | null;
  // TODO: Having datasets in here is ugly, but we need it in the reducer.
  // See
  // - https://medium.com/@williamjoshualacey/refactoring-redux-using-react-context-aa29fa16f4b7
  // - https://codeburst.io/the-ugly-side-of-redux-6591fde68200
  datasets: Dataset[];
}

export function selectDataset(
  selectedDatasetId: string | null,
  datasets: Dataset[],
  showInMap: boolean,
) {
  return (dispatch: Dispatch, getState: () => AppState) => {
    dispatch(_selectDataset(selectedDatasetId, datasets));
    const locateMode = getState().controlState.datasetLocateMode;
    if (selectedDatasetId && showInMap && locateMode !== "doNothing") {
      dispatch(
        locateDatasetInMap(
          selectedDatasetId,
          getState().controlState.datasetLocateMode === "panAndZoom",
        ) as unknown as Action,
      );
    }
  };
}

export function _selectDataset(
  selectedDatasetId: string | null,
  datasets: Dataset[],
): SelectDataset {
  return { type: SELECT_DATASET, selectedDatasetId, datasets };
}

////////////////////////////////////////////////////////////////////////////////

export function locateSelectedDatasetInMap() {
  return (dispatch: Dispatch, getState: () => AppState) => {
    const datasetId = selectedDatasetIdSelector(getState());
    if (datasetId) {
      dispatch(locateDatasetInMap(datasetId, true) as unknown as Action);
    }
  };
}

export function locateSelectedPlaceInMap() {
  return (dispatch: Dispatch, getState: () => AppState) => {
    const placeId = selectedPlaceIdSelector(getState());
    if (placeId) {
      dispatch(locatePlaceInMap(placeId, true) as unknown as Action);
    }
  };
}

export function locateDatasetInMap(
  selectedDatasetId: string,
  shouldZoom: boolean,
) {
  return (dispatch: Dispatch, getState: () => AppState) => {
    const datasets = datasetsSelector(getState());
    const dataset = findDataset(datasets, selectedDatasetId);
    if (dataset && dataset.bbox) {
      dispatch(locateShapeInMap(dataset.bbox, shouldZoom) as unknown as Action);
    }
  };
}

const SIMPLE_GEOMETRY_TYPES = [
  "Point",
  "LineString",
  "LinearRing",
  "Polygon",
  "MultiPoint",
  "MultiLineString",
  "MultiPolygon",
  "Circle",
];

export function locatePlaceInMap(selectedPlaceId: string, shouldZoom: boolean) {
  return (dispatch: Dispatch, getState: () => AppState) => {
    const placeGroups = selectedPlaceGroupsSelector(getState());
    const place = findPlaceInPlaceGroups(placeGroups, selectedPlaceId);
    if (place) {
      if (place.bbox && place.bbox.length === 4) {
        dispatch(locateShapeInMap(place.bbox, shouldZoom) as unknown as Action);
      } else if (
        place.geometry &&
        SIMPLE_GEOMETRY_TYPES.includes(place.geometry.type)
      ) {
        dispatch(
          locateShapeInMap(
            new OlGeoJSONFormat().readGeometry(place.geometry),
            shouldZoom,
          ) as unknown as Action,
        );
      }
    }
  };
}

export function locateShapeInMap(
  location: OlGeometry | OlExtent | null,
  shouldZoom: boolean,
) {
  return (dispatch: Dispatch<FlyTo>) => {
    if (location !== null) {
      const mapId = "map";
      dispatch(_flyTo(mapId, location));
      locateInMap(mapId, location, shouldZoom);
    }
  };
}

////////////////////////////////////////////////////////////////////////////////

// TODO: check, seems that this action is not needed at all

export const FLY_TO = "FLY_TO";

export interface FlyTo {
  type: typeof FLY_TO;
  mapId: string;
  location: OlGeometry | OlExtent | null;
}

export function _flyTo(
  mapId: string,
  location: OlGeometry | OlExtent | null,
): FlyTo {
  return { type: FLY_TO, mapId, location };
}

////////////////////////////////////////////////////////////////////////////////

export const SELECT_PLACE_GROUPS = "SELECT_PLACE_GROUPS";

export interface SelectPlaceGroups {
  type: typeof SELECT_PLACE_GROUPS;
  selectedPlaceGroupIds: string[] | null;
}

export function selectPlaceGroups(selectedPlaceGroupIds: string[] | null) {
  return (
    dispatch: Dispatch<
      | SelectPlaceGroups
      | UpdateDatasetPlaceGroup
      | AddActivity
      | RemoveActivity
      | MessageLogAction
    >,
    getState: () => AppState,
  ) => {
    const apiServer = selectedServerSelector(getState());

    dispatch(_selectPlaceGroups(selectedPlaceGroupIds));

    const dataset = selectedDatasetSelector(getState());
    const placeGroups = selectedDatasetSelectedPlaceGroupsSelector(getState());
    if (dataset !== null && placeGroups.length > 0) {
      for (const placeGroup of placeGroups) {
        if (!isValidPlaceGroup(placeGroup)) {
          const datasetId = dataset!.id;
          const placeGroupId = placeGroup.id;
          const activityId = `${UPDATE_DATASET_PLACE_GROUP}-${datasetId}-${placeGroupId}`;
          dispatch(addActivity(activityId, i18n.get("Loading places")));
          api
            .getDatasetPlaceGroup(
              apiServer.url,
              datasetId,
              placeGroupId,
              getState().userAuthState.accessToken,
            )
            .then((placeGroup: PlaceGroup) => {
              dispatch(updateDatasetPlaceGroup(dataset!.id, placeGroup));
            })
            .catch((error: Error) => {
              dispatch(postMessage("error", error));
            })
            .finally(() => {
              dispatch(removeActivity(activityId));
            });
        }
      }
    }
  };
}

export function _selectPlaceGroups(
  selectedPlaceGroupIds: string[] | null,
): SelectPlaceGroups {
  return { type: SELECT_PLACE_GROUPS, selectedPlaceGroupIds };
}

////////////////////////////////////////////////////////////////////////////////

export const SELECT_PLACE = "SELECT_PLACE";

export interface SelectPlace {
  type: typeof SELECT_PLACE;
  placeId: string | null;
  // TODO: Having places in here is ugly, but we need it in the reducer.
  places: Place[];
}

export function selectPlace(
  placeId: string | null,
  places: Place[],
  showInMap: boolean,
) {
  return (dispatch: Dispatch, getState: () => AppState) => {
    dispatch(_selectPlace(placeId, places));
    const locateMode = getState().controlState.placeLocateMode;
    if (showInMap && placeId && locateMode !== "doNothing") {
      dispatch(
        locatePlaceInMap(
          placeId,
          getState().controlState.placeLocateMode === "panAndZoom",
        ) as unknown as Action,
      );
    }
  };
}

function _selectPlace(placeId: string | null, places: Place[]): SelectPlace {
  return { type: SELECT_PLACE, placeId, places };
}

////////////////////////////////////////////////////////////////////////////////

export const TOGGLE_DATASET_RGB_LAYER = "TOGGLE_DATASET_RGB_LAYER";

export interface ToggleDatasetRgbLayer {
  type: typeof TOGGLE_DATASET_RGB_LAYER;
  visible: boolean;
}

export function toggleDatasetRgbLayer(visible: boolean): ToggleDatasetRgbLayer {
  return { type: TOGGLE_DATASET_RGB_LAYER, visible };
}

////////////////////////////////////////////////////////////////////////////////

export const SET_LAYER_VISIBILITIES = "SET_LAYER_VISIBILITIES";

export interface SetLayerVisibilities {
  type: typeof SET_LAYER_VISIBILITIES;
  layerVisibilities: LayerVisibilities;
}

export function setLayerVisibilities(
  layerVisibilities: LayerVisibilities,
): SetLayerVisibilities {
  return { type: SET_LAYER_VISIBILITIES, layerVisibilities };
}

////////////////////////////////////////////////////////////////////////////////

export const SET_LAYER_GROUP_STATES = "SET_LAYER_GROUP_STATES";

export interface SetLayerGroupStates {
  type: typeof SET_LAYER_GROUP_STATES;
  layerGroupStates: Partial<LayerGroupStates>;
}

export function setLayerGroupStates(
  layerGroupStates: Partial<LayerGroupStates>,
): SetLayerGroupStates {
  return { type: SET_LAYER_GROUP_STATES, layerGroupStates };
}

////////////////////////////////////////////////////////////////////////////////

export const SET_MAP_POINT_INFO_BOX_ENABLED = "SET_MAP_POINT_INFO_BOX_ENABLED";

export interface SetMapPointInfoBoxEnabled {
  type: typeof SET_MAP_POINT_INFO_BOX_ENABLED;
  mapPointInfoBoxEnabled: boolean;
}

export function setMapPointInfoBoxEnabled(
  mapPointInfoBoxEnabled: boolean,
): SetMapPointInfoBoxEnabled {
  return {
    type: SET_MAP_POINT_INFO_BOX_ENABLED,
    mapPointInfoBoxEnabled,
  };
}

////////////////////////////////////////////////////////////////////////////////

export const SET_VARIABLE_COMPARE_MODE = "SET_VARIABLE_COMPARE_MODE";

export interface SetVariableCompareMode {
  type: typeof SET_VARIABLE_COMPARE_MODE;
  variableCompareMode: boolean;
}

export function setVariableCompareMode(
  variableCompareMode: boolean,
): SetVariableCompareMode {
  return {
    type: SET_VARIABLE_COMPARE_MODE,
    variableCompareMode,
  };
}

////////////////////////////////////////////////////////////////////////////////

export const UPDATE_VARIABLE_SPLIT_POS = "UPDATE_VARIABLE_SPLIT_POS";

export interface UpdateVariableSplitPos {
  type: typeof UPDATE_VARIABLE_SPLIT_POS;
  size: number;
  isDelta?: boolean;
}

export function updateVariableSplitPos(
  size: number,
  isDelta?: boolean,
): UpdateVariableSplitPos {
  return {
    type: UPDATE_VARIABLE_SPLIT_POS,
    size,
    isDelta,
  };
}

////////////////////////////////////////////////////////////////////////////////

export const SELECT_VARIABLE = "SELECT_VARIABLE";

export interface SelectVariable {
  type: typeof SELECT_VARIABLE;
  selectedVariableName: string | null;
}

export function selectVariable(
  selectedVariableName: string | null,
): SelectVariable {
  return { type: SELECT_VARIABLE, selectedVariableName };
}

////////////////////////////////////////////////////////////////////////////////

export const SELECT_VARIABLE_2 = "SELECT_VARIABLE_2";

export interface SelectVariable2 {
  type: typeof SELECT_VARIABLE_2;
  selectedDataset2Id: string | null;
  selectedVariable2Name: string | null;
}

export function selectVariable2(
  selectedDataset2Id: string | null,
  selectedVariable2Name: string | null,
): SelectVariable2 {
  return {
    type: SELECT_VARIABLE_2,
    selectedDataset2Id,
    selectedVariable2Name,
  };
}

////////////////////////////////////////////////////////////////////////////////

export const SELECT_TIME = "SELECT_TIME";

export interface SelectTime {
  type: typeof SELECT_TIME;
  selectedTime: Time | null;
}

export function selectTime(selectedTime: Time | null): SelectTime {
  return { type: SELECT_TIME, selectedTime };
}

////////////////////////////////////////////////////////////////////////////////

export const INC_SELECTED_TIME = "INC_SELECTED_TIME";

export interface IncSelectedTime {
  type: typeof INC_SELECTED_TIME;
  increment: -1 | 1;
}

export function incSelectedTime(increment: -1 | 1): IncSelectedTime {
  return { type: INC_SELECTED_TIME, increment };
}

////////////////////////////////////////////////////////////////////////////////

export const SELECT_TIME_RANGE = "SELECT_TIME_RANGE";

export interface SelectTimeRange {
  type: typeof SELECT_TIME_RANGE;
  selectedTimeRange: TimeRange | null;
  selectedGroupId?: string;
  selectedValueRange?: [number, number] | null;
}

export function selectTimeRange(
  selectedTimeRange: TimeRange | null,
  selectedGroupId?: string,
  selectedValueRange?: [number, number] | null,
): SelectTimeRange {
  return {
    type: SELECT_TIME_RANGE,
    selectedTimeRange,
    selectedGroupId,
    selectedValueRange,
  };
}

////////////////////////////////////////////////////////////////////////////////

// TODO (forman): this action doesn't seem to be in use - remove!

export const SELECT_TIME_SERIES_UPDATE_MODE = "SELECT_TIME_SERIES_UPDATE_MODE";

export interface SelectTimeSeriesUpdateMode {
  type: typeof SELECT_TIME_SERIES_UPDATE_MODE;
  timeSeriesUpdateMode: "add" | "replace";
}

////////////////////////////////////////////////////////////////////////////////

export const UPDATE_TIME_ANIMATION = "UPDATE_TIME_ANIMATION";

export interface UpdateTimeAnimation {
  type: typeof UPDATE_TIME_ANIMATION;
  timeAnimationActive: boolean;
  timeAnimationInterval: TimeAnimationInterval;
}

export function updateTimeAnimation(
  timeAnimationActive: boolean,
  timeAnimationInterval: TimeAnimationInterval,
): UpdateTimeAnimation {
  return {
    type: UPDATE_TIME_ANIMATION,
    timeAnimationActive,
    timeAnimationInterval,
  };
}

////////////////////////////////////////////////////////////////////////////////

export const SET_MAP_INTERACTION = "SET_MAP_INTERACTION";

export interface SetMapInteraction {
  type: typeof SET_MAP_INTERACTION;
  mapInteraction: MapInteraction;
}

export function setMapInteraction(
  mapInteraction: MapInteraction,
): SetMapInteraction {
  return { type: SET_MAP_INTERACTION, mapInteraction };
}

////////////////////////////////////////////////////////////////////////////////

export const SET_LAYER_MENU_OPEN = "SET_LAYER_MENU_OPEN";

export interface SetLayerMenuOpen {
  type: typeof SET_LAYER_MENU_OPEN;
  layerMenuOpen: boolean;
}

export function setLayerMenuOpen(layerMenuOpen: boolean): SetLayerMenuOpen {
  return { type: SET_LAYER_MENU_OPEN, layerMenuOpen };
}

////////////////////////////////////////////////////////////////////////////////

export const SET_SIDE_PANEL_OPEN = "SET_SIDE_PANEL_OPEN";

export interface SetSidePanelOpen {
  type: typeof SET_SIDE_PANEL_OPEN;
  sidePanelOpen: boolean;
}

export function setSidePanelOpen(sidePanelOpen: boolean): SetSidePanelOpen {
  return { type: SET_SIDE_PANEL_OPEN, sidePanelOpen };
}

////////////////////////////////////////////////////////////////////////////////

export const SET_SIDE_PANEL_ID = "SET_SIDE_PANEL_ID";

export interface SetSidePanelId {
  type: typeof SET_SIDE_PANEL_ID;
  sidePanelId: string | null;
}

export function setSidePanelId(sidePanelId: string | null): SetSidePanelId {
  return { type: SET_SIDE_PANEL_ID, sidePanelId };
}

////////////////////////////////////////////////////////////////////////////////

export const UPDATE_SIDE_PANEL_SIZE = "UPDATE_SIDE_PANEL_SIZE";

export interface UpdateSidePanelSize {
  type: typeof UPDATE_SIDE_PANEL_SIZE;
  sizeDelta: number;
}

export function updateSidePanelSize(sizeDelta: number): UpdateSidePanelSize {
  return { type: UPDATE_SIDE_PANEL_SIZE, sizeDelta };
}

////////////////////////////////////////////////////////////////////////////////

export const SET_VOLUME_RENDER_MODE = "SET_VOLUME_RENDER_MODE";

export interface SetVolumeRenderMode {
  type: typeof SET_VOLUME_RENDER_MODE;
  volumeRenderMode: VolumeRenderMode;
}

export function setVolumeRenderMode(
  volumeRenderMode: VolumeRenderMode,
): SetVolumeRenderMode {
  return { type: SET_VOLUME_RENDER_MODE, volumeRenderMode };
}

////////////////////////////////////////////////////////////////////////////////

export const UPDATE_VOLUME_STATE = "UPDATE_VOLUME_STATE";

export interface UpdateVolumeState {
  type: typeof UPDATE_VOLUME_STATE;
  volumeId: string;
  volumeState: VolumeState;
}

export function updateVolumeState(
  volumeId: string,
  volumeState: VolumeState,
): UpdateVolumeState {
  return { type: UPDATE_VOLUME_STATE, volumeId, volumeState };
}

////////////////////////////////////////////////////////////////////////////////

export const SET_VISIBLE_INFO_CARD_ELEMENTS = "SET_VISIBLE_INFO_CARD_ELEMENTS";

export interface SetVisibleInfoCardElements {
  type: typeof SET_VISIBLE_INFO_CARD_ELEMENTS;
  visibleElements: string[];
}

export function setVisibleInfoCardElements(
  visibleElements: string[],
): SetVisibleInfoCardElements {
  return { type: SET_VISIBLE_INFO_CARD_ELEMENTS, visibleElements };
}

////////////////////////////////////////////////////////////////////////////////

export const UPDATE_INFO_CARD_ELEMENT_VIEW_MODE =
  "UPDATE_INFO_CARD_ELEMENT_VIEW_MODE";

export interface UpdateInfoCardElementCodeMode {
  type: typeof UPDATE_INFO_CARD_ELEMENT_VIEW_MODE;
  elementType: string;
  viewMode: ViewMode;
}

export function updateInfoCardElementViewMode(
  elementType: string,
  viewMode: ViewMode,
): UpdateInfoCardElementCodeMode {
  return { type: UPDATE_INFO_CARD_ELEMENT_VIEW_MODE, elementType, viewMode };
}

////////////////////////////////////////////////////////////////////////////////

export const ADD_ACTIVITY = "ADD_ACTIVITY";

export interface AddActivity {
  type: typeof ADD_ACTIVITY;
  id: string;
  message: string;
}

export function addActivity(id: string, message: string): AddActivity {
  return { type: ADD_ACTIVITY, id, message };
}

////////////////////////////////////////////////////////////////////////////////

export const REMOVE_ACTIVITY = "REMOVE_ACTIVITY";

export interface RemoveActivity {
  type: typeof REMOVE_ACTIVITY;
  id: string;
}

export function removeActivity(id: string): RemoveActivity {
  return { type: REMOVE_ACTIVITY, id };
}

////////////////////////////////////////////////////////////////////////////////

export const CHANGE_LOCALE = "CHANGE_LOCALE";

export interface ChangeLocale {
  type: typeof CHANGE_LOCALE;
  locale: string;
}

export function changeLocale(locale: string): ChangeLocale {
  return { type: CHANGE_LOCALE, locale };
}

////////////////////////////////////////////////////////////////////////////////

export const OPEN_DIALOG = "OPEN_DIALOG";

export interface OpenDialog {
  type: typeof OPEN_DIALOG;
  dialogId: string;
}

export function openDialog(dialogId: string): OpenDialog {
  return { type: OPEN_DIALOG, dialogId };
}

////////////////////////////////////////////////////////////////////////////////

export const CLOSE_DIALOG = "CLOSE_DIALOG";

export interface CloseDialog {
  type: typeof CLOSE_DIALOG;
  dialogId: string;
}

export function closeDialog(dialogId: string): CloseDialog {
  return { type: CLOSE_DIALOG, dialogId };
}

////////////////////////////////////////////////////////////////////////////////

export const UPDATE_SETTINGS = "UPDATE_SETTINGS";

export interface UpdateSettings {
  type: typeof UPDATE_SETTINGS;
  settings: Partial<ControlState>;
}

export function updateSettings(
  settings: Partial<ControlState>,
): UpdateSettings {
  return { type: UPDATE_SETTINGS, settings };
}

////////////////////////////////////////////////////////////////////////////////

export const STORE_SETTINGS = "STORE_SETTINGS";

export interface StoreSettings {
  type: typeof STORE_SETTINGS;
}

export function storeSettings(): StoreSettings {
  return { type: STORE_SETTINGS };
}

////////////////////////////////////////////////////////////////////////////////

export function addUserColorBar(colorBarId: string) {
  return (dispatch: Dispatch) => {
    dispatch(_addUserColorBar(colorBarId));
    dispatch(updateUserColorBarImageDataById(colorBarId) as unknown as Action);
  };
}

export const ADD_USER_COLOR_BAR = "ADD_USER_COLOR_BAR";

export interface AddUserColorBar {
  type: typeof ADD_USER_COLOR_BAR;
  colorBarId: string;
}

export function _addUserColorBar(colorBarId: string): AddUserColorBar {
  return { type: ADD_USER_COLOR_BAR, colorBarId };
}

////////////////////////////////////////////////////////////////////////////////

export const REMOVE_USER_COLOR_BAR = "REMOVE_USER_COLOR_BAR";

export interface RemoveUserColorBar {
  type: typeof REMOVE_USER_COLOR_BAR;
  colorBarId: string;
}

export function removeUserColorBar(colorBarId: string): RemoveUserColorBar {
  return { type: REMOVE_USER_COLOR_BAR, colorBarId };
}

////////////////////////////////////////////////////////////////////////////////

export function updateUserColorBar(userColorBar: UserColorBar) {
  return (dispatch: Dispatch) => {
    dispatch(_updateUserColorBar(userColorBar));
    dispatch(updateUserColorBarImageData(userColorBar) as unknown as Action);
  };
}

export const UPDATE_USER_COLOR_BAR = "UPDATE_USER_COLOR_BAR";

export interface UpdateUserColorBar {
  type: typeof UPDATE_USER_COLOR_BAR;
  userColorBar: UserColorBar;
}

export function _updateUserColorBar(
  userColorBar: UserColorBar,
): UpdateUserColorBar {
  return { type: UPDATE_USER_COLOR_BAR, userColorBar };
}

////////////////////////////////////////////////////////////////////////////////

function updateUserColorBarImageDataById(colorBarId: string) {
  return (dispatch: Dispatch, getState: () => AppState) => {
    const colorBar = getState().controlState.userColorBars.find(
      (ucb) => ucb.id === colorBarId,
    );
    if (colorBar) {
      dispatch(updateUserColorBarImageData(colorBar) as unknown as Action);
    }
  };
}

function updateUserColorBarImageData(colorBar: UserColorBar) {
  return (dispatch: Dispatch) => {
    renderUserColorBarAsBase64(colorBar).then(({ imageData, errorMessage }) => {
      dispatch(_updateUserColorBar({ ...colorBar, imageData, errorMessage }));
    });
  };
}

////////////////////////////////////////////////////////////////////////////////

export function updateUserColorBarsImageData() {
  return (dispatch: Dispatch, getState: () => AppState) => {
    getState().controlState.userColorBars.forEach((colorBar) => {
      if (!colorBar.imageData) {
        dispatch(updateUserColorBarImageData(colorBar) as unknown as Action);
      }
    });
  };
}

////////////////////////////////////////////////////////////////////////////////

export function updateUserColorBars(
  userColorBars: UserColorBar[],
): UpdateSettings {
  return { type: UPDATE_SETTINGS, settings: { userColorBars } };
}

////////////////////////////////////////////////////////////////////////////////

export const SET_ZOOM_LEVEL = "SET_ZOOM_LEVEL";

export interface SetZoomLevel {
  type: typeof SET_ZOOM_LEVEL;
  zoomLevel: number | undefined;
}

export function setZoomLevel(zoomLevel: number | undefined): SetZoomLevel {
  return { type: SET_ZOOM_LEVEL, zoomLevel };
}

////////////////////////////////////////////////////////////////////////////////

export const SET_DATASET_Z_LEVEL = "SET_DATASET_Z_LEVEL";

export interface SetDatasetZLevel {
  type: typeof SET_DATASET_Z_LEVEL;
  datasetZLevel: number | undefined;
}

export function setDatasetZLevel(
  datasetZLevel: number | undefined,
): SetDatasetZLevel {
  return { type: SET_DATASET_Z_LEVEL, datasetZLevel };
}

////////////////////////////////////////////////////////////////////////////////

export type ControlAction =
  | SelectDataset
  | UpdateDatasetPlaceGroup
  | SelectVariable
  | SelectPlaceGroups
  | SelectPlace
  | SelectTime
  | ToggleDatasetRgbLayer
  | SetLayerVisibilities
  | SetLayerGroupStates
  | IncSelectedTime
  | SelectTimeRange
  | SelectTimeSeriesUpdateMode
  | UpdateTimeAnimation
  | SetMapInteraction
  | AddActivity
  | RemoveActivity
  | ChangeLocale
  | AddUserColorBar
  | RemoveUserColorBar
  | UpdateUserColorBar
  | UpdateSettings
  | StoreSettings
  | OpenDialog
  | CloseDialog
  | SetLayerMenuOpen
  | UpdateSidePanelSize
  | SetSidePanelOpen
  | SetSidePanelId
  | SetVolumeRenderMode
  | UpdateVolumeState
  | SetVisibleInfoCardElements
  | UpdateInfoCardElementCodeMode
  | SelectVariable2
  | SetMapPointInfoBoxEnabled
  | SetVariableCompareMode
  | UpdateVariableSplitPos
  | FlyTo
  | SetZoomLevel
  | SetDatasetZLevel;

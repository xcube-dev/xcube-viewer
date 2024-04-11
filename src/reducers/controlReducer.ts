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

import {
  ADD_ACTIVITY,
  CHANGE_LOCALE,
  CLOSE_DIALOG,
  ControlAction,
  FLY_TO,
  INC_SELECTED_TIME,
  OPEN_DIALOG,
  REMOVE_ACTIVITY,
  SELECT_DATASET,
  SELECT_PLACE,
  SELECT_PLACE_GROUPS,
  SELECT_TIME,
  SELECT_TIME_RANGE,
  SELECT_TIME_SERIES_UPDATE_MODE,
  SELECT_VARIABLE,
  SET_MAP_INTERACTION,
  SET_RGB_LAYER_VISIBILITY,
  SET_VISIBLE_INFO_CARD_ELEMENTS,
  SET_VOLUME_RENDER_MODE,
  SHOW_INFO_CARD,
  SHOW_VOLUME_CARD,
  UPDATE_INFO_CARD_ELEMENT_VIEW_MODE,
  UPDATE_SETTINGS,
  UPDATE_TIME_ANIMATION,
  UPDATE_VOLUME_STATE,
} from "../actions/controlActions";
import {
  ADD_DRAWN_USER_PLACE,
  ADD_IMPORTED_USER_PLACE_GROUPS,
  CONFIGURE_SERVERS,
  DataAction,
  REMOVE_USER_PLACE,
  RENAME_USER_PLACE_GROUP,
  UPDATE_DATASETS,
} from "../actions/dataActions";
import i18n from "../i18n";
import {
  findDataset,
  findDatasetVariable,
  getDatasetTimeRange,
} from "../model/dataset";
import {
  selectedTimeIndexSelector,
  timeCoordinatesSelector,
} from "../selectors/controlSelectors";
import { AppState } from "../states/appState";
import { ControlState, newControlState } from "../states/controlState";
import { storeUserSettings } from "../states/userSettings";
import { findIndexCloseTo } from "../util/find";
import { appParams } from "../config";
import { USER_DRAWN_PLACE_GROUP_ID } from "../model/place";

// TODO (forman): Refactor reducers for UPDATE_DATASETS, SELECT_DATASET, SELECT_PLACE, SELECT_VARIABLE
//                so they produce a consistent state. E.g. on selected dataset change, ensure selected
//                places and variables are still valid. Write tests for that.
//                We currently still receiving error logs from Material-UI, e.g.:
//                  SelectInput.js:304 Material-UI: you have provided an out-of-range value `local`
//                  for the select (name="dataset") component.
//                  Consider providing a value that matches one of the available options or ''.
//                  The available values are "".

export function controlReducer(
  state: ControlState | undefined,
  action: ControlAction | DataAction,
  appState: AppState | undefined,
): ControlState {
  if (state === undefined) {
    state = newControlState();
  }
  switch (action.type) {
    case UPDATE_SETTINGS: {
      const settings = { ...state, ...action.settings };
      storeUserSettings(settings);
      return settings;
    }
    case UPDATE_DATASETS: {
      let selectedDatasetId =
        state!.selectedDatasetId || appParams.get("dataset");
      let selectedVariableName =
        state!.selectedVariableName || appParams.get("variable");
      let mapInteraction = state!.mapInteraction;
      let selectedDataset = findDataset(action.datasets, selectedDatasetId);
      const selectedVariable =
        (selectedDataset &&
          findDatasetVariable(selectedDataset, selectedVariableName)) ||
        null;
      if (selectedDataset) {
        if (!selectedVariable) {
          selectedVariableName = selectedDataset.variables.length
            ? selectedDataset.variables[0].name
            : null;
        }
      } else {
        selectedDatasetId = null;
        selectedVariableName = null;
        selectedDataset = action.datasets.length ? action.datasets[0] : null;
        if (selectedDataset) {
          selectedDatasetId = selectedDataset.id;
          if (selectedDataset.variables.length > 0) {
            selectedVariableName = selectedDataset.variables[0].name;
          }
        }
      }
      if (!selectedDatasetId) {
        mapInteraction = "Select";
      }
      return {
        ...state,
        selectedDatasetId,
        selectedVariableName,
        mapInteraction,
      };
    }
    case SELECT_DATASET: {
      let selectedVariableName = state.selectedVariableName;
      const selectedDataset = findDataset(
        action.datasets,
        action.selectedDatasetId,
      )!;
      const selectedVariable = findDatasetVariable(
        selectedDataset,
        selectedVariableName,
      );
      if (!selectedVariable && selectedDataset.variables.length > 0) {
        selectedVariableName = selectedDataset.variables[0].name;
      }
      const selectedDatasetId = action.selectedDatasetId;
      const selectedTimeRange = getDatasetTimeRange(selectedDataset);
      const selectedTime = selectedTimeRange ? selectedTimeRange[1] : null;
      return {
        ...state,
        selectedDatasetId,
        selectedVariableName,
        selectedTimeRange,
        selectedTime,
      };
    }
    case FLY_TO: {
      const { location } = action;
      if (state.flyTo !== location) {
        return {
          ...state,
          flyTo: location,
        };
      }
      return state;
    }
    case SELECT_PLACE_GROUPS: {
      const selectedPlaceGroupIds = action.selectedPlaceGroupIds;
      const selectedPlaceId = null;
      return {
        ...state,
        selectedPlaceGroupIds,
        selectedPlaceId,
      };
    }
    case SELECT_PLACE: {
      const { placeId } = action;
      return {
        ...state,
        selectedPlaceId: placeId,
      };
    }
    case SELECT_VARIABLE: {
      return {
        ...state,
        selectedVariableName: action.selectedVariableName,
      };
    }
    case SET_RGB_LAYER_VISIBILITY: {
      return {
        ...state,
        showRgbLayer: action.showRgbLayer,
      };
    }
    case SELECT_TIME: {
      let { selectedTime } = action;
      if (selectedTime !== null && appState) {
        const timeCoordinates = timeCoordinatesSelector(appState)!;
        const index = timeCoordinates
          ? findIndexCloseTo(timeCoordinates, selectedTime)
          : -1;
        if (index >= 0) {
          selectedTime = timeCoordinates[index];
        }
      }
      if (state.selectedTime !== selectedTime) {
        return {
          ...state,
          selectedTime,
        };
      }
      return state;
    }
    case INC_SELECTED_TIME: {
      if (appState) {
        let index = selectedTimeIndexSelector(appState);
        if (index >= 0) {
          const timeCoordinates = timeCoordinatesSelector(appState)!;
          index += action.increment;
          if (index < 0) {
            index = timeCoordinates.length - 1;
          }
          if (index > timeCoordinates.length - 1) {
            index = 0;
          }
          let selectedTime = timeCoordinates[index];
          const selectedTimeRange = state.selectedTimeRange;
          if (selectedTimeRange !== null) {
            if (selectedTime < selectedTimeRange[0]) {
              selectedTime = selectedTimeRange[0];
            }
            if (selectedTime > selectedTimeRange[1]) {
              selectedTime = selectedTimeRange[1];
            }
          }
          if (state.selectedTime !== selectedTime) {
            return {
              ...state,
              selectedTime,
            };
          }
        }
      }
      return state;
    }
    case SELECT_TIME_RANGE: {
      return {
        ...state,
        selectedTimeRange: action.selectedTimeRange,
      };
    }
    case SELECT_TIME_SERIES_UPDATE_MODE: {
      return {
        ...state,
        timeSeriesUpdateMode: action.timeSeriesUpdateMode,
      };
    }
    case UPDATE_TIME_ANIMATION: {
      return {
        ...state,
        timeAnimationActive: action.timeAnimationActive,
        timeAnimationInterval: action.timeAnimationInterval,
      };
    }
    case ADD_DRAWN_USER_PLACE: {
      const { id, selected } = action;
      if (selected) {
        return selectUserPlace(state, USER_DRAWN_PLACE_GROUP_ID, id);
      }
      return state;
    }
    case ADD_IMPORTED_USER_PLACE_GROUPS: {
      const { placeGroups } = action;
      if (placeGroups.length > 0) {
        return {
          ...state,
          selectedPlaceGroupIds: [
            ...(state.selectedPlaceGroupIds || []),
            placeGroups[0].id,
          ],
        };
      }
      return state;
    }
    case RENAME_USER_PLACE_GROUP: {
      const { placeGroupId, newName } = action;
      if (placeGroupId === USER_DRAWN_PLACE_GROUP_ID) {
        return {
          ...state,
          userDrawnPlaceGroupName: newName,
        };
      }
      return state;
    }
    case REMOVE_USER_PLACE: {
      const { placeId, places } = action;
      if (placeId === state.selectedPlaceId) {
        let selectedPlaceId = null;
        const index = places.findIndex((p) => p.id === placeId);
        if (index >= 0) {
          if (index < places.length - 1) {
            selectedPlaceId = places[index + 1].id;
          } else if (index > 0) {
            selectedPlaceId = places[index - 1].id;
          }
        }
        return {
          ...state,
          selectedPlaceId,
        };
      }
      return state;
    }
    case SET_MAP_INTERACTION: {
      let newState = {
        ...state,
        mapInteraction: action.mapInteraction,
        lastMapInteraction: state.mapInteraction,
      };
      if (action.mapInteraction === "Geometry") {
        newState = {
          ...newState,
          dialogOpen: {
            ...state.dialogOpen,
            addUserPlacesFromText: true,
          },
        };
      }
      return newState;
    }
    case SHOW_VOLUME_CARD: {
      state = {
        ...state,
        volumeCardOpen: action.volumeCardOpen,
      };
      storeUserSettings(state);
      return state;
    }
    case SET_VOLUME_RENDER_MODE: {
      state = {
        ...state,
        volumeRenderMode: action.volumeRenderMode,
      };
      storeUserSettings(state);
      return state;
    }
    case UPDATE_VOLUME_STATE: {
      const { volumeId, volumeState } = action;
      state = {
        ...state,
        volumeStates: { ...state.volumeStates, [volumeId]: volumeState },
      };
      return state;
    }
    case SHOW_INFO_CARD: {
      state = {
        ...state,
        infoCardOpen: action.infoCardOpen,
      };
      storeUserSettings(state);
      return state;
    }
    case SET_VISIBLE_INFO_CARD_ELEMENTS: {
      const infoCardElementStates = { ...state.infoCardElementStates };
      Object.getOwnPropertyNames(infoCardElementStates).forEach((e) => {
        infoCardElementStates[e] = {
          ...infoCardElementStates[e],
          visible: action.visibleElements.includes(e),
        };
      });
      state = {
        ...state,
        infoCardElementStates,
      };
      storeUserSettings(state);
      return state;
    }
    case UPDATE_INFO_CARD_ELEMENT_VIEW_MODE: {
      const { elementType, viewMode } = action;
      const newState = {
        ...state,
        infoCardElementStates: {
          ...state.infoCardElementStates,
          [elementType]: {
            ...state.infoCardElementStates[elementType],
            viewMode,
          },
        },
      };
      storeUserSettings(newState);
      return newState;
    }
    case ADD_ACTIVITY: {
      return {
        ...state,
        activities: { ...state.activities, [action.id]: action.message },
      };
    }
    case REMOVE_ACTIVITY: {
      const activities = { ...state.activities };
      delete activities[action.id];
      return {
        ...state,
        activities,
      };
    }
    case CHANGE_LOCALE: {
      const locale = action.locale;
      i18n.locale = locale;
      if (locale !== state.locale) {
        state = { ...state, locale };
        storeUserSettings(state);
      }
      return state;
    }
    case OPEN_DIALOG: {
      const dialogId = action.dialogId;
      return {
        ...state,
        dialogOpen: { ...state.dialogOpen, [dialogId]: true },
      };
    }
    case CLOSE_DIALOG: {
      const dialogId = action.dialogId;
      return {
        ...state,
        dialogOpen: { ...state.dialogOpen, [dialogId]: false },
      };
    }
    case CONFIGURE_SERVERS: {
      if (state.selectedServerId !== action.selectedServerId) {
        return { ...state, selectedServerId: action.selectedServerId };
      }
    }
  }
  return state;
}

function selectUserPlace(
  state: ControlState,
  placeGroupId: string,
  placeId: string,
): ControlState {
  let selectedPlaceGroupIds = state.selectedPlaceGroupIds;
  if (
    !state.selectedPlaceGroupIds ||
    state.selectedPlaceGroupIds.length === 0
  ) {
    selectedPlaceGroupIds = [placeGroupId];
  } else if (!state.selectedPlaceGroupIds.find((id) => id === placeGroupId)) {
    selectedPlaceGroupIds = [...state.selectedPlaceGroupIds, placeGroupId];
  }
  return {
    ...state,
    selectedPlaceGroupIds,
    selectedPlaceId: placeId,
  };
}

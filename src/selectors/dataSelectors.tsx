/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { createSelector } from "reselect";

import { AppState } from "@/states/appState";
import { Dataset } from "@/model/dataset";
import { PlaceGroup } from "@/model/place";
import {
  PlaceGroupTimeSeries,
  placeGroupToTimeSeries,
} from "@/model/timeSeries";

export const datasetsSelector = (state: AppState) =>
  state.dataState.datasets || [];
export const predefinedColorBarsSelector = (state: AppState) =>
  state.dataState.colorBars;
export const timeSeriesGroupsSelector = (state: AppState) =>
  state.dataState.timeSeriesGroups;
export const userPlaceGroupsSelector = (state: AppState) =>
  state.dataState.userPlaceGroups;
export const userServersSelector = (state: AppState) =>
  state.dataState.userServers || [];
export const expressionCapabilitiesSelector = (state: AppState) =>
  state.dataState.expressionCapabilities;
export const statisticsLoadingSelector = (state: AppState) =>
  state.dataState.statistics.loading;
export const statisticsRecordsSelector = (state: AppState) =>
  state.dataState.statistics.records;

export const placeGroupsSelector = createSelector(
  datasetsSelector,
  userPlaceGroupsSelector,
  (datasets: Dataset[], userPlaceGroups: PlaceGroup[]): PlaceGroup[] => {
    const placeGroups: Record<string, PlaceGroup> = {};
    const datasetPlaceGroups: PlaceGroup[] = [];
    datasets.forEach((dataset) => {
      if (dataset.placeGroups) {
        dataset.placeGroups.forEach((placeGroup) => {
          if (!placeGroups[placeGroup.id]) {
            placeGroups[placeGroup.id] = placeGroup;
            datasetPlaceGroups.push(placeGroup);
          }
        });
      }
    });
    return [...datasetPlaceGroups, ...userPlaceGroups];
  },
);

export const placeGroupTimeSeriesSelector = createSelector(
  placeGroupsSelector,
  (placeGroups: PlaceGroup[]): PlaceGroupTimeSeries[] => {
    const placeGroupTimeSeries: PlaceGroupTimeSeries[] = [];
    placeGroups.forEach((placeGroup) => {
      const timeSeries = placeGroupToTimeSeries(placeGroup);
      if (timeSeries !== null) {
        placeGroupTimeSeries.push(timeSeries);
      }
    });
    return placeGroupTimeSeries;
  },
);

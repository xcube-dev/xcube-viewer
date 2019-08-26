import { AppState } from "../states/appState";

export const datasetsSelector = (state: AppState) => state.dataState.datasets || [];
export const colorBarsSelector = (state: AppState) => state.dataState.colorBars;
export const timeSeriesGroupsSelector = (state: AppState) => state.dataState.timeSeriesGroups;
export const userPlaceGroupSelector = (state: AppState) => state.dataState.userPlaceGroup;
export const userServersSelector = (state: AppState) => state.dataState.userServers || [];

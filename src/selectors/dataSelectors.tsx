import { AppState } from "../states/appState";

export const datasetsSelector = (state: AppState) => state.dataState.datasets || [];
export const colorBarsSelector = (state: AppState) => state.dataState.colorBars;
export const userPlacesSelector = (state: AppState) => state.dataState.userPlaces || [];
export const userServersSelector = (state: AppState) => state.dataState.userServers || [];

import { AppState } from "../states/appState";

export const datasetsSelector = (state: AppState) => state.dataState.datasets;
export const userPlacesSelector = (state: AppState) => state.dataState.userPlaces;

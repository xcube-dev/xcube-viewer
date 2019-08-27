import { AppState } from "../states/appState";
import { createSelector } from "reselect";
import { Dataset } from "../model/dataset";
import { PlaceGroup } from "../model/place";

export const datasetsSelector = (state: AppState) => state.dataState.datasets || [];
export const colorBarsSelector = (state: AppState) => state.dataState.colorBars;
export const timeSeriesGroupsSelector = (state: AppState) => state.dataState.timeSeriesGroups;
export const userPlaceGroupSelector = (state: AppState) => state.dataState.userPlaceGroup;
export const userServersSelector = (state: AppState) => state.dataState.userServers || [];

export const placeGroupsSelector = createSelector(
    datasetsSelector,
    userPlaceGroupSelector,
    (datasets: Dataset[], userPlaceGroup: PlaceGroup): PlaceGroup[] => {
        const placeGroups = {};
        const placeGroupsArray = [userPlaceGroup];
        datasets.forEach(dataset => {
            if (dataset.placeGroups) {
                dataset.placeGroups.forEach(placeGroup => {
                    if (!placeGroups[placeGroup.id]) {
                        placeGroups[placeGroup.id] = placeGroup;
                        placeGroupsArray.push(placeGroup);
                    }

                });
            }
        });
        return placeGroupsArray;
    }
);

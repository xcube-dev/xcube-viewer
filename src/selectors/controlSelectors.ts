import { createSelector } from 'reselect'
import { AppState } from "../states/appState";
import { datasetsSelector } from "./dataSelectors";
import { Dataset } from "../types/dataset";
import { LocationGroup } from "../types/location";

export const selectedDatasetIdSelector = (state: AppState) => state.controlState.selectedDatasetId;

export const selectedDatasetSelector = createSelector(
    datasetsSelector,
    selectedDatasetIdSelector,
    (datasets: Dataset[], selectedDatasetId: string | null): Dataset | null => {
        return datasets.find(dataset => dataset.id === selectedDatasetId) || null;
    }
);

export const selectedDatasetLocationGroupSelector = createSelector(
    selectedDatasetSelector,
    (dataset: Dataset | null): LocationGroup | null => {
        return (dataset && dataset.locationGroup) || null;
    }
);

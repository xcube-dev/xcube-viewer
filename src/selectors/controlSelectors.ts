import { createSelector } from 'reselect'
import { AppState } from "../states/appState";
import { datasetsSelector } from "./dataSelectors";

import { Dataset, Variable } from "../types/dataset";
import { Location, LocationGroup } from "../types/location";

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

export const selectedDatasetLocationsSelector= createSelector(
    selectedDatasetLocationGroupSelector,
    (locationGroup: LocationGroup | null): Location[] => {
        return (locationGroup && locationGroup.locations) || [];
    }
);

export const selectedDatasetVariablesSelector = createSelector(
    selectedDatasetSelector,
    (dataset: Dataset | null): Variable[] | null => {
        return (dataset && dataset.variables) || [];
    }
);


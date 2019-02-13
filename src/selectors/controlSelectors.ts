import { createSelector } from 'reselect'
import { AppState } from "../states/appState";
import { datasetsSelector } from "./dataSelectors";

import { Dataset, Variable } from "../types/dataset";
import { Place, PlaceGroup } from "../types/place";

export const selectedDatasetIdSelector = (state: AppState) => state.controlState.selectedDatasetId;

export const selectedDatasetSelector = createSelector(
    datasetsSelector,
    selectedDatasetIdSelector,
    (datasets: Dataset[], selectedDatasetId: string | null): Dataset | null => {
        return datasets.find(dataset => dataset.id === selectedDatasetId) || null;
    }
);

export const selectedDatasetVariablesSelector = createSelector(
    selectedDatasetSelector,
    (dataset: Dataset | null): Variable[] | null => {
        return (dataset && dataset.variables) || [];
    }
);

export const selectedDatasetPlaceGroupsSelector = createSelector(
    selectedDatasetSelector,
    (dataset: Dataset | null): PlaceGroup[] | null => {
        return (dataset && dataset.placeGroups) || [];
    }
);

/**
 * Get first-level features as a single array
 */
export const selectedDatasetPlacesSelector = createSelector(
    selectedDatasetPlaceGroupsSelector,
    (placeGroups: PlaceGroup[]): Place[] => {
        const args = placeGroups.map(placeGroup => placeGroup.features as Place[]);
        return ([] as  Array<Place>).concat(...args);
    }
);


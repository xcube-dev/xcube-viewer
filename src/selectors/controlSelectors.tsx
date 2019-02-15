import * as React from 'react';
import { createSelector } from 'reselect'
import { AppState } from '../states/appState';
import { datasetsSelector } from './dataSelectors';
import * as ol from 'openlayers';

import { Dataset, findDataset, findDatasetVariable, Variable, Place, PlaceGroup  } from '../model';
import { LayerElement } from '../components/ol/layer/Layers';
import { XYZ } from '../components/ol/layer/XYZ';

export const selectedDatasetIdSelector = (state: AppState) => state.controlState.selectedDatasetId;
export const selectedVariableNameSelector = (state: AppState) => state.controlState.selectedVariableName;
export const selectedTimeSelector = (state: AppState) => state.controlState.selectedTime;

export const selectedDatasetSelector = createSelector(
    datasetsSelector,
    selectedDatasetIdSelector,
    findDataset,
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

export const selectedVariableSelector = createSelector(
    selectedDatasetSelector,
    selectedVariableNameSelector,
    (dataset: Dataset | null, variableName: string | null): Variable | null => {
        return (dataset && findDatasetVariable(dataset, variableName)) || null;
    }
);

export const selectedVariableLayerSelector = createSelector(
    selectedVariableSelector,
    selectedTimeSelector,
    (variable: Variable | null, time: string | null): LayerElement => {
        if (!variable || !variable.tileSourceOptions) {
            return null;
        }
        const options = variable.tileSourceOptions;
        let url = options.url;
        if (time) {
            url += `?time=${time}`;
        }
        const attributions = [
            new ol.Attribution(
                {
                    html: '<br/>&copy; <a href=&quot;https://www.brockmann-consult.de&quot;>Brockmann Consult GmbH</a> and contributors'
                }
            ),
        ];
        // TODO: get attributions from dataset metadata
        return (
            <XYZ
                url={url}
                projection={ol.proj.get(options.projection)}
                minZoom={options.minZoom}
                maxZoom={options.maxZoom}
                tileGrid={new ol.tilegrid.TileGrid(options.tileGrid)}
                attributions={attributions}
            />
        );
    }
);

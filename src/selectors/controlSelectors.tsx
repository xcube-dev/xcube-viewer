import * as React from 'react';
import { createSelector } from 'reselect'
import { AppState } from '../states/appState';
import { datasetsSelector, colorBarsSelector } from './dataSelectors';
import * as ol from 'openlayers';

import { Dataset, findDataset, findDatasetVariable, Variable, Place, PlaceGroup, Time } from '../model';
import { XYZ } from '../components/ol/layer/XYZ';
import ColorBarLegend from '../components/ColorBarLegend';
import { MapElement } from '../components/ol/Map';
import { ColorBars } from '../model/colorBar';


export const selectedDatasetIdSelector = (state: AppState) => state.controlState.selectedDatasetId;
export const selectedVariableNameSelector = (state: AppState) => state.controlState.selectedVariableName;
export const selectedTimeSelector = (state: AppState) => state.controlState.selectedTime;

export const selectedDatasetSelector = createSelector(
    datasetsSelector,
    selectedDatasetIdSelector,
    findDataset
);


export const selectedDatasetVariablesSelector = createSelector(
    selectedDatasetSelector,
    (dataset: Dataset | null): Variable[] => {
        return (dataset && dataset.variables) || [];
    }
);

export const selectedDatasetPlaceGroupsSelector = createSelector(
    selectedDatasetSelector,
    (dataset: Dataset | null): PlaceGroup[] => {
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
    (variable: Variable | null, time: Time | null): MapElement => {
        if (!variable || !variable.tileSourceOptions) {
            return null;
        }
        const options = variable.tileSourceOptions;
        let url = options.url;
        if (time !== null) {
            url += `?time=${new Date(time).toISOString()}`;
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

export const selectedColorBarLegendSelector = createSelector(
    selectedVariableSelector,
    colorBarsSelector,
    (variable: Variable | null, colorBars: ColorBars | null): MapElement => {
        if (!variable || !colorBars) {
            return null;
        }
        const {name, units, colorBarName, colorBarMin, colorBarMax} = variable;
        const imageData = colorBars.images[colorBarName];
        return (
            <ColorBarLegend
                name={name}
                units={units}
                imageData={imageData}
                minValue={colorBarMin}
                maxValue={colorBarMax}
            />
        );
    }
);

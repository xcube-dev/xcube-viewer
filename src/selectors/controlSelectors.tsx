import * as React from 'react';
import { createSelector } from 'reselect'
import { AppState } from '../states/appState';
import { datasetsSelector, colorBarsSelector } from './dataSelectors';
import * as ol from 'openlayers';

import { Dataset, findDataset, findDatasetVariable } from '../model/dataset';
import { Variable } from '../model/variable';
import { Place, PlaceGroup } from '../model/place';
import { Time } from '../model/timeSeries';
import ColorBarLegend from '../components/ColorBarLegend';
import { MapElement } from '../components/ol/Map';
import { ColorBars } from '../model/colorBar';
import { Tile } from "../components/ol/layer/Tile";
import { Vector } from "../components/ol/layer/Vector";
import { Layers } from "../components/ol/layer/Layers";


export const selectedDatasetIdSelector = (state: AppState) => state.controlState.selectedDatasetId;
export const selectedVariableNameSelector = (state: AppState) => state.controlState.selectedVariableName;
export const selectedPlaceGroupIdsSelector = (state: AppState) => state.controlState.selectedPlaceGroupIds;
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

export const selectedDatasetSelectedPlaceGroupsSelector = createSelector(
    selectedDatasetPlaceGroupsSelector,
    selectedPlaceGroupIdsSelector,
    (placeGroups: PlaceGroup[], placeGroupIds: string[] | null): PlaceGroup[] => {
        const selectedPlaceGroups: PlaceGroup[] = [];
        if (placeGroupIds !== null && placeGroupIds.length > 0) {
            placeGroups.forEach(placeGroup => {
                if (placeGroupIds.indexOf(placeGroup.id) > -1) {
                    selectedPlaceGroups.push(placeGroup);
                }
            });
        }
        return selectedPlaceGroups;
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

export const selectedDatasetVariableSelector = createSelector(
    selectedDatasetSelector,
    selectedVariableNameSelector,
    (dataset: Dataset | null, variableName: string | null): Variable | null => {
        return (dataset && findDatasetVariable(dataset, variableName)) || null;
    }
);

export const selectedDatasetVariableLayerSelector = createSelector(
    selectedDatasetVariableSelector,
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
            <Tile
                source={new ol.source.XYZ(
                    {
                        url,
                        projection: ol.proj.get(options.projection),
                        minZoom: options.minZoom,
                        maxZoom: options.maxZoom,
                        tileGrid: new ol.tilegrid.TileGrid(options.tileGrid),
                        attributions,
                    })
                }
            />
        );
    }
);

export const selectedDatasetPlaceGroupLayersSelector = createSelector(
    selectedDatasetSelectedPlaceGroupsSelector,
    (placeGroups: PlaceGroup[]): MapElement => {
        if (placeGroups.length === 0) {
            return null;
        }
        const layers: MapElement[] = [];
        placeGroups.forEach((placeGroup, index) => {
            layers.push(
                <Vector
                    key={index}
                    source={new ol.source.Vector(
                        {
                            features: new ol.format.GeoJSON().readFeatures(placeGroup.features)
                        })}
                />);
        });
        return (<Layers>{layers}</Layers>);
    }
);

export const selectedColorBarLegendSelector = createSelector(
    selectedDatasetVariableSelector,
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

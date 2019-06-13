///<reference path="../util/find.ts"/>
import * as React from 'react';
import { createSelector } from 'reselect'
import { AppState } from '../states/appState';
import { datasetsSelector, colorBarsSelector, userServersSelector } from './dataSelectors';
import * as ol from 'openlayers';

import {
    Dataset,
    findDataset,
    findDatasetVariable,
    getDatasetTimeDimension,
    getDatasetTimeRange, TimeDimension
} from '../model/dataset';
import { Variable } from '../model/variable';
import { getPlaceLabel, Place, PlaceGroup, LABEL_PROPERTY_NAMES } from '../model/place';
import { Time, TimeRange } from '../model/timeSeries';
import ColorBarLegend from '../components/ColorBarLegend';
import { MapElement } from '../components/ol/Map';
import { ColorBars } from '../model/colorBar';
import { Tile } from '../components/ol/layer/Tile';
import { Vector } from '../components/ol/layer/Vector';
import { Layers } from '../components/ol/layer/Layers';
import { findIndexCloseTo } from "../util/find";
import { Server } from "../model/server";


export const selectedDatasetIdSelector = (state: AppState) => state.controlState.selectedDatasetId;
export const selectedVariableNameSelector = (state: AppState) => state.controlState.selectedVariableName;
export const selectedPlaceGroupIdsSelector = (state: AppState) => state.controlState.selectedPlaceGroupIds;
export const selectedTimeSelector = (state: AppState) => state.controlState.selectedTime;
export const selectedServerIdSelector = (state: AppState) => state.controlState.selectedServerId;
export const activitiesSelector = (state: AppState) => state.controlState.activities;
export const timeAnimationActiveSelector = (state: AppState) => state.controlState.timeAnimationActive;

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

export const selectedDatasetTimeRangeSelector = createSelector(
    selectedDatasetSelector,
    (dataset: Dataset | null): TimeRange | null => {
        return dataset !== null ? getDatasetTimeRange(dataset) : null;
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

export const selectedDatasetSelectedPlaceGroupsTitleSelector = createSelector(
    selectedDatasetSelectedPlaceGroupsSelector,
    (placeGroups: PlaceGroup[]): string => {
        return placeGroups.map(placeGroup => placeGroup.title || placeGroup.id).join(', ');
    }
);

export const selectedDatasetSelectedPlaceGroupPlacesSelector = createSelector(
    selectedDatasetSelectedPlaceGroupsSelector,
    (placeGroups: PlaceGroup[]): Place[] => {
        const args = placeGroups.map(placeGroup => placeGroup.features as Place[]);
        return ([] as Array<Place>).concat(...args);
    }
);

export const selectedDatasetSelectedPlaceGroupPlaceLabelsSelector = createSelector(
    selectedDatasetSelectedPlaceGroupsSelector,
    (placeGroups: PlaceGroup[]): string[] => {
        const labelPropNames = ['__placeholder__', ...LABEL_PROPERTY_NAMES];
        let labels: string[] = [];
        placeGroups.forEach(placeGroup => {
            const propertyMapping = placeGroup.propertyMapping;
            if (propertyMapping && propertyMapping['label']) {
                labelPropNames[0] = propertyMapping['label'];
            }
            labels = labels.concat(placeGroup.features.map((place: Place) => getPlaceLabel(place, labelPropNames)))
        });
        return labels;
    }
);

export const selectedDatasetVariableSelector = createSelector(
    selectedDatasetSelector,
    selectedVariableNameSelector,
    (dataset: Dataset | null, variableName: string | null): Variable | null => {
        return (dataset && findDatasetVariable(dataset, variableName)) || null;
    }
);

export const selectedDatasetTimeDimensionSelector = createSelector(
    selectedDatasetSelector,
    (dataset: Dataset | null): TimeDimension | null => {
        return (dataset && getDatasetTimeDimension(dataset)) || null;
    }
);

export const timeCoordinatesSelector = createSelector(
    selectedDatasetTimeDimensionSelector,
    (timeDimension: TimeDimension | null): Time[] | null => {
        if (timeDimension === null || timeDimension.coordinates.length === 0) {
            return null;
        }
        return timeDimension.coordinates;
    }
);

export const selectedTimeIndexSelector = createSelector(
    selectedTimeSelector,
    timeCoordinatesSelector,
    (time: Time | null, timeCoordinates: Time[] | null): number => {
        if (time === null || timeCoordinates === null) {
            return -1;
        }
        return findIndexCloseTo(timeCoordinates, time);
    }
);

export const selectedDatasetVariableLayerSelector = createSelector(
    selectedDatasetVariableSelector,
    selectedDatasetTimeDimensionSelector,
    selectedTimeSelector,
    timeAnimationActiveSelector,
    (variable: Variable | null,
     timeDimension: TimeDimension | null,
     time: Time | null,
     timeAnimationActive: boolean): MapElement => {
        if (!variable || !variable.tileSourceOptions) {
            return null;
        }
        const options = variable.tileSourceOptions;
        let url = options.url;
        if (time !== null) {
            let timeString;
            if (timeDimension) {
                const timeIndex = findIndexCloseTo(timeDimension.coordinates, time);
                if (timeIndex > -1) {
                    timeString = timeDimension.labels[timeIndex];
                    // console.log("adjusted time from", new Date(time).toISOString(), "to", timeString);
                }
            }
            if (!timeString) {
                timeString = new Date(time).toISOString();
            }
            url += `?time=${timeString}`;
        }
        const attributions = [
            new ol.Attribution(
                {
                    html: '&copy; <a href=&quot;https://www.brockmann-consult.de&quot;>Brockmann Consult GmbH</a>'
                }
            ),
        ];
        // TODO: get attributions from dataset metadata
        const source = new ol.source.XYZ(
            {
                url,
                projection: ol.proj.get(options.projection),
                minZoom: options.minZoom,
                maxZoom: options.maxZoom,
                tileGrid: new ol.tilegrid.TileGrid(options.tileGrid),
                attributions,
                // @ts-ignore
                transition: timeAnimationActive ? 0 : 250,
            });
        return (
            <Tile id={"variable"} source={source}/>
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
                    id={`placeGroup.${placeGroup.id}`}
                    source={new ol.source.Vector(
                        {
                            features: new ol.format.GeoJSON({
                                                                defaultDataProjection: 'EPSG:4326',
                                                                featureProjection: 'EPSG:3857'
                                                            }).readFeatures(placeGroup),
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

export const activityMessagesSelector = createSelector(
    activitiesSelector,
    (activities: { [id: string]: string }): string[] => {
        return Object.keys(activities).map(k => activities[k]);
    }
);

export const selectedServerSelector = createSelector(
    userServersSelector,
    selectedServerIdSelector,
    (userServers: Server[], serverId: string): Server => {
        if (userServers.length === 0) {
            throw new Error(`internal error: no servers configured`);
        }
        const server = userServers.find(server => server.id === serverId);
        if (!server) {
            throw new Error(`internal error: server with ID "${serverId}" not found`);
        }
        return server;
    }
);

///<reference path="../util/find.ts"/>
import * as React from 'react';
import { createSelector } from 'reselect'
import { AppState } from '../states/appState';
import {
    datasetsSelector,
    colorBarsSelector,
    userServersSelector,
    userPlaceGroupSelector,
    timeSeriesGroupsSelector
} from './dataSelectors';
import * as ol from 'openlayers';

import {
    Dataset,
    findDataset,
    findDatasetVariable,
    getDatasetTimeDimension,
    getDatasetTimeRange, TimeDimension
} from '../model/dataset';
import { Variable } from '../model/variable';
import {
    Place,
    PlaceGroup,
    isValidPlaceGroup,
    PlaceInfo, forEachPlace,
} from '../model/place';
import { Time, TimeRange, TimeSeriesGroup } from '../model/timeSeries';
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
export const selectedPlaceIdSelector = (state: AppState) => state.controlState.selectedPlaceId;
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

export const placeGroupsSelector = createSelector(
    selectedDatasetPlaceGroupsSelector,
    userPlaceGroupSelector,
    (placeGroups: PlaceGroup[], userPlaceGroup: PlaceGroup): PlaceGroup[] => {
        if (!userPlaceGroup.features || userPlaceGroup.features.length === 0) {
            return placeGroups;
        }
        return placeGroups.concat([userPlaceGroup]);
    }
);

function selectPlaceGroups(placeGroups: PlaceGroup[],
                           placeGroupIds: string[] | null): PlaceGroup[] {
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

export const selectedDatasetSelectedPlaceGroupsSelector = createSelector(
    selectedDatasetPlaceGroupsSelector,
    selectedPlaceGroupIdsSelector,
    selectPlaceGroups
);

export const selectedPlaceGroupsSelector = createSelector(
    placeGroupsSelector,
    selectedPlaceGroupIdsSelector,
    selectPlaceGroups
);

export const selectedPlaceGroupsTitleSelector = createSelector(
    selectedPlaceGroupsSelector,
    (placeGroups: PlaceGroup[]): string => {
        return placeGroups.map(placeGroup => placeGroup.title || placeGroup.id).join(', ');
    }
);

export const selectedPlaceGroupPlacesSelector = createSelector(
    selectedPlaceGroupsSelector,
    (placeGroups: PlaceGroup[]): Place[] => {
        const args = placeGroups.map(placeGroup => (isValidPlaceGroup(placeGroup) ? placeGroup.features : []) as Place[]);
        return ([] as Array<Place>).concat(...args);
    }
);


export const selectedPlaceSelector = createSelector(
    selectedPlaceGroupPlacesSelector,
    selectedPlaceIdSelector,
    (places: Place[], placeId: string | null): Place | null => {
        return places.find(place => place.id === placeId) || null;
    }
);


export const canAddTimeSeriesSelector = createSelector(
    timeSeriesGroupsSelector,
    selectedDatasetIdSelector,
    selectedVariableNameSelector,
    selectedPlaceIdSelector,
    (timeSeriesGroups: TimeSeriesGroup[],
     datasetId: string | null,
     variableName: string | null,
     placeId: string | null): boolean => {
        if (!datasetId || !variableName || !placeId) {
            return false;
        }
        for (let timeSeriesGroup of timeSeriesGroups) {
            for (let timeSeries of timeSeriesGroup.timeSeriesArray) {
                const source = timeSeries.source;
                if (source.datasetId === datasetId
                    && source.variableName === variableName
                    && source.placeId === placeId) {
                    return false;
                }
            }
        }
        return true;
    }
);

export const timeSeriesPlaceInfosSelector = createSelector(
    timeSeriesGroupsSelector,
    placeGroupsSelector,
    (timeSeriesGroups: TimeSeriesGroup[], placeGroups: PlaceGroup[]): { [placeId: string]: PlaceInfo } => {
        const placeInfos = {};
        forEachPlace(placeGroups, (placeGroup, place, label, color) => {
            for (let timeSeriesGroup of timeSeriesGroups) {
                if (timeSeriesGroup.timeSeriesArray.find(ts => ts.source.placeId === place.id)) {
                    placeInfos[place.id] = {placeGroup, place, label, color};
                    break;
                }
            }
        });
        return placeInfos;
    }
);


export const selectedPlaceGroupPlaceLabelsSelector = createSelector(
    selectedPlaceGroupsSelector,
    (placeGroups: PlaceGroup[]): string[] => {
        const placeLabels: string[] = [];
        forEachPlace(placeGroups, (placeGroup, place, label) => {
            placeLabels.push(label);
        });
        return placeLabels;
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
            if (isValidPlaceGroup(placeGroup)) {
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
            }
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


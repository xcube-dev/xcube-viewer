///<reference path="../util/find.ts"/>
import * as React from 'react';
import { createSelector } from 'reselect'
import { default as OlGeoJSONFormat } from 'ol/format/GeoJSON';
import { default as OlTileGrid } from 'ol/tilegrid/TileGrid';
import { default as OlVectorSource } from 'ol/source/Vector';
import { default as OlXYZSource } from 'ol/source/XYZ';
import { get as olProjGet } from 'ol/proj'

import { AppState } from '../states/appState';
import {
    datasetsSelector,
    userServersSelector,
    userPlaceGroupSelector,
    timeSeriesGroupsSelector
} from './dataSelectors';
import {
    Dataset,
    findDataset,
    findDatasetVariable,
    getDatasetTimeDimension,
    getDatasetTimeRange, RgbSchema, TimeDimension
} from '../model/dataset';
import { Variable } from '../model/variable';
import { TileSourceOptions } from '../model/tile';
import {
    Place,
    PlaceGroup,
    isValidPlaceGroup,
    PlaceInfo, forEachPlace, getPlaceInfo, findPlaceInfo,
} from '../model/place';
import { Time, TimeRange, TimeSeriesGroup } from '../model/timeSeries';
import { MapElement } from '../components/ol/Map';
import { Tile } from '../components/ol/layer/Tile';
import { Vector } from '../components/ol/layer/Vector';
import { Layers } from '../components/ol/layer/Layers';
import { findIndexCloseTo } from '../util/find';
import { Server } from '../model/server';
import { MapGroup, maps, MapSource } from '../util/maps';
import { getTileAccess } from '../config';

export const selectedDatasetIdSelector = (state: AppState) => state.controlState.selectedDatasetId;
export const selectedVariableNameSelector = (state: AppState) => state.controlState.selectedVariableName;
export const selectedPlaceGroupIdsSelector = (state: AppState) => state.controlState.selectedPlaceGroupIds;
export const selectedPlaceIdSelector = (state: AppState) => state.controlState.selectedPlaceId;
export const selectedTimeSelector = (state: AppState) => state.controlState.selectedTime;
export const selectedServerIdSelector = (state: AppState) => state.controlState.selectedServerId;
export const activitiesSelector = (state: AppState) => state.controlState.activities;
export const timeAnimationActiveSelector = (state: AppState) => state.controlState.timeAnimationActive;
export const baseMapUrlSelector = (state: AppState) => state.controlState.baseMapUrl;
export const showRgbLayerSelector = (state: AppState) => state.controlState.showRgbLayer;
export const infoCardElementStatesSelector = (state: AppState) => state.controlState.infoCardElementStates;

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

export const selectedVariableSelector = createSelector(
    selectedDatasetSelector,
    selectedVariableNameSelector,
    (dataset: Dataset | null, varName: string | null): Variable | null => {
        if (!dataset || !varName) {
            return null;
        }
        return dataset.variables.find(v => v.name === varName) || null;
    }
);

export const selectedVariableUnitsSelector = createSelector(
    selectedVariableSelector,
    (variable: Variable | null): string => {
        return (variable && variable.units) || '-';
    }
);

export const selectedVariableColorBarMinMaxSelector = createSelector(
    selectedVariableSelector,
    (variable: Variable | null): [number, number] => {
        return variable ? [variable.colorBarMin, variable.colorBarMax] : [0, 1];
    }
);

export const selectedVariableColorBarNameSelector = createSelector(
    selectedVariableSelector,
    (variable: Variable | null): string => {
        return (variable && variable.colorBarName) || 'viridis';
    }
);

export const selectedDatasetTimeRangeSelector = createSelector(
    selectedDatasetSelector,
    (dataset: Dataset | null): TimeRange | null => {
        return dataset !== null ? getDatasetTimeRange(dataset) : null;
    }
);

export const selectedDatasetRgbSchemaSelector = createSelector(
    selectedDatasetSelector,
    (dataset: Dataset | null): RgbSchema | null => {
        return dataset !== null ? (dataset.rgbSchema || null) : null;
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

export const selectedPlaceInfoSelector = createSelector(
    selectedPlaceGroupsSelector,
    selectedPlaceIdSelector,
    (placeGroups: PlaceGroup[], placeId: string | null): PlaceInfo | null => {
        if (placeGroups.length === 0 || placeId === null) {
            return null;
        }
        return findPlaceInfo(placeGroups, (placeGroup, place) => place.id === placeId);
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
        const placeInfos: any = {};
        forEachPlace(placeGroups, (placeGroup, place) => {
            for (let timeSeriesGroup of timeSeriesGroups) {
                if (timeSeriesGroup.timeSeriesArray.find(ts => ts.source.placeId === place.id)) {
                    placeInfos[place.id] = getPlaceInfo(placeGroup, place);
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
        forEachPlace(placeGroups, (placeGroup, place) => {
            placeLabels.push(getPlaceInfo(placeGroup, place).label);
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

export const selectedDatasetAttributionsSelector = createSelector(
    selectedDatasetSelector,
    (dataset: Dataset | null): string[] | null => {
        return (dataset && dataset.attributions) || null;
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

function getTileLayer(layerId: string,
                      tileSourceOptions: TileSourceOptions,
                      queryParams: string,
                      timeDimension: TimeDimension | null,
                      time: number | null,
                      timeAnimationActive: boolean,
                      attributions: string[] | null) {
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
        queryParams += `&time=${timeString}`;
    }
    if (queryParams.length > 0) {
        queryParams = '?' + queryParams;
    }
    const url = tileSourceOptions.url + queryParams;

    const source = new OlXYZSource(
        {
            url,
            projection: olProjGet(tileSourceOptions.projection),
            minZoom: tileSourceOptions.minZoom,
            maxZoom: tileSourceOptions.maxZoom,
            tileGrid: new OlTileGrid(tileSourceOptions.tileGrid),
            attributions: attributions || undefined,
            transition: timeAnimationActive ? 0 : 250,
        });
    return (
        <Tile id={layerId} source={source} zIndex={10}/>
    );
}

export const selectedDatasetVariableLayerSelector = createSelector(
    selectedDatasetVariableSelector,
    selectedDatasetTimeDimensionSelector,
    selectedTimeSelector,
    timeAnimationActiveSelector,
    selectedVariableColorBarMinMaxSelector,
    selectedVariableColorBarNameSelector,
    selectedDatasetAttributionsSelector,
    (variable: Variable | null,
     timeDimension: TimeDimension | null,
     time: Time | null,
     timeAnimationActive: boolean,
     colorBarMinMax: [number, number],
     colorBarName: string,
     attributions: string[] | null,
    ): MapElement => {
        if (!variable || !variable.tileSourceOptions) {
            return null;
        }
        return getTileLayer('variable',
                            variable.tileSourceOptions,
                            `vmin=${colorBarMinMax[0]}&vmax=${colorBarMinMax[1]}&cbar=${colorBarName}`,
                            timeDimension,
                            time,
                            timeAnimationActive,
                            attributions);
    }
);

export const selectedDatasetRgbLayerSelector = createSelector(
    showRgbLayerSelector,
    selectedDatasetRgbSchemaSelector,
    selectedDatasetTimeDimensionSelector,
    selectedTimeSelector,
    timeAnimationActiveSelector,
    selectedDatasetAttributionsSelector,
    (showRgbLayer: boolean,
     rgbSchema: RgbSchema | null,
     timeDimension: TimeDimension | null,
     time: Time | null,
     timeAnimationActive: boolean,
     attributions: string[] | null,
    ): MapElement => {
        if (!showRgbLayer || !rgbSchema) {
            return null;
        }
        return getTileLayer('rgb',
                            rgbSchema.tileSourceOptions,
                            '',
                            timeDimension,
                            time,
                            timeAnimationActive,
                            attributions);
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
                        source={new OlVectorSource(
                            {
                                features: new OlGeoJSONFormat({
                                                                  dataProjection: 'EPSG:4326',
                                                                  featureProjection: 'EPSG:3857'
                                                              }).readFeatures(placeGroup),
                            })}
                    />);
            }
        });
        return (<Layers>{layers}</Layers>);
    }
);

export const visibleInfoCardElementsSelector = createSelector(
    infoCardElementStatesSelector,
    (infoCardElementStates): string[] => {
        const visibleInfoCardElements: string[] = [];
        Object.getOwnPropertyNames(infoCardElementStates).forEach(e => {
            if (!!infoCardElementStates[e].visible) {
                visibleInfoCardElements.push(e);
            }
        });
        return visibleInfoCardElements;
    }
);

export const infoCardElementViewModesSelector = createSelector(
    infoCardElementStatesSelector,
    (infoCardElementStates): { [elementType: string]: string } => {
        const infoCardElementCodeModes: { [elementType: string]: string } = {};
        Object.getOwnPropertyNames(infoCardElementStates).forEach(e => {
            infoCardElementCodeModes[e] = infoCardElementStates[e].viewMode || 'text';
        });
        return infoCardElementCodeModes;
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

export const baseMapLayerSelector = createSelector(
    baseMapUrlSelector,
    (baseMapUrl: string): JSX.Element | null => {
        const map = findMap(baseMapUrl);
        if (map) {
            const access = getTileAccess(map.group.name);
            const source = new OlXYZSource(
                {
                    url: map.dataset.endpoint + (access ? `?${access.param}=${access.token}` : ''),
                    attributions: [
                        `&copy; <a href=&quot;${map.group.link}&quot;>${map.group.name}</a>`,
                    ]
                });
            return <Tile id={map.group.name + '-' + map.dataset.name} source={source} zIndex={0}/>;
        }
        if (baseMapUrl) {
            const source = new OlXYZSource({url: baseMapUrl});
            return <Tile id={baseMapUrl} source={source} zIndex={0}/>;
        }
        return null;
    }
);

function findMap(endpoint: string): { group: MapGroup, dataset: MapSource } | null {
    for (let group of maps) {
        const dataset = group.datasets.find(dataset => dataset.endpoint === endpoint);
        if (dataset) {
            return {group, dataset};
        }
    }
    return null;
}
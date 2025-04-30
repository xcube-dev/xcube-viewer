/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { JSX } from "react";
import { createSelector } from "reselect";
import memoize from "fast-memoize";
import { ImageTile as OlImageTile, Tile as OlTile } from "ol";
import { default as OlMap } from "ol/Map";
import { default as OlGeoJSONFormat } from "ol/format/GeoJSON";
import { default as OlVectorSource } from "ol/source/Vector";
import { default as OlXYZSource } from "ol/source/XYZ";
import { default as OlTileWMSSource } from "ol/source/TileWMS";
import { default as OlCircle } from "ol/style/Circle";
import { default as OlFillStyle } from "ol/style/Fill";
import { default as OlStrokeStyle } from "ol/style/Stroke";
import { default as OlStyle } from "ol/style/Style";
import { default as OlTileGrid } from "ol/tilegrid/TileGrid";
import { LoadFunction } from "ol/Tile";
import { transformExtent as olTransformExtent } from "ol/proj";

import { Config, getUserPlaceFillOpacity } from "@/config";
import { ApiServerConfig } from "@/model/apiServer";
import { Layers } from "@/components/ol/layer/Layers";
import { Tile } from "@/components/ol/layer/Tile";
import { Vector } from "@/components/ol/layer/Vector";
import { MapElement } from "@/components/ol/Map";

import {
  Dataset,
  findDataset,
  findDatasetVariable,
  getDatasetTimeDimension,
  getDatasetTimeRange,
  getDatasetUserVariables,
  RgbSchema,
  TimeDimension,
} from "@/model/dataset";
import {
  findPlaceInfo,
  forEachPlace,
  getPlaceInfo,
  isValidPlaceGroup,
  Place,
  PlaceGroup,
  PlaceInfo,
} from "@/model/place";
import { Time, TimeRange, TimeSeriesGroup } from "@/model/timeSeries";
import { ColorBarNorm, Variable } from "@/model/variable";

import { AppState } from "@/states/appState";
import { findIndexCloseTo } from "@/util/find";
import {
  predefinedColorBarsSelector,
  datasetsSelector,
  statisticsRecordsSelector,
  timeSeriesGroupsSelector,
  userPlaceGroupsSelector,
  userServersSelector,
} from "./dataSelectors";
import { makeRequestUrl } from "@/api/callApi";
import {
  LayerStates,
  LayerVisibilities,
  MAP_OBJECTS,
  ViewMode,
} from "@/states/controlState";
import { GEOGRAPHIC_CRS, WEB_MERCATOR_CRS } from "@/model/proj";
import {
  ColorBar,
  ColorBarGroup,
  ColorBars,
  parseColorBarName,
} from "@/model/colorBar";
import {
  getUserColorBarHexRecords,
  USER_COLOR_BAR_GROUP_TITLE,
  UserColorBar,
} from "@/model/userColorBar";
import {
  defaultBaseMapLayers,
  defaultOverlayLayers,
  getConfigLayers,
  LayerDefinition,
  LayerGroup,
} from "@/model/layerDefinition";
import { UserVariable } from "@/model/userVariable";
import { encodeDatasetId, encodeVariableName } from "@/model/encode";
import { StatisticsRecord } from "@/model/statistics";
import { Geometry } from "geojson";
import { LayerState } from "@/model/layerState";

export const selectedDatasetIdSelector = (state: AppState) =>
  state.controlState.selectedDatasetId;
export const selectedVariableNameSelector = (state: AppState) =>
  state.controlState.selectedVariableName;
export const selectedDataset2IdSelector = (state: AppState) =>
  state.controlState.selectedDataset2Id;
export const selectedVariable2NameSelector = (state: AppState) =>
  state.controlState.selectedVariable2Name;
export const selectedPlaceGroupIdsSelector = (state: AppState) =>
  state.controlState.selectedPlaceGroupIds;
export const selectedPlaceIdSelector = (state: AppState) =>
  state.controlState.selectedPlaceId;
export const selectedTimeSelector = (state: AppState) =>
  state.controlState.selectedTime;
export const selectedServerIdSelector = (state: AppState) =>
  state.controlState.selectedServerId;
export const activitiesSelector = (state: AppState) =>
  state.controlState.activities;
export const timeAnimationActiveSelector = (state: AppState) =>
  state.controlState.timeAnimationActive;
export const imageSmoothingSelector = (state: AppState) =>
  state.controlState.imageSmoothingEnabled;
export const userBaseMapsSelector = (state: AppState) =>
  state.controlState.userBaseMaps;
export const userOverlaysSelector = (state: AppState) =>
  state.controlState.userOverlays;
export const showDatasetBoundaryLayerSelector = (state: AppState) =>
  state.controlState.layerVisibilities.datasetBoundary;
export const selectedVariableVisibilitySelector = (state: AppState) =>
  state.controlState.layerVisibilities.datasetVariable;
export const selectedVariable2VisibilitySelector = (state: AppState) =>
  state.controlState.layerVisibilities.datasetVariable2;
export const datasetRgbVisibilitySelector = (state: AppState) =>
  state.controlState.layerVisibilities.datasetRgb;
export const datasetRgb2VisibilitySelector = (state: AppState) =>
  state.controlState.layerVisibilities.datasetRgb2;
export const showDatasetPlacesLayerSelector = (state: AppState) =>
  state.controlState.layerVisibilities.datasetPlaces;
export const showUserPlacesLayerSelector = (state: AppState) =>
  state.controlState.layerVisibilities.userPlaces;
export const layerVisibilitiesSelector = (state: AppState) =>
  state.controlState.layerVisibilities;
export const infoCardElementStatesSelector = (state: AppState) =>
  state.controlState.infoCardElementStates;
export const mapProjectionSelector = (state: AppState) =>
  state.controlState.mapProjection;
export const timeChunkSizeSelector = (state: AppState) =>
  state.controlState.timeChunkSize;
export const userPlacesFormatNameSelector = (state: AppState) =>
  state.controlState.userPlacesFormatName;
export const userPlacesFormatOptionsCsvSelector = (state: AppState) =>
  state.controlState.userPlacesFormatOptions.csv;
export const userPlacesFormatOptionsGeoJsonSelector = (state: AppState) =>
  state.controlState.userPlacesFormatOptions.geojson;
export const userPlacesFormatOptionsWktSelector = (state: AppState) =>
  state.controlState.userPlacesFormatOptions.wkt;
export const userColorBarsSelector = (state: AppState) =>
  state.controlState.userColorBars;
export const userVariablesAllowedSelector = (_state: AppState) =>
  Config.instance.branding.allowUserVariables;

const variableLayerIdSelector = () => "variable";
const variable2LayerIdSelector = () => "variable2";
const datasetRgbLayerIdSelector = () => "rgb";
const datasetRgb2LayerIdSelector = () => "rgb2";

const variableZIndexSelector = () => 13;
const variable2ZIndexSelector = () => 12;
const datasetRgbZIndexSelector = () => 11;
const datasetRgb2ZIndexSelector = () => 10;

export const selectedDatasetSelector = createSelector(
  datasetsSelector,
  selectedDatasetIdSelector,
  findDataset,
);

export const selectedDataset2Selector = createSelector(
  datasetsSelector,
  selectedDataset2IdSelector,
  findDataset,
);

export const getDatasetTitle = (dataset: Dataset | null) =>
  dataset && (dataset.title || dataset.id) ? dataset.title : null;

export const selectedDatasetTitleSelector = createSelector(
  selectedDatasetSelector,
  getDatasetTitle,
);

export const selectedDataset2TitleSelector = createSelector(
  selectedDataset2Selector,
  getDatasetTitle,
);

export const selectedVariablesSelector = createSelector(
  selectedDatasetSelector,
  (dataset: Dataset | null): Variable[] => {
    return (dataset && dataset.variables) || [];
  },
);

export const selectedUserVariablesSelector = createSelector(
  selectedDatasetSelector,
  (dataset: Dataset | null): UserVariable[] => {
    return dataset ? getDatasetUserVariables(dataset)[1] : [];
  },
);

const _findDatasetVariable = (
  dataset: Dataset | null,
  varName: string | null,
): Variable | null => {
  if (!dataset || !varName) {
    return null;
  }
  return findDatasetVariable(dataset, varName);
};

export const selectedVariableSelector = createSelector(
  selectedDatasetSelector,
  selectedVariableNameSelector,
  _findDatasetVariable,
);

export const selectedVariable2Selector = createSelector(
  selectedDataset2Selector,
  selectedVariable2NameSelector,
  _findDatasetVariable,
);

const getVariableTitle = (variable: Variable | null): string | null => {
  return variable && (variable.title || variable.name);
};

export const selectedVariableTitleSelector = createSelector(
  selectedVariableSelector,
  getVariableTitle,
);

export const selectedVariable2TitleSelector = createSelector(
  selectedVariable2Selector,
  getVariableTitle,
);

const getVariableUnits = (variable: Variable | null): string => {
  return (variable && variable.units) || "-";
};

export const selectedVariableUnitsSelector = createSelector(
  selectedVariableSelector,
  getVariableUnits,
);

export const selectedVariable2UnitsSelector = createSelector(
  selectedVariable2Selector,
  getVariableUnits,
);

const getVariableColorBarName = (variable: Variable | null): string => {
  return (variable && variable.colorBarName) || "viridis";
};

export const selectedVariableColorBarNameSelector = createSelector(
  selectedVariableSelector,
  getVariableColorBarName,
);

export const selectedVariable2ColorBarNameSelector = createSelector(
  selectedVariable2Selector,
  getVariableColorBarName,
);

const getVariableColorBarMinMax = (
  variable: Variable | null,
): [number, number] => {
  return variable ? [variable.colorBarMin, variable.colorBarMax] : [0, 1];
};

export const selectedVariableColorBarMinMaxSelector = createSelector(
  selectedVariableSelector,
  getVariableColorBarMinMax,
);

export const selectedVariable2ColorBarMinMaxSelector = createSelector(
  selectedVariable2Selector,
  getVariableColorBarMinMax,
);

const getVariableColorBarNorm = (variable: Variable | null): ColorBarNorm => {
  return (variable && variable.colorBarNorm) === "log" ? "log" : "lin";
};

export const selectedVariableColorBarNormSelector = createSelector(
  selectedVariableSelector,
  getVariableColorBarNorm,
);

export const selectedVariable2ColorBarNormSelector = createSelector(
  selectedVariable2Selector,
  getVariableColorBarNorm,
);

export const colorBarsSelector = createSelector(
  userColorBarsSelector,
  predefinedColorBarsSelector,
  (userColorBars, predefinedColorBars): ColorBars => {
    const userGroup: ColorBarGroup = {
      title: USER_COLOR_BAR_GROUP_TITLE,
      description: "User-defined color bars.",
      names: userColorBars.map((colorBar) => colorBar.id),
    };
    const userImages: Record<string, string> = {};
    userColorBars.forEach(({ id, imageData }: UserColorBar) => {
      if (imageData) {
        userImages[id] = imageData;
      }
    });
    if (predefinedColorBars) {
      return {
        ...predefinedColorBars,
        groups: [userGroup, ...predefinedColorBars.groups],
        images: { ...predefinedColorBars.images, ...userImages },
      };
    } else {
      return { groups: [userGroup], images: userImages, customColorMaps: {} };
    }
  },
);

const getVariableColorBar = (
  colorBarName: string,
  colorBars: ColorBars,
  userColorBars: UserColorBar[],
): ColorBar => {
  const colorBar: ColorBar = parseColorBarName(colorBarName);
  const { baseName } = colorBar;
  const imageData = colorBars.images[baseName];
  const userColorBar = userColorBars.find(
    (userColorBar) => userColorBar.id === baseName,
  );
  if (userColorBar) {
    const type = userColorBar.type;
    const colorRecords = getUserColorBarHexRecords(userColorBar.code);
    return { ...colorBar, imageData, type, colorRecords };
  } else {
    const customColorMap = colorBars.customColorMaps[baseName];
    if (customColorMap) {
      const type = customColorMap.type;
      const colorRecords = customColorMap.colorRecords;
      return { ...colorBar, imageData, type, colorRecords };
    }
  }
  return { ...colorBar, imageData };
};

export const selectedVariableColorBarSelector = createSelector(
  selectedVariableColorBarNameSelector,
  colorBarsSelector,
  userColorBarsSelector,
  getVariableColorBar,
);

export const selectedVariable2ColorBarSelector = createSelector(
  selectedVariable2ColorBarNameSelector,
  colorBarsSelector,
  userColorBarsSelector,
  getVariableColorBar,
);

const getVariableUserColorBarJson = (
  colorBar: ColorBar,
  colorBarName: string,
  userColorBars: UserColorBar[],
): string | null => {
  const { baseName } = colorBar;
  const userColorBar = userColorBars.find(
    (userColorBar) => userColorBar.id === baseName,
  );
  if (userColorBar) {
    const colors = getUserColorBarHexRecords(userColorBar.code);
    if (colors) {
      return JSON.stringify({
        name: colorBarName,
        type: userColorBar.type,
        colors: colors.map((c) => [c.value, c.color]),
      });
    }
  }
  return null;
};

export const selectedVariableUserColorBarJsonSelector = createSelector(
  selectedVariableColorBarSelector,
  selectedVariableColorBarNameSelector,
  userColorBarsSelector,
  getVariableUserColorBarJson,
);

export const selectedVariable2UserColorBarJsonSelector = createSelector(
  selectedVariable2ColorBarSelector,
  selectedVariable2ColorBarNameSelector,
  userColorBarsSelector,
  getVariableUserColorBarJson,
);

const getVariableOpacity = (variable: Variable | null): number => {
  if (!variable || typeof variable.opacity != "number") {
    return 1;
  }
  return variable.opacity;
};

export const selectedVariableOpacitySelector = createSelector(
  selectedVariableSelector,
  getVariableOpacity,
);

export const selectedVariable2OpacitySelector = createSelector(
  selectedVariable2Selector,
  getVariableOpacity,
);

export const selectedDatasetTimeRangeSelector = createSelector(
  selectedDatasetSelector,
  (dataset: Dataset | null): TimeRange | null => {
    return dataset !== null ? getDatasetTimeRange(dataset) : null;
  },
);

export const selectedDatasetRgbSchemaSelector = createSelector(
  selectedDatasetSelector,
  (dataset: Dataset | null): RgbSchema | null => {
    return dataset !== null ? dataset.rgbSchema || null : null;
  },
);

export const selectedDataset2RgbSchemaSelector = createSelector(
  selectedDataset2Selector,
  (dataset: Dataset | null): RgbSchema | null => {
    return dataset !== null ? dataset.rgbSchema || null : null;
  },
);

export const selectedDatasetPlaceGroupsSelector = createSelector(
  selectedDatasetSelector,
  (dataset: Dataset | null): PlaceGroup[] => {
    return (dataset && dataset.placeGroups) || [];
  },
);

export const selectedDatasetAndUserPlaceGroupsSelector = createSelector(
  selectedDatasetPlaceGroupsSelector,
  userPlaceGroupsSelector,
  (placeGroups: PlaceGroup[], userPlaceGroups: PlaceGroup[]): PlaceGroup[] => {
    return placeGroups.concat(userPlaceGroups);
  },
);

function selectPlaceGroups(
  placeGroups: PlaceGroup[],
  placeGroupIds: string[] | null,
): PlaceGroup[] {
  const selectedPlaceGroups: PlaceGroup[] = [];
  if (placeGroupIds !== null && placeGroupIds.length > 0) {
    placeGroups.forEach((placeGroup) => {
      if (placeGroupIds.indexOf(placeGroup.id) > -1) {
        selectedPlaceGroups.push(placeGroup);
      }
    });
  }
  return selectedPlaceGroups;
}

export const userPlaceGroupsVisibilitySelector = createSelector(
  userPlaceGroupsSelector,
  selectedPlaceGroupIdsSelector,
  showUserPlacesLayerSelector,
  (
    userPlaceGroups: PlaceGroup[],
    selectedPlaceGroupIds: string[] | null,
  ): { [pgId: string]: boolean } => {
    const visibility: { [pgId: string]: boolean } = {};
    const idSet = new Set(selectedPlaceGroupIds || []);
    userPlaceGroups.forEach((placeGroup) => {
      visibility[placeGroup.id] = idSet.has(placeGroup.id);
    });
    return visibility;
  },
);

export const selectedDatasetSelectedPlaceGroupsSelector = createSelector(
  selectedDatasetPlaceGroupsSelector,
  selectedPlaceGroupIdsSelector,
  selectPlaceGroups,
);

export const selectedPlaceGroupsSelector = createSelector(
  selectedDatasetAndUserPlaceGroupsSelector,
  selectedPlaceGroupIdsSelector,
  selectPlaceGroups,
);

export const selectedPlaceGroupsTitleSelector = createSelector(
  selectedPlaceGroupsSelector,
  (placeGroups: PlaceGroup[]): string => {
    return placeGroups
      .map((placeGroup) => placeGroup.title || placeGroup.id)
      .join(", ");
  },
);

export const selectedPlaceGroupPlacesSelector = createSelector(
  selectedPlaceGroupsSelector,
  (placeGroups: PlaceGroup[]): Place[] => {
    const args = placeGroups.map(
      (placeGroup) =>
        (isValidPlaceGroup(placeGroup) ? placeGroup.features : []) as Place[],
    );
    return ([] as Array<Place>).concat(...args);
  },
);

export const selectedPlaceSelector = createSelector(
  selectedPlaceGroupPlacesSelector,
  selectedPlaceIdSelector,
  (places: Place[], placeId: string | null): Place | null => {
    return places.find((place) => place.id === placeId) || null;
  },
);

export const selectedPlaceGeometrySelector = createSelector(
  selectedPlaceSelector,
  (place: Place | null): Geometry | null => {
    return place?.geometry || null;
  },
);

export const selectedPlaceInfoSelector = createSelector(
  selectedPlaceGroupsSelector,
  selectedPlaceIdSelector,
  (placeGroups: PlaceGroup[], placeId: string | null): PlaceInfo | null => {
    if (placeGroups.length === 0 || placeId === null) {
      return null;
    }
    return findPlaceInfo(placeGroups, placeId);
  },
);

export const selectedVolumeIdSelector = createSelector(
  selectedDatasetIdSelector,
  selectedVariableNameSelector,
  selectedPlaceSelector,
  (
    datasetId: string | null,
    variableName: string | null,
    place: Place | null,
  ): string | null => {
    if (datasetId && variableName) {
      if (!place) {
        return `${datasetId}-${variableName}-all`;
      }
      if (
        place.geometry.type === "Polygon" ||
        place.geometry.type === "MultiPolygon"
      ) {
        return `${datasetId}-${variableName}-${place.id}`;
      }
    }
    return null;
  },
);

export const canAddTimeSeriesSelector = createSelector(
  timeSeriesGroupsSelector,
  selectedDatasetIdSelector,
  selectedVariableNameSelector,
  selectedPlaceIdSelector,
  (
    timeSeriesGroups: TimeSeriesGroup[],
    datasetId: string | null,
    variableName: string | null,
    placeId: string | null,
  ): boolean => {
    if (!datasetId || !variableName || !placeId) {
      return false;
    }
    for (const timeSeriesGroup of timeSeriesGroups) {
      for (const timeSeries of timeSeriesGroup.timeSeriesArray) {
        const source = timeSeries.source;
        if (
          source.datasetId === datasetId &&
          source.variableName === variableName &&
          source.placeId === placeId
        ) {
          return false;
        }
      }
    }
    return true;
  },
);

export const timeSeriesPlaceInfosSelector = createSelector(
  timeSeriesGroupsSelector,
  selectedDatasetAndUserPlaceGroupsSelector,
  (
    timeSeriesGroups: TimeSeriesGroup[],
    placeGroups: PlaceGroup[],
  ): Record<string, PlaceInfo> => {
    const placeInfos: Record<string, PlaceInfo> = {};
    forEachPlace(placeGroups, (placeGroup, place) => {
      for (const timeSeriesGroup of timeSeriesGroups) {
        if (
          timeSeriesGroup.timeSeriesArray.find(
            (ts) => ts.source.placeId === place.id,
          )
        ) {
          placeInfos[place.id] = getPlaceInfo(placeGroup, place);
          break;
        }
      }
    });
    return placeInfos;
  },
);

export const canAddStatisticsSelector = createSelector(
  selectedDatasetIdSelector,
  selectedVariableNameSelector,
  selectedPlaceIdSelector,
  (
    selectedDatasetId: string | null,
    selectedVariableName: string | null,
    selectedPlaceId: string | null,
  ): boolean => {
    return !!(selectedDatasetId && selectedVariableName && selectedPlaceId);
  },
);

export const resolvedStatisticsRecordsSelector = createSelector(
  statisticsRecordsSelector,
  selectedDatasetAndUserPlaceGroupsSelector,
  (
    statisticsRecords: StatisticsRecord[],
    placeGroups: PlaceGroup[],
  ): StatisticsRecord[] => {
    const resolvedStatisticsRecords: StatisticsRecord[] = [];
    statisticsRecords.forEach((statisticsRecord) => {
      const placeId = statisticsRecord.source.placeInfo.place.id;
      forEachPlace(placeGroups, (placeGroup, place) => {
        if (place.id === placeId) {
          const placeInfo = getPlaceInfo(placeGroup, place);
          resolvedStatisticsRecords.push({
            ...statisticsRecord,
            source: {
              ...statisticsRecord.source,
              placeInfo,
            },
          });
        }
      });
    });
    return resolvedStatisticsRecords;
  },
);

export const selectedPlaceGroupPlaceLabelsSelector = createSelector(
  selectedPlaceGroupsSelector,
  (placeGroups: PlaceGroup[]): string[] => {
    const placeLabels: string[] = [];
    forEachPlace(placeGroups, (placeGroup, place) => {
      placeLabels.push(getPlaceInfo(placeGroup, place).label);
    });
    return placeLabels;
  },
);

export const selectedTimeChunkSizeSelector = createSelector(
  selectedVariableSelector,
  timeChunkSizeSelector,
  (variable: Variable | null, minTimeChunkSize): number => {
    if (variable && variable.timeChunkSize) {
      const varTimeChunkSize = variable.timeChunkSize;
      return varTimeChunkSize * Math.ceil(minTimeChunkSize / varTimeChunkSize);
    }
    return minTimeChunkSize;
  },
);

const _getDatasetTimeDimension = (
  dataset: Dataset | null,
): TimeDimension | null => {
  return (dataset && getDatasetTimeDimension(dataset)) || null;
};

export const selectedDatasetTimeDimensionSelector = createSelector(
  selectedDatasetSelector,
  _getDatasetTimeDimension,
);

export const selectedDataset2TimeDimensionSelector = createSelector(
  selectedDataset2Selector,
  _getDatasetTimeDimension,
);

const _getDatasetAttributions = (dataset: Dataset | null): string[] | null => {
  return (dataset && dataset.attributions) || null;
};

export const selectedDatasetAttributionsSelector = createSelector(
  selectedDatasetSelector,
  _getDatasetAttributions,
);

export const selectedDataset2AttributionsSelector = createSelector(
  selectedDataset2Selector,
  _getDatasetAttributions,
);

const _getTimeCoordinates = (
  timeDimension: TimeDimension | null,
): Time[] | null => {
  if (timeDimension === null || timeDimension.coordinates.length === 0) {
    return null;
  }
  return timeDimension.coordinates;
};

export const selectedDatasetTimeCoordinatesSelector = createSelector(
  selectedDatasetTimeDimensionSelector,
  _getTimeCoordinates,
);

export const selectedDataset2TimeCoordinatesSelector = createSelector(
  selectedDatasetTimeDimensionSelector,
  _getTimeCoordinates,
);

const _getTimeIndex = (
  time: Time | null,
  timeCoordinates: Time[] | null,
): number => {
  if (time === null || timeCoordinates === null) {
    return -1;
  }
  return findIndexCloseTo(timeCoordinates, time);
};

export const selectedDatasetTimeIndexSelector = createSelector(
  selectedTimeSelector,
  selectedDatasetTimeCoordinatesSelector,
  _getTimeIndex,
);

export const selectedDataset2TimeIndexSelector = createSelector(
  selectedTimeSelector,
  selectedDataset2TimeCoordinatesSelector,
  _getTimeIndex,
);

const _getTimeLabel = (
  time: Time | null,
  timeIndex: number,
  timeDimension: TimeDimension | null,
): string | null => {
  if (time === null) {
    return null;
  }
  if (timeDimension && timeIndex > -1) {
    return timeDimension.labels[timeIndex];
  }
  return new Date(time).toISOString();
};

export const selectedDatasetTimeLabelSelector = createSelector(
  selectedTimeSelector,
  selectedDatasetTimeIndexSelector,
  selectedDatasetTimeDimensionSelector,
  _getTimeLabel,
);

export const selectedDataset2TimeLabelSelector = createSelector(
  selectedTimeSelector,
  selectedDataset2TimeIndexSelector,
  selectedDataset2TimeDimensionSelector,
  _getTimeLabel,
);

function getOlTileGrid(
  mapProjection: string,
  tileLevelMax: number | undefined,
) {
  if (mapProjection !== WEB_MERCATOR_CRS) {
    // If projection is not web mercator, it is geographical.
    // We need to define the geographical tile grid used by xcube:
    const numLevels = typeof tileLevelMax === "number" ? tileLevelMax + 1 : 20;
    return new OlTileGrid({
      tileSize: [256, 256],
      origin: [-180, 90],
      extent: [-180, -90, 180, 90],
      // Note, although correct, setting minZoom
      // will cause OpenLayers to crash:
      // minZoom: tileLevelMin,
      resolutions: Array.from(
        { length: numLevels },
        (_, i) => 180 / 256 / Math.pow(2, i),
      ),
    });
  }
}

function getOlXYZSource(
  url: string,
  mapProjection: string,
  tileGrid: undefined | OlTileGrid,
  attributions: string[] | null,
  timeAnimationActive: boolean,
  imageSmoothing: boolean,
  tileLoadFunction: LoadFunction | undefined,
  _tileLevelMin: number | undefined,
  tileLevelMax: number | undefined,
) {
  return new OlXYZSource({
    url,
    projection: mapProjection,
    tileGrid,
    attributions: attributions || undefined,
    transition: timeAnimationActive ? 0 : 250,
    imageSmoothing: imageSmoothing,
    tileLoadFunction,
    // TODO (forman): if we provide minZoom, we also need to set
    //   tileGrid.extent, otherwise way to many tiles are loaded from
    //   level at minZoom when zooming out!
    // minZoom: tileLevelMin,
    maxZoom: tileLevelMax,
  });
}

function __getLoadTileOnlyAfterMove(map: OlMap | undefined) {
  if (map) {
    // Define a special tileLoadFunction
    // that prevents tiles from being loaded while the user
    // pans or zooms, because this leads to high server loads.
    return (tile: OlTile, src: string) => {
      if (tile instanceof OlImageTile) {
        if (map.getView().getInteracting()) {
          map.once("moveend", function () {
            (tile.getImage() as HTMLImageElement).src = src;
          });
        } else {
          (tile.getImage() as HTMLImageElement).src = src;
        }
      }
    };
  }
}

const _getLoadTileOnlyAfterMove = memoize(__getLoadTileOnlyAfterMove, {
  serializer: (args) => {
    const map = args[0] as OlMap | undefined;
    if (map) {
      const target = map.getTarget();
      if (typeof target === "string") {
        return target;
      } else if (target) {
        return target.id || "map";
      }
      return "map";
    }
    return "";
  },
});

function getLoadTileOnlyAfterMove() {
  const map = MAP_OBJECTS["map"] as OlMap | undefined;
  return _getLoadTileOnlyAfterMove(map);
}

function getTileLayer(
  layerId: string,
  tileUrl: string,
  extent: [number, number, number, number],
  tileLevelMin: number | undefined,
  tileLevelMax: number | undefined,
  queryParams: Array<[string, string]>,
  opacity: number,
  timeLabel: string | null,
  timeAnimationActive: boolean,
  mapProjection: string,
  attributions: string[] | null,
  imageSmoothing: boolean,
  zIndex: number = 10,
) {
  if (timeLabel !== null) {
    queryParams = [...queryParams, ["time", timeLabel]];
  }
  const url = makeRequestUrl(tileUrl, queryParams);
  if (typeof tileLevelMax === "number") {
    // It is ok to have some extra zoom levels, so we can magnify pixels.
    // Using more, artifacts will become visible.
    tileLevelMax += 3;
  }
  const tileGrid = getOlTileGrid(mapProjection, tileLevelMax);
  const source = getOlXYZSource(
    url,
    mapProjection,
    tileGrid,
    attributions,
    timeAnimationActive,
    imageSmoothing,
    getLoadTileOnlyAfterMove(),
    tileLevelMin,
    tileLevelMax,
  );
  const transformedExtent =
    mapProjection === GEOGRAPHIC_CRS
      ? extent
      : olTransformExtent(extent, "EPSG:4326", mapProjection);
  return (
    <Tile
      id={layerId}
      source={source}
      extent={transformedExtent}
      zIndex={zIndex}
      opacity={opacity}
    />
  );
}

export const selectedDatasetBoundaryLayerSelector = createSelector(
  selectedDatasetSelector,
  mapProjectionSelector,
  showDatasetBoundaryLayerSelector,
  (
    dataset: Dataset | null,
    mapProjection: string,
    showDatasetBoundary: boolean,
  ): MapElement | null => {
    if (!dataset || !showDatasetBoundary) {
      return null;
    }

    let geometry = dataset.geometry;
    if (!geometry) {
      if (dataset.bbox) {
        const [x1, y1, x2, y2] = dataset.bbox;
        geometry = {
          type: "Polygon",
          coordinates: [
            [
              [x1, y1],
              [x2, y1],
              [x2, y2],
              [x1, y2],
              [x1, y1],
            ],
          ],
        };
      } else {
        console.warn(`Dataset ${dataset.id} has no bbox!`);
        return null;
      }
    }

    const source = new OlVectorSource({
      features: new OlGeoJSONFormat({
        dataProjection: GEOGRAPHIC_CRS,
        featureProjection: mapProjection,
      }).readFeatures({ type: "Feature", geometry }),
    });

    const style = new OlStyle({
      stroke: new OlStrokeStyle({
        color: "orange",
        width: 3,
        lineDash: [2, 4],
      }),
    });

    return (
      <Vector
        id={`${dataset.id}.bbox`}
        source={source}
        style={style}
        zIndex={16}
        opacity={0.5}
      />
    );
  },
);

export const selectedServerSelector = createSelector(
  userServersSelector,
  selectedServerIdSelector,
  (userServers: ApiServerConfig[], serverId: string): ApiServerConfig => {
    if (userServers.length === 0) {
      throw new Error(`internal error: no servers configured`);
    }
    const server = userServers.find((server) => server.id === serverId);
    if (!server) {
      throw new Error(`internal error: server with ID "${serverId}" not found`);
    }
    return server;
  },
);

const getVariableTileLayer = (
  server: ApiServerConfig,
  dataset: Dataset | null,
  timeLabel: string | null,
  attributions: string[] | null,
  variable: Variable | null,
  colorBarName: string,
  colorBarMinMax: [number, number],
  colorBarNorm: ColorBarNorm,
  colorBarJson: string | null,
  opacity: number,
  visibility: boolean,
  layerId: string,
  zIndex: number,
  timeAnimationActive: boolean,
  mapProjection: string,
  imageSmoothing: boolean,
): MapElement => {
  if (!dataset || !variable || !visibility) {
    return null;
  }
  const queryParams: Array<[string, string]> = [
    ["crs", mapProjection],
    ["vmin", `${colorBarMinMax[0]}`],
    ["vmax", `${colorBarMinMax[1]}`],
    ["cmap", colorBarJson ? colorBarJson : colorBarName],
    // ['retina', '1'],
  ];
  if (colorBarNorm === "log") {
    queryParams.push(["norm", colorBarNorm]);
  }
  return getTileLayer(
    layerId,
    getTileUrl(server.url, dataset, variable),
    dataset.bbox,
    variable.tileLevelMin,
    variable.tileLevelMax,
    queryParams,
    opacity,
    timeLabel,
    timeAnimationActive,
    mapProjection,
    attributions,
    imageSmoothing,
    zIndex,
  );
};

export const selectedDatasetVariableLayerSelector = createSelector(
  selectedServerSelector,
  selectedDatasetSelector,
  selectedDatasetTimeLabelSelector,
  selectedDatasetAttributionsSelector,
  selectedVariableSelector,
  selectedVariableColorBarNameSelector,
  selectedVariableColorBarMinMaxSelector,
  selectedVariableColorBarNormSelector,
  selectedVariableUserColorBarJsonSelector,
  selectedVariableOpacitySelector,
  selectedVariableVisibilitySelector,
  variableLayerIdSelector,
  variableZIndexSelector,
  timeAnimationActiveSelector,
  mapProjectionSelector,
  imageSmoothingSelector,
  getVariableTileLayer,
);

export const selectedDatasetVariable2LayerSelector = createSelector(
  selectedServerSelector,
  selectedDataset2Selector,
  selectedDataset2TimeLabelSelector,
  selectedDataset2AttributionsSelector,
  selectedVariable2Selector,
  selectedVariable2ColorBarNameSelector,
  selectedVariable2ColorBarMinMaxSelector,
  selectedVariable2ColorBarNormSelector,
  selectedVariable2UserColorBarJsonSelector,
  selectedVariable2OpacitySelector,
  selectedVariable2VisibilitySelector,
  variable2LayerIdSelector,
  variable2ZIndexSelector,
  timeAnimationActiveSelector,
  mapProjectionSelector,
  imageSmoothingSelector,
  getVariableTileLayer,
);

const getDatasetRgbTileLayer = (
  server: ApiServerConfig,
  dataset: Dataset | null,
  rgbSchema: RgbSchema | null,
  visibility: boolean,
  layerId: string,
  zIndex: number,
  timeLabel: string | null,
  timeAnimationActive: boolean,
  mapProjection: string,
  attributions: string[] | null,
  imageSmoothing: boolean,
): MapElement => {
  if (!dataset || !rgbSchema || !visibility) {
    return null;
  }
  const queryParams: Array<[string, string]> = [["crs", mapProjection]];
  return getTileLayer(
    layerId,
    getTileUrl(server.url, dataset, "rgb"),
    dataset.bbox,
    rgbSchema.tileLevelMin,
    rgbSchema.tileLevelMax,
    queryParams,
    1.0,
    timeLabel,
    timeAnimationActive,
    mapProjection,
    attributions,
    imageSmoothing,
    zIndex,
  );
};

export const selectedDatasetRgbLayerSelector = createSelector(
  selectedServerSelector,
  selectedDatasetSelector,
  selectedDatasetRgbSchemaSelector,
  datasetRgbVisibilitySelector,
  datasetRgbLayerIdSelector,
  datasetRgbZIndexSelector,
  selectedDatasetTimeLabelSelector,
  timeAnimationActiveSelector,
  mapProjectionSelector,
  selectedDatasetAttributionsSelector,
  imageSmoothingSelector,
  getDatasetRgbTileLayer,
);

export const selectedDataset2RgbLayerSelector = createSelector(
  selectedServerSelector,
  selectedDataset2Selector,
  selectedDataset2RgbSchemaSelector,
  datasetRgb2VisibilitySelector,
  datasetRgb2LayerIdSelector,
  datasetRgb2ZIndexSelector,
  selectedDatasetTimeLabelSelector,
  timeAnimationActiveSelector,
  mapProjectionSelector,
  selectedDatasetAttributionsSelector,
  imageSmoothingSelector,
  getDatasetRgbTileLayer,
);

export function getTileUrl(
  serverUrl: string,
  dataset: Dataset,
  variable: Variable | string,
): string {
  return (
    `${serverUrl}/tiles/${encodeDatasetId(dataset)}/${encodeVariableName(variable)}/` +
    "{z}/{y}/{x}"
  );
}

export function getDefaultFillOpacity() {
  return getUserPlaceFillOpacity();
}

export function getDefaultStyleImage() {
  return new OlCircle({
    fill: getDefaultFillStyle(),
    stroke: getDefaultStrokeStyle(),
    radius: 6,
  });
}

export function getDefaultStrokeStyle() {
  return new OlStrokeStyle({
    color: [200, 0, 0, 0.75],
    width: 1.25,
  });
}

export function getDefaultFillStyle() {
  return new OlFillStyle({
    color: [255, 0, 0, getDefaultFillOpacity()],
  });
}

export function getDefaultPlaceGroupStyle() {
  return new OlStyle({
    image: getDefaultStyleImage(),
    stroke: getDefaultStrokeStyle(),
    fill: getDefaultFillStyle(),
  });
}

export const selectedDatasetPlaceGroupLayersSelector = createSelector(
  selectedDatasetSelectedPlaceGroupsSelector,
  mapProjectionSelector,
  showDatasetPlacesLayerSelector,
  (
    placeGroups: PlaceGroup[],
    mapProjection: string,
    showDatasetPlaces: boolean,
  ): MapElement => {
    if (!showDatasetPlaces || placeGroups.length === 0) {
      return null;
    }
    const layers: MapElement[] = [];
    placeGroups.forEach((placeGroup, index) => {
      if (isValidPlaceGroup(placeGroup)) {
        layers.push(
          <Vector
            key={index}
            id={`placeGroup.${placeGroup.id}`}
            style={getDefaultPlaceGroupStyle()}
            zIndex={100}
            source={
              new OlVectorSource({
                features: new OlGeoJSONFormat({
                  dataProjection: GEOGRAPHIC_CRS,
                  featureProjection: mapProjection,
                }).readFeatures(placeGroup),
              })
            }
          />,
        );
      }
    });
    return <Layers>{layers}</Layers>;
  },
);

export const visibleInfoCardElementsSelector = createSelector(
  infoCardElementStatesSelector,
  (infoCardElementStates): string[] => {
    const visibleInfoCardElements: string[] = [];
    Object.getOwnPropertyNames(infoCardElementStates).forEach((e) => {
      if (infoCardElementStates[e].visible) {
        visibleInfoCardElements.push(e);
      }
    });
    return visibleInfoCardElements;
  },
);

export const infoCardElementViewModesSelector = createSelector(
  infoCardElementStatesSelector,
  (infoCardElementStates) => {
    const infoCardElementCodeModes: { [elementType: string]: ViewMode } = {};
    Object.getOwnPropertyNames(infoCardElementStates).forEach((e) => {
      infoCardElementCodeModes[e] = infoCardElementStates[e].viewMode || "text";
    });
    return infoCardElementCodeModes;
  },
);

export const activityMessagesSelector = createSelector(
  activitiesSelector,
  (activities: { [id: string]: string }): string[] => {
    return Object.keys(activities).map((k) => activities[k]);
  },
);

export const configBaseMapsSelector = (_state: AppState) =>
  getConfigLayers("baseMaps");

export const configOverlaysSelector = (_state: AppState) =>
  getConfigLayers("overlays");

export const baseMapsSelector = createSelector(
  userBaseMapsSelector,
  configBaseMapsSelector,
  (userBaseMaps, configBaseMaps): LayerDefinition[] => {
    return [
      ...userBaseMaps,
      ...(configBaseMaps.length ? configBaseMaps : defaultBaseMapLayers),
    ];
  },
);

export const overlaysSelector = createSelector(
  userOverlaysSelector,
  configOverlaysSelector,
  (userOverlays, configOverlays): LayerDefinition[] => {
    return [
      ...userOverlays,
      ...(configOverlays.length ? configOverlays : defaultOverlayLayers),
    ];
  },
);

const getLayersFromLayerDefinition = (
  layerDefs: LayerDefinition[],
  layerVisibilities: LayerVisibilities,
  zIndex: number,
): JSX.Element[] => {
  return layerDefs
    .filter((layerDef) => layerVisibilities[layerDef.id])
    .map((layerDef) => getLayerFromLayerDefinition(layerDef, zIndex));
};

const getLayerFromLayerDefinition = (
  layerDef: LayerDefinition,
  zIndex: number,
): JSX.Element => {
  let attributions = layerDef.attribution;
  // noinspection HttpUrlsUsage
  if (
    attributions &&
    (attributions.startsWith("http://") || attributions.startsWith("https://"))
  ) {
    attributions = `&copy; <a href=&quot;${layerDef.attribution}&quot;>${layerDef.title}</a>`;
  }
  let source: OlTileWMSSource | OlXYZSource;
  if (layerDef.wms) {
    const { layerName, styleName } = layerDef.wms;
    source = new OlTileWMSSource({
      url: layerDef.url,
      params: {
        ...(styleName ? { STYLES: styleName } : {}),
        LAYERS: layerName,
      },
      attributions,
      attributionsCollapsible: true,
    });
  } else {
    source = new OlXYZSource({
      url: layerDef.url,
      attributions,
      attributionsCollapsible: true,
    });
  }
  return <Tile id={layerDef.id} source={source} zIndex={zIndex} />;
};

export const baseMapLayersSelector = createSelector(
  baseMapsSelector,
  layerVisibilitiesSelector,
  () => 0,
  getLayersFromLayerDefinition,
);

export const overlayLayersSelector = createSelector(
  overlaysSelector,
  layerVisibilitiesSelector,
  () => 20,
  getLayersFromLayerDefinition,
);

export const layerStatesSelector = createSelector(
  selectedDatasetSelector,
  selectedDataset2Selector,
  selectedVariableSelector,
  selectedVariable2Selector,
  baseMapsSelector,
  overlaysSelector,
  layerVisibilitiesSelector,
  (
    dataset,
    dataset2,
    variable,
    variable2,
    baseMapLayers,
    overlayLayers,
    visibilities,
  ) => {
    const layerStates: LayerStates = {
      datasetRgb: {
        id: "datasetRgb",
        title: "Dataset RGB",
        subTitle: dataset ? dataset.title : undefined,
        visible: visibilities.datasetRgb,
        disabled: !dataset,
      },
      datasetRgb2: {
        id: "datasetRgb2",
        title: "Dataset RGB",
        subTitle: dataset2 ? dataset2.title : undefined,
        visible: visibilities.datasetRgb2,
        disabled: !dataset2,
        pinned: true,
      },
      datasetVariable: {
        id: "datasetVariable",
        title: "Dataset Variable",
        subTitle:
          dataset && variable
            ? `${dataset.title} / ${variable.title || variable.name}`
            : undefined,
        visible: visibilities.datasetVariable,
        disabled: !(dataset && variable),
      },
      datasetVariable2: {
        id: "datasetVariable2",
        title: "Dataset Variable",
        subTitle:
          dataset2 && variable2
            ? `${dataset2.title} / ${variable2.title || variable2.name}`
            : undefined,
        visible: visibilities.datasetVariable2,
        disabled: !(dataset2 && variable2),
        pinned: true,
      },
      datasetBoundary: {
        id: "datasetBoundary",
        title: "Dataset Boundary",
        subTitle: dataset ? dataset.title : undefined,
        visible: visibilities.datasetBoundary,
        disabled: !dataset,
      },
      datasetPlaces: {
        id: "datasetPlaces",
        title: "Dataset Places",
        visible: visibilities.datasetPlaces,
      },
      userPlaces: {
        id: "userPlaces",
        title: "User Places",
        visible: visibilities.userPlaces,
      },
    };
    baseMapLayers.forEach((layerDef: LayerDefinition) => {
      layerStates[layerDef.id] = newLayerStateFromLayerDef(
        layerDef,
        "baseMaps",
        visibilities[layerDef.id],
      );
    });
    overlayLayers.forEach((layerDef: LayerDefinition) => {
      layerStates[layerDef.id] = newLayerStateFromLayerDef(
        layerDef,
        "overlays",
        visibilities[layerDef.id],
      );
    });
    return layerStates;
  },
);

function newLayerStateFromLayerDef(
  layer: LayerDefinition,
  type: LayerGroup,
  visible: boolean | undefined,
): LayerState {
  return {
    id: layer.id,
    title: layer.title,
    exclusive: layer.exclusive,
    type,
    visible,
  };
}

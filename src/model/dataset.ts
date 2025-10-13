/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import OlTileLayer from "ol/layer/Tile";
import { default as OlMap } from "ol/Map";
import { default as OlView } from "ol/View";

import { findMapLayer } from "@/components/ol/util";
import { GEOGRAPHIC_CRS, WEB_MERCATOR_CRS } from "@/model/proj";
import { type UserVariable } from "@/model/userVariable";
import { type JsonPrimitive } from "@/util/json";
import { assertArrayNotEmpty, assertDefinedAndNotNull } from "@/util/assert";
import { isString } from "@/util/types";
import { type PlaceGroup } from "./place";
import { type TimeRange } from "./timeSeries";
import { type Variable } from "./variable";

export interface Dimension {
  name: string;
  size: number;
  dtype: string;
  coordinates: number[];
}

// export interface LonDimension extends Dimension {
//     name: 'lon';
// }
//
// export interface LatDimension extends Dimension {
//     name: 'lat';
// }

export interface TimeDimension extends Dimension {
  name: "time";
  labels: string[];
}

export type NormRange = [number, number];

export interface RgbSchema {
  // The following are new since xcube 0.11
  tileLevelMin?: number;
  tileLevelMax?: number;
  varNames: [string, string, string];
  normRanges: [NormRange, NormRange, NormRange];
}

export interface Dataset {
  id: string;
  title: string;
  description?: string;
  groupTitle?: string;
  groupId?: string;
  groupOrder?: number;
  groupDescription?: string;
  sortValue?: number;
  tags?: string[];
  bbox: [number, number, number, number];
  geometry: {
    type: "Polygon";
    coordinates: Array<Array<[number, number]>>;
  };
  spatialRef: string;
  dimensions: Dimension[];
  variables: Variable[];
  placeGroups?: PlaceGroup[];
  attributions?: string[];
  attrs: Record<string, JsonPrimitive | JsonPrimitive[]>;
  rgbSchema?: RgbSchema;
  resolutions: number[];
  spatialUnits: string;
}

export function findDataset(
  datasets: Dataset[],
  selectedDatasetId: string | null,
): Dataset | null {
  return (
    (selectedDatasetId &&
      datasets.find((dataset) => dataset.id === selectedDatasetId)) ||
    null
  );
}

export function findDatasetVariable(
  dataset: Dataset,
  variableName: string | null,
): Variable | null {
  return (
    (variableName &&
      dataset.variables.find((variable) => variable.name === variableName)) ||
    null
  );
}

export function getDatasetUserVariablesIndex(dataset: Dataset): number {
  // vIndex is the first index that is a user variable.
  return dataset.variables.findIndex((v) => isString(v.expression));
}

export function getDatasetUserVariables(
  dataset: Dataset,
): [Variable[], UserVariable[]] {
  // vIndex is the first index that is a user variable.
  const vIndex = getDatasetUserVariablesIndex(dataset);
  // All variables starting at vIndex are user variables.
  if (vIndex >= 0) {
    return [
      dataset.variables.slice(0, vIndex),
      dataset.variables.slice(vIndex) as UserVariable[],
    ];
  } else {
    return [dataset.variables, []];
  }
}

export function getDatasetTimeDimension(
  dataset: Dataset,
): TimeDimension | null {
  assertDefinedAndNotNull(dataset, "dataset");
  assertArrayNotEmpty(dataset.dimensions, "dataset.dimensions");
  const dimension = dataset.dimensions.find(
    (dimension) => dimension.name === "time",
  );
  if (!dimension) {
    return null;
  }
  assertArrayNotEmpty(dimension.coordinates, "timeDimension.coordinates");
  assertArrayNotEmpty(
    (dimension as TimeDimension).labels,
    "timeDimension.labels",
  );
  return dimension as TimeDimension;
}

export function getDatasetTimeRange(dataset: Dataset): TimeRange | null {
  const timeDimension = getDatasetTimeDimension(dataset);
  if (!timeDimension) {
    return null;
  }
  const coordinates = timeDimension.coordinates;
  return [coordinates[0], coordinates[coordinates.length - 1]];
}

// this returns the level of the current OLTileLayer
export const getDatasetZLevel = (
  view: OlView,
  map: OlMap | undefined,
): number | undefined => {
  //const map = MAP_OBJECTS["map"] as OlMap | undefined;
  if (map) {
    //const view = map.getView();
    const resolution = view.getResolution();
    const layer = findMapLayer(map, "variable");
    if (layer instanceof OlTileLayer) {
      const source = layer.getSource();
      const tileGrid = source.getTileGrid();
      return tileGrid.getZForResolution(resolution);
    } else {
      console.log("cannot return zlevel");
      return undefined;
    }
  }
};

export function isMeterUnit(unitName: string): boolean {
  const normalized = unitName.toLowerCase();
  return ["m", "metre", "metres", "meter", "meters"].includes(normalized);
}

export function isDegreeUnit(unitName: string): boolean {
  const normalized = unitName.toLowerCase();
  return [
    "°",
    "deg",
    "degree",
    "degrees",
    "decimal_degree",
    "decimal_degrees",
  ].includes(normalized);
}

//Get the factor to convert from one unit into another
//with units given by *unitNameFrom* and *unitNameTo*.
export function getUnitFactor(
  unitNameFrom: string,
  unitNameTo: string,
): number {
  const EARTH_EQUATORIAL_RADIUS_WGS84 = 6378137.0;
  const EARTH_CIRCUMFERENCE_WGS84 = 2 * Math.PI * EARTH_EQUATORIAL_RADIUS_WGS84;

  const fromMeter = unitNameFrom === WEB_MERCATOR_CRS;
  const fromDegree = unitNameFrom === GEOGRAPHIC_CRS;

  if (!fromMeter && !fromDegree) {
    throw new Error(
      `Unsupported unit '${unitNameFrom}'. Unit must be either meters or degrees.`,
    );
  }

  const toMeter = isMeterUnit(unitNameTo);
  const toDegree = isDegreeUnit(unitNameTo);

  if (!toMeter && !toDegree) {
    throw new Error(
      `Unsupported unit '${unitNameTo}'. Unit must be either meters or degrees.`,
    );
  }

  if (fromMeter && toDegree) {
    return 360 / EARTH_CIRCUMFERENCE_WGS84;
  }

  if (fromDegree && toMeter) {
    return EARTH_CIRCUMFERENCE_WGS84 / 360;
  }

  return 1.0; // same units or unsupported conversion
}

/*
  This function computes the level of the actual dataset (min. value: 0), by
  computing the pixel size of the map tiles in dataset units and comparing
  this value against the resolution levels provided by the dataset.
  It then returns the most suitable dataset level, based on:
  -> https://github.com/xcube-dev/xcube/blob/main/xcube/core/tilingscheme.py#L281
*/
export function getDatasetLevel(
  datasetResolutions: number[],
  datasetSpatialUnit: string | null,
  mapProjection: string,
  datasetZLevel: number | undefined,
): number | undefined {
  //const datasetZLevel = getDatasetZLevel();
  if (
    datasetResolutions &&
    datasetSpatialUnit &&
    mapProjection &&
    datasetZLevel
  ) {
    // Resolution at level 0
    let levelZeroResolution: number;
    if (mapProjection === WEB_MERCATOR_CRS) {
      levelZeroResolution = 40075017 / 256;
    } else {
      levelZeroResolution = 180 / 256;
    }

    const fFromMap = getUnitFactor(mapProjection, datasetSpatialUnit);
    // Tile pixel size in dataset units for map tile at level 0
    const dsPixSizeL0 = fFromMap * levelZeroResolution;
    // Tile pixel size in dataset units for map tile at level
    const dsPixSize = dsPixSizeL0 / (1 << datasetZLevel);

    const numDsLevels = datasetResolutions.length;

    const dsPixSizeMin = datasetResolutions[0];
    if (dsPixSize <= dsPixSizeMin) {
      return 0;
    }

    const dsPixSizeMax = datasetResolutions[datasetResolutions.length - 1];
    if (dsPixSize >= dsPixSizeMax) {
      return numDsLevels - 1;
    }

    for (let dsLevel = 0; dsLevel < numDsLevels - 1; dsLevel++) {
      const dsPixSize1 = datasetResolutions[dsLevel];
      const dsPixSize2 = datasetResolutions[dsLevel + 1];

      if (dsPixSize1 <= dsPixSize && dsPixSize <= dsPixSize2) {
        const r = (dsPixSize - dsPixSize1) / (dsPixSize2 - dsPixSize1);
        if (r < 0.5) {
          return dsLevel;
        } else {
          return dsLevel + 1;
        }
      }
    }
  } else {
    return undefined;
  }
}

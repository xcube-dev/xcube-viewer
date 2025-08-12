/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import OlTileLayer from "ol/layer/Tile";
import { default as OlMap } from "ol/Map";

import { findMapLayer } from "@/components/ol/util";
import { GEOGRAPHIC_CRS, WEB_MERCATOR_CRS } from "@/model/proj";
import { type UserVariable } from "@/model/userVariable";
import { MAP_OBJECTS } from "@/states/controlState";
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
//FROM: Map unit TO: Server unit
export function getUnitFactor(
  unitNameFrom: string,
  unitNameTo: string,
): number {
  const EARTH_EQUATORIAL_RADIUS_WGS84 = 6378137.0;
  const EARTH_CIRCUMFERENCE_WGS84 = 2 * Math.PI * EARTH_EQUATORIAL_RADIUS_WGS84;

  /*  const fromMeter = isMeterUnit(unitNameFrom);
  const fromDegree = isDegreeUnit(unitNameFrom);

  if (!fromMeter && !fromDegree) {
    throw new Error(
      `Unsupported unit '${unitNameFrom}'. Unit must be either meters or degrees.`,
    );
  }

  const toMeter = unitNameTo === WEB_MERCATOR_CRS;
  const toDegree = unitNameTo === GEOGRAPHIC_CRS;*/

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

export function getDatasetLevel(
  resolutions: number[],
  spatialUnit: string | null,
  mapProjection: string,
): number | undefined {
  const map = MAP_OBJECTS["map"] as OlMap | undefined;
  if (map && resolutions && mapProjection && spatialUnit) {
    const view = map.getView();
    const resolution = view.getResolution();

    const layer = findMapLayer(map, "variable");

    if (layer instanceof OlTileLayer) {
      const source = layer.getSource();
      const tileGrid = source.getTileGrid();
      const level = tileGrid.getZForResolution(resolution);

      //const unitFfromMap = getUnitFactor(spatialUnit, mapProjection);
      const unitFfromMap = getUnitFactor(mapProjection, spatialUnit);

      // Resolution at level 0 (adjust this based on your tile scheme, e.g. WebMercator)
      let levelZeroResolution: number;
      if (mapProjection === WEB_MERCATOR_CRS) {
        levelZeroResolution = 40075017 / 256;
      } else {
        levelZeroResolution = 180 / 256;
      }

      const dsPixSizeL0 = unitFfromMap * levelZeroResolution;

      // Tile pixel size in dataset units for the given zoom level
      const dsPixSize = dsPixSizeL0 / (1 << level); // Equivalent to 2^level

      // Number of available resolution levels in dataset
      const numDsLevels = resolutions.length;

      const dsPixSizeMin = resolutions[0];
      if (dsPixSize <= dsPixSizeMin) {
        return 0;
      }

      const dsPixSizeMax = resolutions[resolutions.length - 1];
      if (dsPixSize >= dsPixSizeMax) {
        return numDsLevels - 1;
      }

      for (let dsLevel = 0; dsLevel < numDsLevels - 1; dsLevel++) {
        const dsPixSize1 = resolutions[dsLevel];
        const dsPixSize2 = resolutions[dsLevel + 1];

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
}

/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { assertArrayNotEmpty, assertDefinedAndNotNull } from "@/util/assert";
import { isString } from "@/util/types";
import { type UserVariable } from "@/model/userVariable";
import { type JsonPrimitive } from "@/util/json";
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

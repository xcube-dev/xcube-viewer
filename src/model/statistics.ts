/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { Dataset } from "./dataset";
import { Variable } from "./variable";
import { PlaceInfo } from "./place";

export interface StatisticsSource {
  dataset: Dataset;
  variable: Variable;
  time: string | null;
  placeInfo: PlaceInfo;
  depth: number | string | null;
}

export interface Histogram {
  values: number[];
  edges: number[];
}

export interface NullStatistics {
  count: 0;
}

export interface AreaStatistics {
  count: number;
  minimum: number;
  maximum: number;
  mean: number;
  deviation: number;
  histogram: Histogram;
}

export interface PointStatistics extends Omit<AreaStatistics, "histogram"> {
  count: 1;
}

export type Statistics = NullStatistics | PointStatistics | AreaStatistics;

export interface StatisticsRecord {
  source: StatisticsSource;
  statistics: Statistics;
}

export function isNullStatistics(s: Statistics): s is NullStatistics {
  return s.count === 0;
}

export function isPointStatistics(s: Statistics): s is PointStatistics {
  return s.count === 1;
}

export function isAreaStatistics(s: Statistics): s is AreaStatistics {
  return s.count > 1;
}

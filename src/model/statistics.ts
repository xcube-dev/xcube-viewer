/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Place } from "./place";
import { Variable } from "./variable";
import { Dataset } from "./dataset";

export interface StatisticsSource {
  dataset: Dataset;
  variable: Variable;
  time: string;
  place: Place;
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

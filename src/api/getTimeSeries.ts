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

import * as geojson from "geojson";

import { Variable } from "../model/variable";
import { TimeSeries, TimeSeriesPoint } from "../model/timeSeries";
import {
  callJsonApi,
  makeRequestInit,
  makeRequestUrl,
  QueryComponent,
} from "./callApi";
import { Dataset } from "../model/dataset";

type RawTimeSeriesPoint = Omit<TimeSeriesPoint, 'time'> & { time: string };

interface TimeSeriesResult {
  result?: RawTimeSeriesPoint[];
}

export function getTimeSeriesForGeometry(
  apiServerUrl: string,
  dataset: Dataset,
  variable: Variable,
  placeId: string,
  geometry: geojson.Geometry,
  startDate: string | null,
  endDate: string | null,
  useMedian: boolean,
  inclStDev: boolean,
  accessToken: string | null,
): Promise<TimeSeries | null> {
  let valueDataKey: keyof TimeSeriesPoint;
  let errorDataKey: keyof TimeSeriesPoint | null = null;
  const query: QueryComponent[] = [];
  if (useMedian) {
    query.push(["aggMethods", "median"]);
    valueDataKey = "median";
  } else if (inclStDev) {
    query.push(["aggMethods", "mean,std"]);
    valueDataKey = "mean";
    errorDataKey = "std";
  } else {
    query.push(["aggMethods", "mean"]);
    valueDataKey = "mean";
  }
  if (startDate) {
    query.push(["startDate", startDate]);
  }
  if (endDate) {
    query.push(["endDate", endDate]);
  }
  const dsId = encodeURIComponent(dataset.id);
  const variableName = encodeURIComponent(variable.name);
  const url = makeRequestUrl(
    `${apiServerUrl}/timeseries/${dsId}/${variableName}`,
    query,
  );

  const init = {
    ...makeRequestInit(accessToken),
    method: "post",
    body: JSON.stringify(geometry),
  };

  const convertTimeSeriesResult = (
    result_: TimeSeriesResult,
  ): TimeSeries | null => {
    const result = result_["result"];
    if (!result || result.length === 0) {
      return null;
    }
    const data = result.map((item): TimeSeriesPoint => {
      return { ...item, time: new Date(item.time).getTime() };
    });
    const source = {
      datasetId: dataset.id,
      datasetTitle: dataset.title,
      variableName: variable.name,
      variableUnits: variable.units || undefined,
      placeId,
      geometry,
      valueDataKey,
      errorDataKey,
    };
    return { source, data};
  };

  return callJsonApi<TimeSeriesResult>(url, init).then(convertTimeSeriesResult);
}

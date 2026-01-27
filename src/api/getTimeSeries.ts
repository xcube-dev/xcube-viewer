/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as geojson from "geojson";

import { Dataset } from "@/model/dataset";
import { TimeSeries, TimeSeriesPoint } from "@/model/timeSeries";
import { Variable } from "@/model/variable";
import {
  callJsonApi,
  makeRequestInit,
  makeRequestUrl,
  QueryComponent,
} from "./callApi";
import { encodeDatasetId, encodeVariableName } from "@/model/encode";

type RawTimeSeriesPoint = Omit<TimeSeriesPoint, "time"> & { time: string };

interface RawTimeSeries {
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
  includeStdev: boolean,
  accessToken: string | null,
): Promise<TimeSeries | null> {
  let valueDataKey: keyof TimeSeriesPoint;
  let errorDataKey: keyof TimeSeriesPoint | null = null;
  const query: QueryComponent[] = [];
  if (useMedian) {
    query.push(["aggMethods", "median"]);
    valueDataKey = "median";
  } else if (includeStdev) {
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
  const url = makeRequestUrl(
    `${apiServerUrl}/timeseries/${encodeDatasetId(dataset)}/${encodeVariableName(variable)}`,
    query,
  );

  const init = {
    ...makeRequestInit(accessToken),
    method: "post",
    body: JSON.stringify(geometry),
  };

  const convertTimeSeriesResult = (
    result_: RawTimeSeries,
  ): TimeSeries | null => {
    const rawPoints = result_.result;
    if (!rawPoints || rawPoints.length === 0) {
      return null;
    }
    const points = rawPoints.map((rawPoint): TimeSeriesPoint => {
      return { ...rawPoint, time: new Date(rawPoint.time).getTime() };
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
    return { source, data: points };
  };

  return callJsonApi(url, init, convertTimeSeriesResult);
}

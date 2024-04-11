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

import { parseISO } from "date-fns";
import { utcTimeToIsoDateTimeString } from "../util/time";
import { findPlaceInPlaceGroups, Place, PlaceGroup } from "./place";

/**
 * Time is an integer value that is the number of milliseconds since 1 January 1970 UTC (Unix Time Stamp).
 */
export type Time = number;
export type TimeRange = [Time, Time];

export const UNIT = {
  seconds: 1000,
  minutes: 1000 * 60,
  hours: 1000 * 60 * 60,
  days: 1000 * 60 * 60 * 24,
  weeks: 1000 * 60 * 60 * 24 * 7,
  years: 1000 * 60 * 60 * 24 * 365,
};

export interface TimeSeriesSource {
  datasetId: string;
  datasetTitle: string;
  variableName: string;
  variableUnits?: string;
  placeId: string | null;
  geometry: geojson.Geometry | null;
  valueDataKey: keyof TimeSeriesPoint;
  errorDataKey: keyof TimeSeriesPoint | null;
}

export interface TimeSeriesPoint {
  time: Time;
  countTot: number;
  count?: number;
  mean?: number | null;
  median?: number | null;
  std?: number | null;
  min?: number | null;
  max?: number | null;
  standard_error?: number | null;
}

export interface TimeSeries {
  source: TimeSeriesSource;
  data: TimeSeriesPoint[];
  dataProgress?: number;
}

export interface TimeSeriesGroup {
  id: string;
  variableUnits?: string;
  timeSeriesArray: TimeSeries[];
}

export function equalTimeRanges(t1: TimeRange | null, t2: TimeRange | null) {
  if (t1 === t2) {
    return true;
  } else if (t1 !== null && t2 != null) {
    return t1[0] === t2[0] && t1[1] === t2[1];
  }
  return false;
}

type CellValue = number | string | null | undefined;
type DataRow = CellValue[];
type RowData = {
  placeId: string | null;
  time: string;
  [colName: string]: CellValue;
};
type TimePlaceRows = { [timePlaceId: string]: RowData };

export interface TimeSeriesTable {
  colNames: string[];
  dataRows: DataRow[];
  referencedPlaces: { [placeId: string]: Place };
}

export function timeSeriesGroupsToTable(
  timeSeriesGroups: TimeSeriesGroup[],
  placeGroups: PlaceGroup[],
): TimeSeriesTable {
  const dataColNames = new Set<string>();
  const placeIds = new Set<string>();
  const timePlaceRows: TimePlaceRows = {};
  for (const timeSeriesGroup of timeSeriesGroups) {
    for (const timeSeries of timeSeriesGroup.timeSeriesArray) {
      const { placeId, datasetId, variableName, valueDataKey, errorDataKey } =
        timeSeries.source;
      if (placeId !== null) {
        placeIds.add(placeId);
      }
      const valueColName = `${datasetId}.${variableName}.${valueDataKey}`;
      dataColNames.add(valueColName);
      let errorColName: string | null = null;
      if (errorDataKey) {
        errorColName = `${datasetId}.${variableName}.${errorDataKey}`;
        dataColNames.add(errorColName);
      }
      timeSeries.data.forEach((point) => {
        const time = utcTimeToIsoDateTimeString(point.time);
        // if placeId is null, then data is from import CSV / GeoJSON
        // and datasetId is the name of the place group.
        const timePlaceId = `${placeId !== null ? placeId : datasetId}-${time}`;
        const timePlaceRow = timePlaceRows[timePlaceId];
        if (!timePlaceRow) {
          timePlaceRows[timePlaceId] = {
            placeId,
            time,
            [valueColName]: point[valueDataKey],
          };
        } else {
          timePlaceRows[timePlaceId] = {
            ...timePlaceRow,
            [valueColName]: point[valueDataKey],
          };
        }
        if (errorColName !== null) {
          timePlaceRows[timePlaceId][errorColName!] = point[errorDataKey!];
        }
      });
    }
  }

  const colNames: string[] = ["placeId", "time"].concat(
    Array.from(dataColNames).sort(),
  );
  const dataRows: DataRow[] = [];

  Object.keys(timePlaceRows).forEach((timePlaceId) => {
    const rowData = timePlaceRows[timePlaceId];
    const dataRow = new Array<CellValue>(colNames.length);
    colNames.forEach((colName, i) => {
      dataRow[i] = rowData[colName];
    });
    dataRows.push(dataRow);
  });

  dataRows.sort((row1, row2) => {
    const time1: string = row1[1] as string;
    const time2: string = row2[1] as string;
    const timeDelta = time1.localeCompare(time2);
    if (timeDelta !== 0) {
      return timeDelta;
    }
    const placeId1: string = row1[0] as string;
    const placeId2: string = row2[0] as string;
    return placeId1.localeCompare(placeId2);
  });

  const referencedPlaces: { [placeId: string]: Place } = {};
  placeIds.forEach((placeId) => {
    referencedPlaces[placeId] = findPlaceInPlaceGroups(placeGroups, placeId)!;
  });

  return { colNames, dataRows, referencedPlaces };
}

export function timeSeriesGroupsToGeoJSON(
  timeSeriesGroups: TimeSeriesGroup[],
): geojson.FeatureCollection<geojson.Geometry | null> {
  const features: geojson.Feature<geojson.Geometry | null>[] = [];
  for (const timeSeriesGroup of timeSeriesGroups) {
    for (const timeSeries of timeSeriesGroup.timeSeriesArray) {
      features.push(timeSeriesToGeoJSON(timeSeries));
    }
  }
  return { type: "FeatureCollection", features };
}

export function timeSeriesToGeoJSON(
  timeSeries: TimeSeries,
): geojson.Feature<geojson.Geometry | null> {
  const timeSeriesSource = timeSeries.source;
  let id = `${timeSeriesSource.datasetId}-${timeSeriesSource.variableName}`;
  if (timeSeriesSource.placeId !== null) {
    id += `-${timeSeriesSource.placeId}`;
  }
  return {
    id,
    type: "Feature",
    geometry: timeSeriesSource.geometry,
    properties: {
      datasetId: timeSeriesSource.datasetId,
      datasetTitle: timeSeriesSource.datasetTitle,
      variableName: timeSeriesSource.variableName,
      variableUnits: timeSeriesSource.variableUnits,
      placeId: timeSeriesSource.placeId,
      valueDataKey: timeSeriesSource.valueDataKey,
      errorDataKey: timeSeriesSource.errorDataKey,
      data: timeSeries.data.map((p) => {
        return {
          ...p,
          time: utcTimeToIsoDateTimeString(p.time),
        };
      }),
    },
  };
}

export interface PlaceGroupTimeSeries {
  placeGroup: PlaceGroup;
  timeSeries: { [propertyName: string]: TimeSeries };
}

export function placeGroupToTimeSeries(
  placeGroup: PlaceGroup,
): PlaceGroupTimeSeries | null {
  let timeSeriesMapping: { [propertyName: string]: TimeSeries } | null = null;
  const places = placeGroup.features || [];
  for (const place of places) {
    if (!place.properties) {
      continue;
    }
    const time = place.properties["time"];
    if (typeof time !== "string") {
      continue;
    }
    const timeValue = parseISO(time);
    const utcTime = timeValue.getTime();
    if (Number.isNaN(utcTime)) {
      continue;
    }
    for (const propertyName of Object.getOwnPropertyNames(place.properties)) {
      let propertyValue = place.properties[propertyName];
      const propertyType = typeof propertyValue;
      if (propertyType === "boolean") {
        propertyValue = propertyValue ? 1 : 0;
      } else if (propertyType !== "number") {
        propertyValue = Number.NaN;
      }
      if (Number.isNaN(propertyValue)) {
        continue;
      }
      const point: TimeSeriesPoint = {
        time: utcTime,
        countTot: 1,
        mean: propertyValue,
      };
      if (timeSeriesMapping === null) {
        timeSeriesMapping = {};
      }
      const timeSeries = timeSeriesMapping[propertyName];
      if (!timeSeries) {
        timeSeriesMapping[propertyName] = {
          source: {
            // important: this is the imported CSV / GeoJSON place group
            datasetId: placeGroup.id,
            datasetTitle: placeGroup.title,
            variableName: propertyName,
            placeId: null, // we don't have an individual place for the entire time-series
            geometry: null, // could be computed later from data points (as GeometryCollection)
            valueDataKey: "mean",
            errorDataKey: null,
          },
          data: [point],
          dataProgress: 1.0,
        };
      } else {
        timeSeries.data.push(point);
      }
    }
  }
  if (timeSeriesMapping === null) {
    return null;
  }
  return { placeGroup, timeSeries: timeSeriesMapping };
}

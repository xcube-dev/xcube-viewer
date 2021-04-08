/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2021 by the xcube development team and contributors.
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

import * as geojson from 'geojson';

import { utcTimeToIsoDateTimeString } from '../util/time';


/**
 * Time is an integer value that is the number of milliseconds since 1 January 1970 UTC (Unix Time Stamp).
 */
export type Time = number;
export type TimeDelta = number;
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
    variableName: string;
    variableUnits?: string;
    placeId: string;
    geometry: geojson.Geometry;
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


export function timeSeriesGroupsToGeoJSON(timeSeriesGroups: TimeSeriesGroup[]): geojson.FeatureCollection {
    const features: geojson.Feature[] = [];
    for (let timeSeriesGroup of timeSeriesGroups) {
        for (let timeSeries of timeSeriesGroup.timeSeriesArray) {
            features.push(timeSeriesToGeoJSON(timeSeries));
        }
    }
    return {type: "FeatureCollection", features};
}


export function timeSeriesToGeoJSON(timeSeries: TimeSeries): geojson.Feature {
    return {
        type: "Feature",
        id: `${timeSeries.source.datasetId}-${timeSeries.source.variableName}-${timeSeries.source.placeId}`,
        geometry: timeSeries.source.geometry,
        properties: {
            datasetId: timeSeries.source.datasetId,
            variableName: timeSeries.source.variableName,
            variableUnits: timeSeries.source.variableUnits,
            placeId: timeSeries.source.placeId,
            valueDataKey: timeSeries.source.valueDataKey,
            errorDataKey: timeSeries.source.errorDataKey,
            data: timeSeries.data.map(p => {
                return {
                    ...p,
                    time: utcTimeToIsoDateTimeString(p.time)
                };
            })
        }
    };
}

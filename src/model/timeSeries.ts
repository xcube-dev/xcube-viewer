import * as geojson from 'geojson';

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
    featureId: string;
    geometry: geojson.Geometry;
}

export interface TimeSeriesPoint {
    time: Time;
    totalCount: number;
    validCount: number;
    average: number | null;
    uncertainty?: number | null;
}

export interface TimeSeries {
    source: TimeSeriesSource;
    data: TimeSeriesPoint[];
    dataProgress?: number;
    color: string;
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


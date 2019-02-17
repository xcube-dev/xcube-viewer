/**
 * Time is an integer value that is the number of milliseconds since 1 January 1970 UTC (Unix Time Stamp).
 */
export type Time = number;
export type TimeRange = [Time, Time];

export interface TimeSeriesSource {
    datasetId: string;
    variableName: string;
    variableUnits?: string;
    coordinate?: [number, number];
}

export interface TimeSeriesPoint {
    time: Time;
    totalCount: number;
    validCount: number;
    average: number;
}

export interface TimeSeries {
    source: TimeSeriesSource;
    data: TimeSeriesPoint[];
}

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


export function equalTimes(t1: Time | null, t2: Time | null) {
    if (t1 === t2) {
        return true;
    } else if (t1 !== null && t2 != null) {
        return t1[0] === t2[0] && t1[1] === t2[1];
    }
    return false;
}

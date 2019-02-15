export interface TimeSeriesSource {
    datasetId: string;
    variableName: string;
    variableUnits?: string;
    coordinate?: [number, number];
}

export interface TimeSeriesPoint {
    time: string;
    totalCount: number;
    validCount: number;
    average: number;
}

export interface TimeSeries {
    source: TimeSeriesSource;
    data: TimeSeriesPoint[];
}

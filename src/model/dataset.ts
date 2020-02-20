import { TileSourceOptions } from './tile';
import { Variable } from './variable';
import { PlaceGroup } from './place';
import { TimeRange } from './timeSeries';
import {
    assertArrayNotEmpty,
    assertDefinedAndNotNull,
    assertTrue,
} from '../util/assert';


export interface Dimension {
    name: string;
    size: number;
    dtype: string;
    coordinates: number[];
}

// export interface LonDimension extends Dimension {
//     name: 'lon';
// }
//
// export interface LatDimension extends Dimension {
//     name: 'lat';
// }

export interface TimeDimension extends Dimension {
    name: 'time';
    labels: string[];
}

export type NormRange = [number, number];

export interface RgbSchema {
    tileSourceOptions: TileSourceOptions;
    varNames: [string, string, string];
    normRanges: [NormRange, NormRange, NormRange];
}

export interface Dataset {
    id: string;
    title: string;
    bbox: [number, number, number, number];
    dimensions: Dimension[];
    variables: Variable[];
    placeGroups?: PlaceGroup[];
    attributions?: string[];
    attrs: { [name: string]: any };
    rgbSchema?: RgbSchema;
}


export function findDataset(datasets: Dataset[], selectedDatasetId: string | null): Dataset | null {
    return (selectedDatasetId && datasets.find(dataset => dataset.id === selectedDatasetId)) || null;
}

export function findDatasetVariable(dataset: Dataset, variableName: string | null): Variable | null {
    return (variableName && dataset.variables.find(variable => variable.name === variableName)) || null;
}

export function getDatasetTimeDimension(dataset: Dataset): TimeDimension {
    assertDefinedAndNotNull(dataset, 'dataset');
    assertArrayNotEmpty(dataset.dimensions, 'dataset.dimensions');
    const dimension: any = dataset.dimensions.find(dimension => dimension.name === 'time');
    assertTrue(dimension, '\'time\' not found in dataset dimensions');
    assertArrayNotEmpty(dimension!.coordinates, 'timeDimension.coordinates');
    assertArrayNotEmpty(dimension!.labels, 'timeDimension.labels');
    return dimension as TimeDimension;
}

export function getDatasetTimeRange(dataset: Dataset): TimeRange {
    const timeDimension = getDatasetTimeDimension(dataset);
    const coordinates = timeDimension.coordinates;
    return [coordinates[0], coordinates[coordinates.length - 1]];
}

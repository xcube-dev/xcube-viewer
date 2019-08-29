import { Variable } from './variable';
import { findPlaceInPlaceGroup, findPlaceInPlaceGroups, Place, PlaceGroup } from './place';
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

export interface Dataset {
    id: string;
    title: string;
    bbox: [number, number, number, number];
    dimensions: Dimension[];
    variables: Variable[];
    placeGroups?: PlaceGroup[];
}


export function findDataset(datasets: Dataset[], selectedDatasetId: string | null): Dataset | null {
    return (selectedDatasetId && datasets.find(dataset => dataset.id === selectedDatasetId)) || null;
}

export function findDatasetVariable(dataset: Dataset, variableName: string | null): Variable | null {
    return (variableName && dataset.variables.find(variable => variable.name === variableName)) || null;
}

export function findDatasetPlace(dataset: Dataset, placeId: string | null): Place | null {
    return (placeId && dataset.placeGroups && findPlaceInPlaceGroups(dataset.placeGroups, placeId)) || null;
}

export function findDatasetOrUserPlace(datasets: Dataset[], userPlaceGroup: PlaceGroup, placeId: string): Place | null {
    const place = findPlaceInPlaceGroup(userPlaceGroup, placeId);
    if (place) {
        return place;
    }
    for (let dataset of datasets) {
        const place = findDatasetPlace(dataset, placeId);
        if (place !== null) {
            return place;
        }
    }
    return null;
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

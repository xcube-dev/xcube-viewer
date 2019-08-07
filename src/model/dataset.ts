import { Variable } from './variable';
import { isValidPlaceGroup, Place, PlaceGroup } from './place';
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

export function findPlaceInPlaceGroups(placeGroups: PlaceGroup[], placeId: string | null): Place | null {
    if (placeId) {
        for (let placeGroup of placeGroups) {
            const place = findPlaceInPlaceGroup(placeGroup, placeId);
            if (place !== null) {
                return place;
            }
        }
    }
    return null;
}

export function findPlaceInPlaceGroup(placeGroup: PlaceGroup, placeId: string | null): Place | null {
    if (!placeId || !isValidPlaceGroup(placeGroup)) {
        return null;
    }
    const place = placeGroup.features.find(place => place.id === placeId);
    if (!!place) {
        return place as Place;
    }
    let subPlaceGroups = placeGroup.placeGroups;
    if (subPlaceGroups) {
        for (let parentPlaceId in subPlaceGroups) {
            const place = findPlaceInPlaceGroup(subPlaceGroups[parentPlaceId], placeId);
            if (!!place) {
                return place;
            }
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

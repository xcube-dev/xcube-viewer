import { Variable } from './variable';
import { Place, PlaceGroup } from './place';


export interface Dataset {
    id: string;
    title: string;
    bbox: [number, number, number, number];
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
    if (!placeId) {
        return null;
    }
    const place = placeGroup.features.find(place => place.id === placeId);
    if (place !== null) {
        return place as Place;
    }
    let subPlaceGroups = placeGroup.placeGroups;
    if (subPlaceGroups) {
        for (let parentPlaceId in subPlaceGroups) {
            const place = findPlaceInPlaceGroup(subPlaceGroups[parentPlaceId], placeId);
            if (place !== null) {
                return place;
            }
        }
    }
    return null;
}


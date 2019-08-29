import * as  GeoJSON from 'geojson';


/**
 * A place is a GeoJSON feature with a mandatory string ID.
 */
export interface Place extends GeoJSON.Feature {
    id: string;
}

/**
 * A group of places represented by GeoJSON features.
 */
export interface PlaceGroup extends GeoJSON.FeatureCollection {
    id: string;
    title: string;
    propertyMapping?: { [role: string]: string };
    placeGroups?: { [placeId: string]: PlaceGroup }; // placeGroups in placeGroups are not yet supported
}

/**
 * Precomputed stuff.
 */
export interface PlaceInfo {
    placeGroup: PlaceGroup;
    place: Place;
    placeLabel: string;
}


export const DEFAULT_LABEL_PROPERTY_NAMES = ['label', 'LABEL', 'Label',
                                             'title', 'TITLE', 'Title',
                                             'name', 'NAME', 'Name',
                                             'id', 'ID', 'Id'];

export function forEachPlace(placeGroups: PlaceGroup[], callback: (placeGroup: PlaceGroup, place: Place, placeLabel: string) => void) {
    placeGroups.forEach(placeGroup => {
        if (isValidPlaceGroup(placeGroup)) {
            const labelPropNames = getPlaceGroupLabelPropertyNames(placeGroup);
            placeGroup.features.forEach((place: Place) => {
                const placeLabel = getPlaceLabel(place, labelPropNames);
                callback(placeGroup, place, placeLabel);
            });
        }
    });
}

function getPlaceGroupLabelPropertyNames(placeGroup: PlaceGroup): string[] {
    const propertyMapping = placeGroup.propertyMapping;
    if (propertyMapping && propertyMapping['label']) {
        return [propertyMapping['label'], ...DEFAULT_LABEL_PROPERTY_NAMES];
    }
    return DEFAULT_LABEL_PROPERTY_NAMES;
}

function getPlaceLabel(place: Place, labelPropertyNames: string []) {
    if (place.properties) {
        let label;
        for (let propName of labelPropertyNames) {
            label = place.properties[propName];
            if (label) {
                return label;
            }
        }
    }
    return '' + place.id;
}

export function isValidPlaceGroup(placeGroup: PlaceGroup): boolean {
    return !!placeGroup.features;
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


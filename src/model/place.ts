import * as  GeoJSON from 'geojson';
import { getUserPlaceColorName } from '../config';


/**
 * A place is a GeoJSON feature with a mandatory string ID.
 */
export interface Place extends GeoJSON.Feature {
    id: string;

    [name: string]: any;
}

/**
 * A group of places represented by GeoJSON features.
 */
export interface PlaceGroup extends GeoJSON.FeatureCollection {
    id: string;
    title: string;
    features: Place[];
    propertyMapping?: { [role: string]: string };
    placeGroups?: { [placeId: string]: PlaceGroup }; // placeGroups in placeGroups are not yet supported
}

/**
 * Precomputed stuff.
 */
export interface PlaceInfo {
    placeGroup: PlaceGroup;
    place: Place;
    label: string;
    color: string;
}


export const DEFAULT_LABEL_PROPERTY_NAMES = ['label', 'LABEL', 'Label',
                                             'title', 'TITLE', 'Title',
                                             'name', 'NAME', 'Name',
                                             'id', 'ID', 'Id'];

export function forEachPlace(placeGroups: PlaceGroup[], callback: (placeGroup: PlaceGroup, place: Place, label: string, color: string) => void) {
    placeGroups.forEach(placeGroup => {
        if (isValidPlaceGroup(placeGroup)) {
            const labelPropNames = getPlaceGroupLabelPropertyNames(placeGroup);
            placeGroup.features.forEach((place: Place) => {
                callback(placeGroup, place, getPlaceLabel(place, labelPropNames), getPlaceColor(place));
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

function getPlaceColor(place: Place) {
    return (place.properties && place.properties['color']) || getUserPlaceColorName(getPlaceHash(place))
}

function getPlaceHash(place: Place): number {
    const id = place.id + '';
    let hash = 0, i, c;
    if (id.length === 0) {
        return hash;
    }
    for (i = 0; i < id.length; i++) {
        c = id.charCodeAt(i);
        hash = ((hash << 5) - hash) + c;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
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


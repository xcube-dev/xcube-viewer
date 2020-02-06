import * as  GeoJSON from 'geojson';
import { defaultMemoize } from 'reselect';
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
 * Computed place information.
 */
export interface PlaceInfo {
    placeGroup: PlaceGroup;
    place: Place;
    label: string;
    color: string;
    image: string | null;
    description: string | null;
}

export const DEFAULT_LABEL_PROPERTY_NAMES = mkCases(['label', 'title', 'name', 'id']);
export const DEFAULT_DESCRIPTION_PROPERTY_NAMES = mkCases(['description', 'desc', 'abstract', 'comment']);
export const DEFAULT_COLOR_PROPERTY_NAMES = mkCases(['color']);
export const DEFAULT_IMAGE_PROPERTY_NAMES = mkCases(['image', 'img', 'picture', 'pic']);

export function computePlaceInfo(placeGroup: PlaceGroup, place: Place): PlaceInfo {
    const infoObj = {};
    updatePlaceInfo(infoObj, placeGroup, place, 'label', place.id + '',
                    DEFAULT_LABEL_PROPERTY_NAMES);
    updatePlaceInfo(infoObj, placeGroup, place, 'color', getUserPlaceColorName(getPlaceHash(place)),
                    DEFAULT_COLOR_PROPERTY_NAMES);
    updatePlaceInfo(infoObj, placeGroup, place, 'image', null,
                    DEFAULT_IMAGE_PROPERTY_NAMES);
    updatePlaceInfo(infoObj, placeGroup, place, 'description', null,
                    DEFAULT_DESCRIPTION_PROPERTY_NAMES);
    return {placeGroup, place, ...infoObj} as PlaceInfo;
}

export const getPlaceInfo = defaultMemoize(computePlaceInfo);


function updatePlaceInfo(infoObj: { [name: string]: any },
                         placeGroup: PlaceGroup,
                         place: Place,
                         propertyName: string,
                         defaultValue: any,
                         defaultPropertyNames: string[]) {
    let propertyValue;
    const mappedPropertyValue = placeGroup.propertyMapping && placeGroup.propertyMapping[propertyName];
    if (mappedPropertyValue) {
        if (mappedPropertyValue.includes('${')) {
            infoObj[propertyName] = getInterpolatedPropertyValue(place, mappedPropertyValue);
            return;
        }
        if (defaultPropertyNames.length > 0 && defaultPropertyNames[0] !== mappedPropertyValue) {
            defaultPropertyNames = [mappedPropertyValue, ...defaultPropertyNames];
        }
    }
    if (place.properties) {
        propertyValue = getPropertyValue(place.properties, defaultPropertyNames);
    }
    if (propertyValue === undefined) {
        propertyValue = getPropertyValue(place, defaultPropertyNames);
    }
    infoObj[propertyName] = propertyValue || defaultValue;
}

function getInterpolatedPropertyValue(place: Place, propertyValue: string) {
    let interpolatedValue = propertyValue;
    if (place.properties) {
        for (let name of Object.getOwnPropertyNames(place.properties)) {
            if (!interpolatedValue.includes('${')) {
                break;
            }
            const placeHolder = '${' + name + '}';
            if (interpolatedValue.includes(placeHolder)) {
                interpolatedValue = interpolatedValue.replace(placeHolder, `${place.properties[name]}`);
            }
        }
    }
    return interpolatedValue;
}

function getPropertyValue(container: any, propertyNames: string[]) {
    let value;
    for (let propertyName of propertyNames) {
        if (propertyName in container) {
            return container[propertyName];
        }
    }
    // noinspection JSUnusedAssignment
    return value;
}

function mkCases(names: string[]): string[] {
    let nameCases: string[] = [];
    for (let name of names) {
        nameCases = nameCases.concat(name.toLowerCase(),
                                     name.toUpperCase(),
            name[0].toUpperCase() + name.substr(1).toLowerCase())
    }
    return nameCases;
}

export function forEachPlace(placeGroups: PlaceGroup[], callback: (placeGroup: PlaceGroup, place: Place) => void) {
    placeGroups.forEach(placeGroup => {
        if (isValidPlaceGroup(placeGroup)) {
            placeGroup.features.forEach((place: Place) => {
                callback(placeGroup, place);
            });
        }
    });
}

export function findPlaceInfo(placeGroups: PlaceGroup[], predicate: (placeGroup: PlaceGroup, place: Place) => boolean): PlaceInfo | null {
    for (let placeGroup of placeGroups) {
        if (isValidPlaceGroup(placeGroup)) {
            const place = placeGroup.features.find((place: Place) => predicate(placeGroup, place));
            if (place) {
                return getPlaceInfo(placeGroup, place);
            }
        }
    }
    return null;
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


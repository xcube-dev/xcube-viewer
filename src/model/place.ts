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
    placeGroups?: { [placeId: string]: PlaceGroup };
}


export const LABEL_PROPERTY_NAMES = ['label', 'title', 'name', 'id'];


export function getPlaceLabel(place: Place, labelPropNames: string []) {
    if (place.properties) {
        let label;
        for (let propName of labelPropNames) {
            label = place.properties[propName];
            if (label) {
                return label;
            }
        }
    }
    return '' + place.id;
}
import * as  GeoJSON from "geojson";

export interface LocationGroup {
    title: string;
    locations: Location[];
}

export interface Location {
    feature: GeoJSON.Feature;
    group?: LocationGroup;
}

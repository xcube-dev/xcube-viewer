import * as  GeoJSON from "geojson";

export interface Location {
    feature: GeoJSON.Feature;
    subLocations?: Location[];
}
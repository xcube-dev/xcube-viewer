import * as  GeoJSON from "geojson";

export interface Dataset {
    id: string;
    title: string;
    description: string;
    bounds: GeoJSON.BBox;
}
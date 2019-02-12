import * as  GeoJSON from "geojson";
import { LocationGroup } from "./location";


export interface Variable {
    name: string;
    units: string;
    title: string;
    vmin: number;
    vmax: number;
}

export interface Dataset {
    id: string;
    title: string;
    bounds: GeoJSON.BBox;
    variables: Variable[];
    locationGroup?: LocationGroup;
}

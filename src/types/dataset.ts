import * as  GeoJSON from "geojson";
import { LocationGroup } from "./location";


export interface Variable {
    name: string;
    title: string;
    units?: string;
    vmin?: number;
    vmax?: number;
}

export interface Dataset {
    id: string;
    title: string;
    bounds: GeoJSON.BBox;
    variables: Variable[];
    locationGroup?: LocationGroup;
}

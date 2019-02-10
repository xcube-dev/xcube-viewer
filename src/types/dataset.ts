import * as  GeoJSON from "geojson";
import { Location } from "./location";


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
    description: string;
    bounds: GeoJSON.BBox;
    locations?: Location[];
    variables: Variable[];
}

import * as  GeoJSON from "geojson";
import { LocationGroup } from "./location";


export interface Dataset {
    id: string;
    title: string;
    bounds: GeoJSON.BBox;
    variables: Variable[];
    locationGroup?: LocationGroup;
}

export interface Variable {
    id: string;
    name: string;
    dims: string[],
    shape: number[],
    dtype: string;
    units: string;
    title: string;
    tileSourceOptions: any;
}


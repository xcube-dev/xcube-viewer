import * as  GeoJSON from "geojson";
import { PlaceGroup } from './place';


export interface Dataset {
    id: string;
    title: string;
    bbox: GeoJSON.BBox;
    variables: Variable[];
    placeGroups?: PlaceGroup[];
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


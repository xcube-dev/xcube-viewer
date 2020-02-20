import { TileSourceOptions } from './tile';

export interface Variable {
    id: string;
    name: string;
    dims: string[],
    shape: number[],
    dtype: string;
    units: string;
    title: string;
    tileSourceOptions: TileSourceOptions;
    colorBarName: string;
    colorBarMin: number;
    colorBarMax: number;
    htmlRepr?: string;
    attrs: { [name: string]: any };
}

export interface Variable {
    id: string;
    name: string;
    dims: string[],
    shape: number[],
    dtype: string;
    units: string;
    title: string;
    tileSourceOptions: any;
    colorBarName: string;
    colorBarMin: number;
    colorBarMax: number;
    htmlRepr?: string;
    attrs: { [name: string]: any };
}

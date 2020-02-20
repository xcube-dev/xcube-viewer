export interface TileGrid {
    extent: [number, number, number, number];
    origin: [number, number];
    tileSize: [number, number];
    resolutions: number[];
}

export interface TileSourceOptions {
    url: string;
    projection: string;
    minZoom: number;
    maxZoom: number;
    tileGrid: TileGrid;
}
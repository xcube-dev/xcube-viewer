// Thanks to alexurquhart, maps.json is content of https://github.com/alexurquhart/free-tiles/blob/master/tiles.json
// Check http://alexurquhart.github.io/free-tiles/
import _maps from '../resources/maps.json';

export const maps = _maps as  MapGroup[];

export interface MapGroup {
    name: string;
    link: string;
    datasets: MapSource[];
    overlays: MapSource[];
}

export interface MapSource {
    name: string;
    endpoint: string;
}

/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

// Thanks to alexurquhart, maps.json is content of
// https://github.com/alexurquhart/free-tiles/blob/master/tiles.json.
// Check http://alexurquhart.github.io/free-tiles/.
import _maps from "@/resources/maps.json";

export const maps = _maps as MapGroup[];

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

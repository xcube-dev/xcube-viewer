/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { default as OlMap } from "ol/Map";
import { default as OlLayer } from "ol/layer/Layer";
import OlTileLayer from "ol/layer/Tile";

export function findMapLayer(map: OlMap, layerId: string): OlLayer | null {
  const layerGroup = map.getLayers();
  for (let i = 0; i < layerGroup.getLength(); i++) {
    const layer = layerGroup.item(i);
    if (layer.get("id") === layerId) {
      return layer as OlLayer;
    }
  }
  return null;
}

export function findDatasetMapLayer(map: OlMap): OlLayer | null {
  // Find the first active dataset tile layer named "variable", "rgb",
  // "variable2", "rgb2" (in that order)
  const layer = (["variable", "rgb", "variable2", "rgb2"] as const)
    .map((name) => findMapLayer(map, name))
    .find((layer) => layer instanceof OlTileLayer);

  return layer as OlLayer;
}

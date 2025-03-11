/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { default as OlMap } from "ol/Map";
import { default as OlLayer } from "ol/layer/Layer";

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

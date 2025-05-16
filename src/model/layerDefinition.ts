/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { maps } from "@/util/maps";
import { Config } from "@/config";

export type LayerGroup = "overlays" | "baseMaps";

/** Definition of system or custom layer. */
export interface LayerDefinition {
  /** Layer identifier. */
  id: string;
  /** Layer display name. */
  title: string;
  /** Layer URL, should have tile server (XYZ) or WMS style. */
  url: string;
  /** For WMS layers only: layer and style names . */
  wms?: { layerName: string; styleName?: string };
  /** Layer attribution text or URL. */
  attribution?: string;
  /** Whether the layer can only be exclusively selected in its group. */
  exclusive?: boolean;
}

function getDefaultLayers(layerGroup: LayerGroup): LayerDefinition[] {
  const layerDefs: LayerDefinition[] = [];
  maps.forEach((mapGroup) => {
    mapGroup[layerGroup].forEach((mapSource) => {
      layerDefs.push({
        id: `${layerGroup}.${mapGroup.name}.${mapSource.name}`,
        attribution: mapGroup.link,
        title: `${mapGroup.name} - ${mapSource.name}`,
        url: mapSource.endpoint,
        exclusive: layerGroup === "baseMaps",
      });
    });
  });
  return layerDefs;
}

export function getConfigLayers(layerGroup: LayerGroup): LayerDefinition[] {
  const layers = Config.instance.layers;
  return ((layers && layers[layerGroup]) || []).map(({ id, ...rest }) => ({
    ...rest,
    id: `${layerGroup}.${id}`,
  }));
}

export const defaultOverlayLayers: LayerDefinition[] =
  getDefaultLayers("overlays");
export const defaultBaseMapLayers: LayerDefinition[] =
  getDefaultLayers("baseMaps");

export const defaultBaseMapId = defaultBaseMapLayers[0].id;

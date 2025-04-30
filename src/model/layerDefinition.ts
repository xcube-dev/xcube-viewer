/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { maps } from "@/util/maps";
import { Config } from "@/config";

export const USER_GROUP_NAME = "User";

export type LayerType = "overlays" | "baseMaps";

export interface LayerDefinition {
  id: string;
  title: string;
  group: string;
  url: string;
  attribution?: string;
  wms?: { layerName: string; styleName?: string };
}

export function getLayerTitle(layerDef: LayerDefinition | null): string {
  return layerDef ? `${layerDef.group}: ${layerDef.title}` : "-";
}

export function findLayer(
  layerDefs: LayerDefinition[],
  layerId: string | null,
): LayerDefinition | null {
  return layerDefs.find((layer) => layer.id === layerId) || null;
}

function getDefaultLayers(layerType: LayerType) {
  const layerDefs: LayerDefinition[] = [];
  maps.forEach((mapGroup) => {
    mapGroup[layerType].forEach((mapSource) => {
      layerDefs.push({
        id: `${mapGroup.name}-${mapSource.name}`,
        group: mapGroup.name,
        attribution: mapGroup.link,
        title: mapSource.name,
        url: mapSource.endpoint,
      });
    });
  });
  return layerDefs;
}

export function getConfigLayers(key: LayerType) {
  const layers = Config.instance.layers;
  return ((layers && layers[key]) || []).map(({ id, ...rest }) => ({
    ...rest,
    id: `${key}-${id}`,
    group: key,
  }));
}

export const defaultOverlayLayers: LayerDefinition[] =
  getDefaultLayers("overlays");
export const defaultBaseMapLayers: LayerDefinition[] =
  getDefaultLayers("baseMaps");

export const defaultBaseMapId = defaultBaseMapLayers[0].id;

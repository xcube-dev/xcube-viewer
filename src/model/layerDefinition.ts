import { maps } from "@/util/maps";

export interface LayerDefinition {
  id: string;
  name: string;
  group: string;
  url: string;
  attribution?: string;
}

export function getLayerLabel(layer: LayerDefinition | null): string {
  return layer ? `${layer.group} / ${layer.name}` : "-";
}

export function findLayer(
  layers: LayerDefinition[],
  layerId: string | null,
): LayerDefinition | null {
  return layers.find((layer) => layer.id === layerId) || null;
}

function getDefaultLayers(key: "datasets" | "overlays" = "datasets") {
  const layers: LayerDefinition[] = [];
  maps.forEach((mapGroup) => {
    mapGroup[key].forEach((mapSource) => {
      layers.push({
        id: `${mapGroup.name}-${mapSource.name}`,
        group: mapGroup.name,
        attribution: mapGroup.link,
        name: mapSource.name,
        url: mapSource.endpoint,
      });
    });
  });
  return layers;
}

export const defaultBaseMapLayers: LayerDefinition[] =
  getDefaultLayers("datasets");
export const defaultOverlayLayers: LayerDefinition[] =
  getDefaultLayers("overlays");

export const defaultBaseMapId = defaultBaseMapLayers[0].id;

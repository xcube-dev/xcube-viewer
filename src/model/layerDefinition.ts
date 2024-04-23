import { maps } from "@/util/maps";

export interface LayerDefinition {
  id: string;
  name: string;
  group: string;
  url: string;
  attribution?: string;
  wms?: boolean;
}

export function getLayerLabel(layerDef: LayerDefinition | null): string {
  return layerDef ? `${layerDef.group} / ${layerDef.name}` : "-";
}

export function findLayer(
  layerDefs: LayerDefinition[],
  layerId: string | null,
): LayerDefinition | null {
  return layerDefs.find((layer) => layer.id === layerId) || null;
}

function getDefaultLayers(key: "datasets" | "overlays" = "datasets") {
  const layerDefs: LayerDefinition[] = [];
  maps.forEach((mapGroup) => {
    mapGroup[key].forEach((mapSource) => {
      layerDefs.push({
        id: `${mapGroup.name}-${mapSource.name}`,
        group: mapGroup.name,
        attribution: mapGroup.link,
        name: mapSource.name,
        url: mapSource.endpoint,
      });
    });
  });
  return layerDefs;
}

export const defaultBaseMapLayers: LayerDefinition[] =
  getDefaultLayers("datasets");
export const defaultOverlayLayers: LayerDefinition[] =
  getDefaultLayers("overlays");

export const defaultBaseMapId = defaultBaseMapLayers[0].id;

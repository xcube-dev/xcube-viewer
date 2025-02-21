/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { default as OlMap } from "ol/Map";
import { default as OlVectorLayer } from "ol/layer/Vector";
import { default as OlVectorSource } from "ol/source/Vector";
import { Options as OlVectorLayerOptions } from "ol/layer/BaseVector";

import { MapComponent, MapComponentProps } from "../MapComponent";
import { processLayerProperties } from "./common";

interface VectorProps
  extends MapComponentProps,
    OlVectorLayerOptions<OlVectorSource> {}

export class Vector extends MapComponent<
  OlVectorLayer<OlVectorSource>,
  VectorProps
> {
  addMapObject(map: OlMap): OlVectorLayer<OlVectorSource> {
    const layer = new OlVectorLayer<OlVectorSource>(this.props);
    layer.set("id", this.props.id);
    map.getLayers().push(layer);
    return layer;
  }

  updateMapObject(
    _map: OlMap,
    layer: OlVectorLayer<OlVectorSource>,
    prevProps: Readonly<VectorProps>,
  ): OlVectorLayer<OlVectorSource> {
    // TODO: Code duplication in ./Tile.tsx
    if (this.props.source !== prevProps.source && this.props.source) {
      layer.setSource(this.props.source);
    }
    processLayerProperties(layer, prevProps, this.props);
    return layer;
  }

  removeMapObject(map: OlMap, layer: OlVectorLayer<OlVectorSource>): void {
    map.getLayers().remove(layer);
  }
}

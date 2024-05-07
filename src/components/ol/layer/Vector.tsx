/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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

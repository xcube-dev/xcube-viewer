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

import { default as OlVectorLayer } from "ol/layer/Vector";
import { Options as OlVectorLayerOptions } from "ol/layer/BaseVector";
import { default as OlVectorSource } from "ol/source/Vector";
import { default as OlTileLayer } from "ol/layer/Tile";
import { default as OlTileSource } from "ol/source/Tile";
import { Options as OlTileLayerOptions } from "ol/layer/BaseTile";

type Layer = OlVectorLayer<OlVectorSource> | OlTileLayer<OlTileSource>;
type LayerOptions =
  | OlVectorLayerOptions<OlVectorSource>
  | OlTileLayerOptions<OlTileSource>;

export function processLayerProperties(
  layer: Layer,
  prevProps: LayerOptions,
  nextProps: LayerOptions,
) {
  updateLayerProperty(layer, prevProps, nextProps, "visible", true);
  updateLayerProperty(layer, prevProps, nextProps, "opacity", 1.0);
  updateLayerProperty(layer, prevProps, nextProps, "zIndex", undefined);
  updateLayerProperty(layer, prevProps, nextProps, "extent", undefined);
  updateLayerProperty(layer, prevProps, nextProps, "minResolution", undefined);
  updateLayerProperty(layer, prevProps, nextProps, "maxResolution", undefined);
  // TODO: add more props here
}

function updateLayerProperty<T>(
  layer: Layer,
  prevProps: LayerOptions,
  nextProps: LayerOptions,
  propertyName: keyof LayerOptions,
  defaultValue: T,
) {
  const prevValue = normalizeValue(prevProps[propertyName] as T, defaultValue);
  const nextValue = normalizeValue(nextProps[propertyName] as T, defaultValue);
  if (prevValue !== nextValue) {
    layer.set(propertyName as string, nextValue);
  }
}

function normalizeValue<T>(value: T | undefined, defaultValue: T): T {
  return value === undefined ? defaultValue : value;
}

/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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

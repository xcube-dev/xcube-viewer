/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import WMSCapabilities from "ol/format/WMSCapabilities";
import { HTTPError } from "@/api";
import { type JsonObject } from "./json";
import { isObject } from "./types";

const parser = new WMSCapabilities();

export interface WmsLayerDefinition {
  name: string;
  title: string;
  attribution?: string;
}

export async function fetchWmsLayers(
  url: string,
  init?: RequestInit | undefined,
): Promise<WmsLayerDefinition[] | null> {
  try {
    return _fetchWmsLayers(url, init);
  } catch (e) {
    console.warn(`getWmsCapabilities() for URL ${url} failed:`, e);
    return null;
  }
}

async function _fetchWmsLayers(
  url: string,
  init?: RequestInit | undefined,
): Promise<WmsLayerDefinition[]> {
  if (
    (url.startsWith("http:") || url.startsWith("https:")) &&
    !url.includes("?")
  ) {
    url += "?SERVICE=WMS&REQUEST=GetCapabilities";
  }
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new HTTPError(response.status, response.statusText);
  }
  const capsXml = (await response.text()) as string;
  return parseWmsLayers(capsXml);
}

export function parseWmsLayers(capsXml: string): WmsLayerDefinition[] {
  return parseWmsLayerObjects(capsXml).map((layer): WmsLayerDefinition => {
    const name = layer["Name"] as string;
    const title = (layer["Title"] || name) as string;
    let attributionHtml: string | undefined = undefined;
    const attribution = layer["Attribution"];
    if (isObject(attribution)) {
      const attributionTitle = attribution["Title"];
      const attributionUrl = attribution["OnlineResource"];
      if (attributionTitle && attributionUrl) {
        attributionHtml = `&copy; <a href=&quot;${attributionUrl}&quot;>${attributionTitle}</a>`;
      } else if (attributionUrl) {
        attributionHtml = `${attributionUrl}`;
      } else if (attributionTitle) {
        attributionHtml = `${attributionTitle}`;
      }
    }
    return { name, title, attribution: attributionHtml };
  });
}

export function parseWmsLayerObjects(capsXml: string): JsonObject[] {
  const capsObj = parser.read(capsXml);
  // We assume, the result of parsing XML code is always
  // a JSON-serializable object.
  if (isObject(capsObj)) {
    const capObj = capsObj["Capability"];
    if (isObject(capObj)) {
      return flattenLayerObjects(capObj as JsonObject, true);
    }
  }
  throw new Error("invalid WMSCapabilities object");
}

function flattenLayerObjects(
  layerContainer: JsonObject,
  isRoot?: boolean,
): JsonObject[] {
  let childLayer: unknown;
  let layer: JsonObject | undefined = undefined;
  if (isRoot) {
    childLayer = layerContainer["Layer"];
  } else {
    const { Layer, ..._layerProps } = layerContainer;
    childLayer = Layer;
    layer = _layerProps;
  }
  let childLayers: JsonObject[];
  if (Array.isArray(childLayer)) {
    childLayers = childLayer.flatMap((l) => flattenLayerObjects(l));
  } else if (isObject(childLayer)) {
    childLayers = flattenLayerObjects(childLayer as JsonObject);
  } else {
    childLayers = [{}];
  }
  return childLayers.map((l) => mergeLayerObjects(layer, l));
}

function mergeLayerObjects(
  parentLayer: JsonObject | undefined,
  childLayer: JsonObject,
): JsonObject {
  if (!parentLayer) {
    // root case
    return childLayer;
  }

  const name = parentLayer["Name"] || childLayer["Name"];
  if (typeof name !== "string") {
    throw new Error("invalid WMSCapabilities: missing Layer/Name");
  }

  const parentTitle = parentLayer["Title"];
  const childTitle = childLayer["Title"];
  const title =
    parentTitle && childTitle
      ? `${parentTitle} / ${childTitle}`
      : childTitle || parentTitle;

  return { ...parentLayer, ...childLayer, Title: title };
}

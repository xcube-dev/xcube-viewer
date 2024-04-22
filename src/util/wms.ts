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

import WMSCapabilities from "ol/format/WMSCapabilities";

const parser = new WMSCapabilities();

export interface WmsCapabilities {
  layers: string[];
  styles: string[];
  formats: string[];
}

export function getWmsCapabilities(
  url: string,
  init?: RequestInit | undefined,
): Promise<WmsCapabilities | null> {
  try {
    return fetch(url + "?SERVICE=WMS&REQUEST=GetCapabilities", init)
      .then((response: Response) => response.text())
      .then((text: string) => parser.read(text))
      .then((caps: Record<string, unknown>) => {
        console.info("WMS Capabilities: ", caps);
        const capObj = caps["Capability"];

        if (typeof capObj === "object") {
          const layerObj = (capObj as Record<string, unknown>)["Layer"];
          if (typeof layerObj === "object") {
            const layerArray = (layerObj as Record<string, unknown>)["Layer"];
            if (Array.isArray(layerArray)) {
              const layerNames: string[] = [];
              (layerArray as Record<string, unknown>[]).forEach((layer) => {
                const layerName = layer["Name"];
                if (typeof layerName === "string") layerNames.push(layerName);
              });
              return { layers: layerNames, styles: [], formats: [] };
            }
          }
        }
        return null;
      })
      .catch((error) => {
        console.warn(url, error);
        return null;
      });
  } catch (e) {
    return Promise.resolve(null);
  }
}

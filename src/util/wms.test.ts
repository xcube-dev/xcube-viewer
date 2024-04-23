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

import { expect, it, describe } from "vitest";
import { readFileSync } from "fs";
import { parseWmsLayers } from "./wms";

describe("Assert that wms.fetchWmsLayers()", () => {
  it("returns layer definitions for HH_WMS_Gewaesserunterhaltung.xml", () => {
    const capsXml = readFileSync(
      "resources/test/HH_WMS_Gewaesserunterhaltung.xml",
    ).toString();
    const layers = parseWmsLayers(capsXml);
    expect(layers).toEqual([
      {
        name: "gewaesserflaechen",
        title: "Gewässerunterhaltung / Gewässerflächen",
        attribution: undefined,
      },
      {
        name: "gewaessernetz",
        title: "Gewässerunterhaltung / Gewässernetz",
        attribution: undefined,
      },
    ]);
  });

  it("returns layer definitions for ogcsample.xml", () => {
    const capsXml = readFileSync("resources/test/ogcsample.xml").toString();
    const layers = parseWmsLayers(capsXml);
    expect(layers).toEqual([
      {
        name: "ROADS_1M",
        title: "Acme Corp. Map Server / Roads and Rivers / Roads at 1:1M scale",
        attribution:
          "&copy; <a href=&quot;http://www.university.edu/&quot;>State College University</a>",
      },
      {
        name: "RIVERS_1M",
        title:
          "Acme Corp. Map Server / Roads and Rivers / Rivers at 1:1M scale",
        attribution:
          "&copy; <a href=&quot;http://www.university.edu/&quot;>State College University</a>",
      },
      {
        name: "Clouds",
        title:
          "Acme Corp. Map Server / Weather Forecast Data / Forecast cloud cover",
        attribution: undefined,
      },
      {
        name: "Temperature",
        title:
          "Acme Corp. Map Server / Weather Forecast Data / Forecast temperature",
        attribution: undefined,
      },
      {
        name: "Pressure",
        title:
          "Acme Corp. Map Server / Weather Forecast Data / Forecast barometric pressure",
        attribution: undefined,
      },
      {
        name: "ozone_image",
        title: "Acme Corp. Map Server / Global ozone distribution (1992)",
        attribution: undefined,
      },
      {
        name: "population",
        title: "Acme Corp. Map Server / World population, annual",
        attribution: undefined,
      },
    ]);
  });
});

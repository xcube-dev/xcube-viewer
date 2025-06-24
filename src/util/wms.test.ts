/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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

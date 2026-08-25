/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { describe, expect, it } from "vitest";
import { Dataset } from "@/model/dataset";
import { GEOGRAPHIC_CRS, WEB_MERCATOR_CRS } from "@/model/proj";
import { Variable } from "@/model/variable";
import { getDatasetLayerExtent, getTileUrl } from "./controlSelectors";

describe("Assert that controlSelectors.getTileUrl()", () => {
  it("works for RGB", () => {
    const dataset = { id: "demo" } as Dataset;
    expect(getTileUrl("https://xcube.com/api", dataset, "rgb")).toEqual(
      "https://xcube.com/api/tiles/demo/rgb/{z}/{y}/{x}",
    );
  });

  it("works for normal variables", () => {
    const dataset = { id: "demo" } as Dataset;
    const variable = { name: "conc_chl" } as Variable;
    expect(getTileUrl("https://xcube.com/api", dataset, variable)).toEqual(
      "https://xcube.com/api/tiles/demo/conc_chl/{z}/{y}/{x}",
    );
  });

  it("works for user variables", () => {
    const dataset = { id: "demo" } as Dataset;
    const variable = {
      name: "ndvi",
      expression: "(B08 - B04) / (B08 + B04)",
    } as Variable;
    expect(getTileUrl("https://xcube.com/api", dataset, variable)).toEqual(
      "https://xcube.com/api/tiles/demo/ndvi%3D(B08%20-%20B04)%20%2F%20(B08%20%2B%20B04)/{z}/{y}/{x}",
    );
  });
});

describe("Assert that controlSelectors.getDatasetLayerExtent()", () => {
  it("keeps xcube Server dataset bboxes unchanged for geographic maps", () => {
    const extent: [number, number, number, number] = [6.5, 51.0, 7.0, 51.5];

    expect(getDatasetLayerExtent(extent, GEOGRAPHIC_CRS)).toBe(extent);
  });

  it("transforms xcube Server dataset bboxes from geographic coordinates to Web Mercator", () => {
    const extent: [number, number, number, number] = [6.5, 51.0, 7.0, 51.5];

    const transformedExtent = getDatasetLayerExtent(extent, WEB_MERCATOR_CRS);

    expect(transformedExtent[0]).toBeCloseTo(723576.69);
    expect(transformedExtent[1]).toBeCloseTo(6621293.72);
    expect(transformedExtent[2]).toBeCloseTo(779236.44);
    expect(transformedExtent[3]).toBeCloseTo(6710219.08);
  });

  it("does not depend on the dataset's native CRS", () => {
    const extent: [number, number, number, number] = [12.0, 54.0, 13.0, 55.0];

    expect(getDatasetLayerExtent(extent, WEB_MERCATOR_CRS)).toBeDefined();
  });
});

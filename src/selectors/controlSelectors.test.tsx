/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { describe, expect, it } from "vitest";
import { Dataset } from "@/model/dataset";
import { GEOGRAPHIC_CRS, WEB_MERCATOR_CRS } from "@/model/proj";
import { Variable } from "@/model/variable";
import { computeDatasetExtent, getTileUrl } from "./controlSelectors";

describe("Assert that controlSelectors.computeDatasetExtent()", () => {
  const datasetWithGeometry = (geometry: Dataset["geometry"]): Dataset =>
    ({ geometry }) as Dataset;

  const datasetBoundary = {
    type: "Polygon",
    coordinates: [
      [
        [10, 50],
        [11, 50],
        [12, 50],
        [12, 51],
        [12, 52],
        [11, 52],
        [10, 52],
        [10, 51],
        [10, 50],
      ],
    ],
  } as Dataset["geometry"];

  it("returns null when the dataset is missing", () => {
    expect(computeDatasetExtent(null, WEB_MERCATOR_CRS)).toBeNull();
  });

  it("returns null when the dataset has no geometry", () => {
    expect(computeDatasetExtent({} as Dataset, WEB_MERCATOR_CRS)).toBeNull();
  });

  it("returns the geographic extent without transforming it", () => {
    expect(
      computeDatasetExtent(
        datasetWithGeometry(datasetBoundary),
        GEOGRAPHIC_CRS,
      ),
    ).toEqual([10, 50, 12, 52]);
  });

  it("transforms the extent to Web Mercator", () => {
    const extent = computeDatasetExtent(
      datasetWithGeometry(datasetBoundary),
      WEB_MERCATOR_CRS,
    );

    expect(extent).not.toBeNull();
    expect(extent!.length).toBe(4);
    expect(extent![0]).toBeCloseTo(1113194.91, 1);
    expect(extent![1]).toBeCloseTo(6446275.84, 1);
    expect(extent![2]).toBeCloseTo(1335833.89, 1);
    expect(extent![3]).toBeCloseTo(6800125.45, 1);
  });
});

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

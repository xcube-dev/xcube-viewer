/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { describe, expect, it } from "vitest";
import { Dataset } from "@/model/dataset";
import { Variable } from "@/model/variable";
import { getTileUrl } from "./controlSelectors";

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

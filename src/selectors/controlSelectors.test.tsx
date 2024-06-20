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

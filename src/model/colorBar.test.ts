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
import { parseColorBarName, formatColorBarName } from "./colorBar";

describe("Assert that colorBar.parseColorBarName()", () => {
  it("works as expected", () => {
    expect(parseColorBarName("magma")).toEqual({
      baseName: "magma",
      isAlpha: false,
      isReversed: false,
    });
    expect(parseColorBarName("magma_r")).toEqual({
      baseName: "magma",
      isAlpha: false,
      isReversed: true,
    });
    expect(parseColorBarName("magma_alpha")).toEqual({
      baseName: "magma",
      isAlpha: true,
      isReversed: false,
    });
    expect(parseColorBarName("magma_r_alpha")).toEqual({
      baseName: "magma",
      isAlpha: true,
      isReversed: true,
    });
  });
});

describe("Assert that colorBar.formatColorBarName()", () => {
  it("works as expected", () => {
    expect(
      formatColorBarName({
        baseName: "viridis",
        isAlpha: false,
        isReversed: false,
      }),
    ).toEqual("viridis");
    expect(
      formatColorBarName({
        baseName: "viridis",
        isAlpha: false,
        isReversed: true,
      }),
    ).toEqual("viridis_r");
    expect(
      formatColorBarName({
        baseName: "viridis",
        isAlpha: true,
        isReversed: false,
      }),
    ).toEqual("viridis_alpha");
    expect(
      formatColorBarName({
        baseName: "viridis",
        isAlpha: true,
        isReversed: true,
      }),
    ).toEqual("viridis_r_alpha");
  });
});

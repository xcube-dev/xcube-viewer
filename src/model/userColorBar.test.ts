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
import {
  getUserColorBarRgbaArray,
  getUserColorBarColorRecords,
  USER_COLOR_BAR_CODE_EXAMPLE,
} from "./userColorBar";

describe("Assert that colorBar.getUserColorBarRgbaArray()", () => {
  it("works as expected if continuous", () => {
    const data = getUserColorBarRgbaArray(
      [
        { value: 0.0, color: [35, 255, 82, 255] },
        { value: 0.5, color: [255, 0, 0, 255] },
        { value: 1.0, color: [120, 30, 255, 255] },
      ],
      false,
      10,
    );
    expect(data).toBeInstanceOf(Uint8ClampedArray);
    expect([...data]).toEqual([
      35, 255, 82, 255, 84, 198, 64, 255, 133, 142, 46, 255, 182, 85, 27, 255,
      231, 28, 9, 255, 240, 3, 28, 255, 210, 10, 85, 255, 180, 17, 142, 255,
      150, 23, 198, 255, 120, 30, 255, 255,
    ]);
  });

  it("works as expected if discrete", () => {
    const data = getUserColorBarRgbaArray(
      [
        { value: 0.0, color: [35, 255, 82, 255] },
        { value: 0.5, color: [255, 0, 0, 255] },
        { value: 1.0, color: [120, 30, 255, 255] },
      ],
      true,
      10,
    );
    expect(data).toBeInstanceOf(Uint8ClampedArray);
    expect([...data]).toEqual([
      35, 255, 82, 255, 84, 198, 64, 255, 133, 142, 46, 255, 182, 85, 27, 255,
      231, 28, 9, 255, 240, 3, 28, 255, 210, 10, 85, 255, 180, 17, 142, 255,
      150, 23, 198, 255, 120, 30, 255, 255,
    ]);
  });
});

describe("Assert that colorBar.getUserColorBarColorRecords()", () => {
  it("parses the example code as expected", () => {
    expect(getUserColorBarColorRecords(USER_COLOR_BAR_CODE_EXAMPLE)).toEqual({
      colorRecords: [
        { value: 0.0, color: [35, 255, 82, 255] },
        { value: 0.5, color: [255, 0, 0, 255] },
        { value: 1.0, color: [120, 30, 255, 255] },
      ],
    });
  });

  it("parses non-unique values", () => {
    expect(
      getUserColorBarColorRecords("0:blue\n1:red\n1:green\n2:blue"),
    ).toEqual({
      colorRecords: [
        { value: 0, color: [0, 0, 255, 255] },
        { value: 1, color: [255, 0, 0, 255] },
        { value: 1, color: [0, 128, 0, 255] },
        { value: 2, color: [0, 0, 255, 255] },
      ],
    });
  });

  it("parses categories", () => {
    expect(
      getUserColorBarColorRecords("0:blue:cat-1\n1:red:cat-2\n2:blue:cat-3"),
    ).toEqual({
      colorRecords: [
        { value: 0, color: [0, 0, 255, 255], label: "cat-1" },
        { value: 1, color: [255, 0, 0, 255], label: "cat-2" },
        { value: 2, color: [0, 0, 255, 255], label: "cat-3" },
      ],
    });
  });

  it("detects invalid code", () => {
    expect(getUserColorBarColorRecords("")).toEqual({
      errorMessage: "At least two color records must be given",
    });

    expect(getUserColorBarColorRecords("what?")).toEqual({
      errorMessage: "Line 1: invalid color record: what?",
    });

    expect(getUserColorBarColorRecords("0: red\n1: green\n\nx: blue")).toEqual({
      errorMessage: "Line 4: invalid value: x",
    });

    expect(getUserColorBarColorRecords("0: red\n1: greeen\n0: blue")).toEqual({
      errorMessage: "Line 2: invalid color: greeen",
    });

    expect(getUserColorBarColorRecords("0: red\n0: green")).toEqual({
      errorMessage: "Values must form a range",
    });
  });
});

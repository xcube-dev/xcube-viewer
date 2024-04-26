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
  parseUserColorBarCode,
  USER_COLOR_BAR_CODE_EXAMPLE,
} from "./colorBar";

describe("Assert that colorBar.getUserColorBarData()", () => {
  it("works as expected", () => {
    const data = getUserColorBarRgbaArray(
      [
        [0.0, [35, 255, 82]],
        [0.5, [255, 0, 0]],
        [1.0, [120, 30, 255]],
      ],
      10,
    );
    console.log(data);
    expect(data).toBeInstanceOf(Uint8ClampedArray);
    expect([...data]).toEqual([
      35, 255, 82, 255, 84, 198, 64, 255, 133, 142, 46, 255, 182, 85, 27, 255,
      231, 28, 9, 255, 240, 3, 28, 255, 210, 10, 85, 255, 180, 17, 142, 255,
      150, 23, 198, 255, 120, 30, 255, 255,
    ]);
  });
});

describe("Assert that colorBar.parseUserColorCode()", () => {
  it("parses the example code as expected", () => {
    expect(parseUserColorBarCode(USER_COLOR_BAR_CODE_EXAMPLE)).toEqual([
      [0.0, [35, 255, 82]],
      [0.5, [255, 0, 0]],
      [1.0, [120, 30, 255]],
    ]);
  });

  it("detects invalid code", () => {
    expect(() => parseUserColorBarCode("")).toThrowError(
      new SyntaxError("At least two color records must be given"),
    );

    expect(() => parseUserColorBarCode("what?")).toThrowError(
      new SyntaxError("Line 1: invalid color record: what?"),
    );

    expect(() =>
      parseUserColorBarCode("0: red\n1: green\n\nx: blue"),
    ).toThrowError(new SyntaxError("Line 4: invalid value: x"));

    expect(() =>
      parseUserColorBarCode("0: red\n1: greeen\n0: blue"),
    ).toThrowError(new SyntaxError("Line 2: invalid color: greeen"));

    expect(() =>
      parseUserColorBarCode("0: red\n1: green\n0: blue"),
    ).toThrowError(new SyntaxError("Values must be unique"));
  });
});

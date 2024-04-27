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
import { parseColor } from "./color";

describe("Assert that color.parseColor()", () => {
  it("works for hex colors", () => {
    expect(parseColor("#000")).toEqual([0, 0, 0, 255]);
    expect(parseColor("#fff")).toEqual([255, 255, 255, 255]);
    expect(parseColor("#f00, 0.3")).toEqual([255, 0, 0, 77]);
    expect(parseColor("#E9967A")).toEqual([233, 150, 122, 255]);
    expect(parseColor("#e9967a")).toEqual([233, 150, 122, 255]);
    expect(parseColor("#e9967a, 0.7")).toEqual([233, 150, 122, 179]);
    expect(parseColor("#e9967a16")).toEqual([233, 150, 122, 22]);
  });

  it("works for RGB colors", () => {
    expect(parseColor("0,0,0")).toEqual([0, 0, 0, 255]);
    expect(parseColor("255, 255, 255")).toEqual([255, 255, 255, 255]);
    expect(parseColor("233, 150, 122")).toEqual([233, 150, 122, 255]);
    expect(parseColor("233, 150, 122, 0")).toEqual([233, 150, 122, 0]);
    expect(parseColor("233, 150, 122, 0.5")).toEqual([233, 150, 122, 128]);
    expect(parseColor("233, 150, 122, 1")).toEqual([233, 150, 122, 255]);
  });

  it("works for color names", () => {
    expect(parseColor("darksalmon")).toEqual([233, 150, 122, 255]);
    expect(parseColor("DarkSalmon")).toEqual([233, 150, 122, 255]);
    expect(parseColor("DarkSalmon, 0.25")).toEqual([233, 150, 122, 64]);
  });

  it("detects invalid color strings", () => {
    expect(parseColor("#P9FF7A")).toBeUndefined();
    expect(parseColor("0, 0")).toBeUndefined();
    expect(parseColor("0, 0, 256")).toBeUndefined();
    expect(parseColor("DarkMetal")).toBeUndefined();
    expect(parseColor("DarkMetal, 120")).toBeUndefined();
  });
});

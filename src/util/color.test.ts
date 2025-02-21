/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { expect, it, describe } from "vitest";
import { hexToRgb, parseColor, rgbToHex } from "./color";

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

describe("Assert that rgbToHex(hexToRgb(x)) is x", () => {
  it("works", () => {
    expect(rgbToHex(hexToRgb("#000")!)).toEqual("#000000");
    expect(rgbToHex(hexToRgb("#000000")!)).toEqual("#000000");
    expect(rgbToHex(hexToRgb("#ff0000ff")!)).toEqual("#ff0000ff");
  });
});

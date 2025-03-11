/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { describe, expect, it } from "vitest";
import {
  getUserColorBarRgbaArray,
  getUserColorBarColorRecords,
  USER_COLOR_BAR_CODE_EXAMPLE,
} from "./userColorBar";

describe("Assert that colorBar.getUserColorBarRgbaArray()", () => {
  it("works as expected if type='continuous'", () => {
    const data = getUserColorBarRgbaArray(
      [
        { value: 0.0, color: [35, 255, 82, 255] },
        { value: 0.5, color: [255, 0, 0, 255] },
        { value: 1.0, color: [120, 30, 255, 255] },
      ],
      "continuous",
      10,
    );
    expect(data).toBeInstanceOf(Uint8ClampedArray);
    expect([...data]).toEqual([
      35, 255, 82, 255, 84, 198, 64, 255, 133, 142, 46, 255, 182, 85, 27, 255,
      231, 28, 9, 255, 240, 3, 28, 255, 210, 10, 85, 255, 180, 17, 142, 255,
      150, 23, 198, 255, 120, 30, 255, 255,
    ]);
  });

  it("works as expected if type='categorical'", () => {
    const data = getUserColorBarRgbaArray(
      [
        { value: 0.0, color: [35, 255, 82, 255] },
        { value: 0.5, color: [255, 0, 0, 255] },
        { value: 1.0, color: [120, 30, 255, 255] },
      ],
      "categorical",
      10,
    );
    expect(data).toBeInstanceOf(Uint8ClampedArray);
    // console.log("data:", data);
    expect([...data]).toEqual([
      35, 255, 82, 255, 35, 255, 82, 255, 35, 255, 82, 255, 35, 255, 82, 255,
      255, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 255, 120, 30, 255, 255, 120,
      30, 255, 255, 120, 30, 255, 255,
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

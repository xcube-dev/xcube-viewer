/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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

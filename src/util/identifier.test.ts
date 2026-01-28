/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { expect, it, describe } from "vitest";
import { isIdentifier, getIdentifiers } from "./identifier";

describe("Assert that identifier.isIdentifier()", () => {
  it("returns true for identifiers", () => {
    expect(isIdentifier("test9")).toEqual(true);
    expect(isIdentifier("value")).toEqual(true);
    expect(isIdentifier("value_min")).toEqual(true);
  });

  it("returns false for non-identifiers", () => {
    expect(isIdentifier("")).toEqual(false);
    expect(isIdentifier("2.4")).toEqual(false);
    expect(isIdentifier("9test")).toEqual(false);
    expect(isIdentifier("+test")).toEqual(false);
    expect(isIdentifier("value-min")).toEqual(false);
  });
});

describe("Assert that identifier.getIdentifiers()", () => {
  it("works", () => {
    expect(getIdentifiers("")).toEqual(new Set());
    expect(getIdentifiers("B07")).toEqual(new Set(["B07"]));
    expect(getIdentifiers("(B04 - B05) / (max(B06, B07) + B05)")).toEqual(
      new Set(["B04", "B05", "B06", "B07", "max"]),
    );
  });
});

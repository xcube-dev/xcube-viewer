/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { expect, it, describe } from "vitest";
import { makeStyles, makeCssStyles } from "./styles";

describe("makeStyles", () => {
  it("just converts the type and not the value", () => {
    const rawStyles = {};
    expect(makeStyles(rawStyles)).toBe(rawStyles);
  });
});

describe("makeCssStyles", () => {
  it("just converts the type and not the value", () => {
    const rawStyles = {};
    expect(makeCssStyles(rawStyles)).toBe(rawStyles);
  });
});

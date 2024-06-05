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

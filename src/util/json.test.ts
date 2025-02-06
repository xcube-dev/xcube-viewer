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
import { isJsonPrimitive, isJsonObject, isJsonArray } from "./json";

describe("json", () => {
  it("isJsonPrimitive()", () => {
    expect(isJsonPrimitive(null)).toBe(true);
    expect(isJsonPrimitive(false)).toBe(true);
    expect(isJsonPrimitive(13)).toBe(true);
    expect(isJsonPrimitive("Hello!")).toBe(true);

    expect(isJsonPrimitive(undefined)).toBe(false);
    expect(isJsonPrimitive(() => {})).toBe(false);
    expect(isJsonPrimitive({})).toBe(false);
    expect(isJsonPrimitive([])).toBe(false);
  });

  it("isJsonArray()", () => {
    expect(isJsonArray([])).toBe(true);
    expect(isJsonArray([false, "hello", [1, 2, 3]])).toBe(true);
    expect(isJsonArray([1, undefined, 3])).toBe(true);
    expect(isJsonArray([{ count: 3 }])).toBe(true);

    expect(isJsonArray(undefined)).toBe(false);
    expect(isJsonArray(null)).toBe(false);
    expect(isJsonArray(true)).toBe(false);
    expect(isJsonArray(12)).toBe(false);
    expect(isJsonArray("hello")).toBe(false);
    expect(isJsonArray(() => {})).toBe(false);
    expect(isJsonArray({})).toBe(false);
  });

  it("isJsonObject()", () => {
    expect(isJsonObject({})).toBe(true);
    expect(isJsonObject({ name: undefined })).toBe(true);
    expect(isJsonObject({ names: [] })).toBe(true);

    expect(isJsonObject(undefined)).toBe(false);
    expect(isJsonObject(null)).toBe(false);
    expect(isJsonObject(true)).toBe(false);
    expect(isJsonObject(12)).toBe(false);
    expect(isJsonObject("hello")).toBe(false);
    expect(isJsonObject(() => {})).toBe(false);
    expect(isJsonObject([])).toBe(false);
    expect(isJsonObject({ name: () => "hello" })).toBe(false);
    expect(isJsonObject({ names: [() => "hello"] })).toBe(false);
  });
});

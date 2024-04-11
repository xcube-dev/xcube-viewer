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
import { findIndexCloseTo } from "./find";

describe("find", () => {
  describe("findIndexCloseTo", () => {
    it("should accept empty arrays", () => {
      expect(findIndexCloseTo([], 0)).toEqual(-1);
    });

    it("should return 0 for 1-element arrays", () => {
      expect(findIndexCloseTo([0.4], -5)).toEqual(0);
      expect(findIndexCloseTo([0.4], 0)).toEqual(0);
      expect(findIndexCloseTo([0.4], +5)).toEqual(0);
    });

    it("should accept values outside bounds", () => {
      expect(findIndexCloseTo([0.1, 0.2, 0.4], -5)).toEqual(0);
      expect(findIndexCloseTo([0.1, 0.2, 0.4], +5)).toEqual(2);
    });

    it("should find the best index", () => {
      expect(findIndexCloseTo([0.1, 0.2, 0.4, 0.5, 0.9], 0.0)).toEqual(0);
      expect(findIndexCloseTo([0.1, 0.2, 0.4, 0.5, 0.9], 0.05)).toEqual(0);
      expect(findIndexCloseTo([0.1, 0.2, 0.4, 0.5, 0.9], 0.1)).toEqual(0);
      expect(findIndexCloseTo([0.1, 0.2, 0.4, 0.5, 0.9], 0.15)).toEqual(0);
      expect(findIndexCloseTo([0.1, 0.2, 0.4, 0.5, 0.9], 0.2)).toEqual(1);
      expect(findIndexCloseTo([0.1, 0.2, 0.4, 0.5, 0.9], 0.25)).toEqual(1);
      expect(findIndexCloseTo([0.1, 0.2, 0.4, 0.5, 0.9], 0.3)).toEqual(1);
      expect(findIndexCloseTo([0.1, 0.2, 0.4, 0.5, 0.9], 0.35)).toEqual(2);
      expect(findIndexCloseTo([0.1, 0.2, 0.4, 0.5, 0.9], 0.4)).toEqual(2);
      expect(findIndexCloseTo([0.1, 0.2, 0.4, 0.5, 0.9], 0.45)).toEqual(2);
      expect(findIndexCloseTo([0.1, 0.2, 0.4, 0.5, 0.9], 0.5)).toEqual(3);
      expect(findIndexCloseTo([0.1, 0.2, 0.4, 0.5, 0.9], 0.55)).toEqual(3);
      expect(findIndexCloseTo([0.1, 0.2, 0.4, 0.5, 0.9], 0.6)).toEqual(3);
      expect(findIndexCloseTo([0.1, 0.2, 0.4, 0.5, 0.9], 0.65)).toEqual(3);
      expect(findIndexCloseTo([0.1, 0.2, 0.4, 0.5, 0.9], 0.7)).toEqual(3);
      expect(findIndexCloseTo([0.1, 0.2, 0.4, 0.5, 0.9], 0.75)).toEqual(4);
      expect(findIndexCloseTo([0.1, 0.2, 0.4, 0.5, 0.9], 0.8)).toEqual(4);
      expect(findIndexCloseTo([0.1, 0.2, 0.4, 0.5, 0.9], 0.85)).toEqual(4);
      expect(findIndexCloseTo([0.1, 0.2, 0.4, 0.5, 0.9], 0.9)).toEqual(4);
      expect(findIndexCloseTo([0.1, 0.2, 0.4, 0.5, 0.9], 0.95)).toEqual(4);
      expect(findIndexCloseTo([0.1, 0.2, 0.4, 0.5, 0.9], 1.0)).toEqual(4);
    });
  });
});

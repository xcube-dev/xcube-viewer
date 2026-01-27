/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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

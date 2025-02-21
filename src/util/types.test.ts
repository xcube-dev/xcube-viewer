/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { expect, it, describe } from "vitest";
import { isNumber, isObject } from "@/util/types";

class A {}

const TEST_VALUES = [
  undefined,
  null,
  true,
  1.5,
  "Hi",
  () => {},
  [],
  {},
  A,
  new A(),
];

describe("Assert", () => {
  it("isNumber() works", () => {
    expect(TEST_VALUES.map(isNumber)).toEqual([
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
  });

  it("isObject() works", () => {
    expect(TEST_VALUES.map(isObject)).toEqual([
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
    ]);
  });
});

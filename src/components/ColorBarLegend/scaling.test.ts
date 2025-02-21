/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { expect, it, describe } from "vitest";
import Scaling from "./scaling";

describe("Assert that Scaling", () => {
  it("works in the log case", () => {
    const scaling = new Scaling(true);

    expect(scaling.scale(0.01)).toEqual(-2);
    expect(scaling.scaleInv(2)).toEqual(100);

    expect(scaling.scale([0.001, 0.01, 0.1, 1, 10])).toEqual([
      -3, -2, -1, 0, 1,
    ]);
    expect(scaling.scaleInv([-3, -2, -1, 0, 1])).toEqual([
      0.001, 0.01, 0.1, 1, 10,
    ]);
  });

  it("works in the identity case", () => {
    const scaling = new Scaling(false);

    expect(scaling.scale(0.01)).toEqual(0.01);
    expect(scaling.scaleInv(100)).toEqual(100);

    expect(scaling.scale([0.1, 0.2, 0.3])).toEqual([0.1, 0.2, 0.3]);
    expect(scaling.scaleInv([0.1, 0.2, 0.3])).toEqual([0.1, 0.2, 0.3]);
  });
});

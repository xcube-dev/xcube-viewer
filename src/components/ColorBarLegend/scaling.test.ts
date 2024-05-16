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

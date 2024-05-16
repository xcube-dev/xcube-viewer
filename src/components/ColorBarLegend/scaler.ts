/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining x copy of
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

const ident = (x: number) => x;
const pow10 = (x: number) => Math.pow(10, x);
const log10 = Math.log10;

function scale(
  x: number | [number, number] | number[],
  fn: (x: number) => number,
): number | [number, number] | number[] {
  return typeof x === "number" ? fn(x) : x.map(fn);
}

// noinspection JSUnusedGlobalSymbols
/**
 * A class representing a scaling operation.
 * @class
 */
export default class Scale {
  private readonly _fn: (x: number) => number;
  private readonly _invFn: (x: number) => number;

  constructor(isLog: boolean) {
    if (isLog) {
      this._fn = log10;
      this._invFn = pow10;
    } else {
      this._fn = ident;
      this._invFn = ident;
    }
  }

  scale(x: number): number;
  scale(x: [number, number]): [number, number];
  scale(x: number[]): number[];
  scale(
    x: number | [number, number] | number[],
  ): number | [number, number] | number[] {
    return scale(x, this._fn);
  }

  scaleInv(x: number): number;
  scaleInv(x: [number, number]): [number, number];
  scaleInv(x: number[]): number[];
  scaleInv(
    x: number | [number, number] | number[],
  ): number | [number, number] | number[] {
    return scale(x, this._invFn);
  }
}

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

/**
 * Find index into `array` so that `array[index]` is closest to `value`.
 * Uses a bi-section algorithm, so it should perform according to O(log2(N)).
 *
 * @param {number[]} array of monotonically increasing values
 * @param {number} value some value to find the index for
 * @returns {number} the integer index or -1 if the array is empty
 */
export function findIndexCloseTo(array: number[], value: number): number {
  const n = array.length;
  if (n === 0) {
    return -1;
  }
  if (n === 1) {
    return 0;
  }
  let i1 = 0,
    i3 = n - 1;
  if (value <= array[i1]) {
    return i1;
  }
  if (value >= array[i3]) {
    return i3;
  }
  let i2 = Math.floor(n / 2),
    otherValue;
  for (let i = 0; i < n; i++) {
    otherValue = array[i2];
    if (value < otherValue) {
      [i2, i3] = [Math.floor((i1 + i2) / 2), i2];
    } else if (value > otherValue) {
      [i1, i2] = [i2, Math.floor((i2 + i3) / 2)];
    } else {
      return i2;
    }
    if (i1 === i2 || i2 === i3) {
      return Math.abs(array[i1] - value) <= Math.abs(array[i3] - value)
        ? i1
        : i3;
    }
  }
  return -1;
}

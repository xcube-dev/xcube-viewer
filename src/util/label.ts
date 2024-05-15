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

export function getLabelsForRange(
  minValue: number,
  maxValue: number,
  count: number = 5,
  logScaled: boolean = false,
  exponential: boolean = false,
): string[] {
  return getLabelsForArray(
    getRange(minValue, maxValue, count, logScaled),
    exponential,
  );
}

export function getLabelsForArray(
  values: number[],
  exponential: boolean = false,
): string[] {
  const fractionDigits = exponential ? 2 : getFractionDigits(values);
  return values.map((v) => getLabelForValue(v, fractionDigits, exponential));
}

function getLabelForValue(
  value: number,
  fractionDigits: number,
  exponential?: boolean,
): string {
  if (exponential) {
    return value.toExponential(fractionDigits);
  }
  const valueRounded = Math.round(value);
  if (valueRounded === value || Math.abs(valueRounded - value) < 1e-8) {
    return valueRounded + "";
  } else {
    let label = value.toFixed(fractionDigits);
    // Strip trailing "0"s
    if (label.includes(".")) {
      while (label.endsWith("0")) {
        label = label.substring(0, label.length - 1);
      }
    }
    return label;
  }
}

export function getFractionDigits(values: number[]): number {
  const min = values[0];
  const max = values[values.length - 1];
  const v1 = getFractionDigitsForScalar(min);
  const v2 = getFractionDigitsForScalar(max);
  const n = Math.max(v1, v2);
  return Math.min(10, Math.max(2, n + 1));
}

function getFractionDigitsForScalar(x: number): number {
  if (x === 0) {
    return 0;
  }
  const n = Math.floor(Math.log10(Math.abs(x)));
  return n < 0 ? -n : 0;
}

function getRange(
  minValue: number,
  maxValue: number,
  count: number,
  logScaled?: boolean,
): number[] {
  const ticks = new Array<number>(count);
  if (logScaled) {
    const logMin = Math.log10(minValue);
    const logMax = Math.log10(maxValue);
    const logDelta = (logMax - logMin) / (count - 1);
    for (let i = 1; i < count - 1; i++) {
      ticks[i] = Math.pow(10, logMin + i * logDelta);
    }
  } else {
    const delta = (maxValue - minValue) / (count - 1);
    for (let i = 1; i < count - 1; i++) {
      ticks[i] = minValue + i * delta;
    }
  }
  ticks[0] = minValue;
  ticks[count - 1] = maxValue;
  return ticks;
}

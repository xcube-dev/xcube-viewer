/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

export function getLabelsForRange(
  minValue: number,
  maxValue: number,
  count: number = 5,
  logScaled: boolean = false,
  exponential: boolean = false,
): string[] {
  return getLabelsForValues(
    getRange(minValue, maxValue, count, logScaled),
    exponential,
  );
}

export function getLabelsForValues(
  values: number[],
  exponential: boolean = false,
): string[] {
  // const fractionDigits = exponential ? 2 : getFractionDigits(values);
  return values.map((v) => getLabelForValue(v, undefined, exponential));
}

export function getLabelForValue(
  value: number,
  fractionDigits?: number,
  exponential?: boolean,
): string {
  if (fractionDigits === undefined) {
    fractionDigits = exponential ? 2 : getSignificantDigits(value);
  }
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
      while (label.endsWith("0") && !label.endsWith(".0")) {
        label = label.substring(0, label.length - 1);
      }
    }
    return label;
  }
}

function getSignificantDigits(x: number): number {
  if (x === 0 || x === Math.floor(x)) {
    return 0;
  }
  const exp = Math.floor(Math.log10(Math.abs(x)));
  return Math.min(16, Math.max(2, exp < 0 ? 1 - exp : 0));
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

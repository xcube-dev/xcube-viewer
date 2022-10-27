/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2021 by the xcube development team and contributors.
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

export function getLabelsFromArray(values: number[]): string[] {
    const min = values[0];
    const max = values[values.length - 1];
    const fractionDigits = Math.min(10, Math.max(2, Math.round(-Math.log10(max - min))));
    function _formatValue(value: number): string {
        return formatValue(value, fractionDigits);
    }
    return values.map(_formatValue);
}

export function getLabelsFromRange(minValue: number, maxValue: number, count: number = 5): string[] {
    return getLabelsFromArray(arange(minValue, maxValue, count));
}

function formatValue(value: number, fractionDigits: number): string {
    const valueRounded = Math.round(value);
    if (Math.abs(valueRounded - value) < 1e-8) {
        return valueRounded + '';
    } else {
        return value.toFixed(fractionDigits);
    }
}

export function arange(minValue: number, maxValue: number, count: number): number[] {
    const delta = (maxValue - minValue) / (count - 1);
    const ticks = new Array<number>(count);
    for (let i = 0; i < count; i++) {
        ticks[i] = minValue + i * delta;
    }
    return ticks;
}


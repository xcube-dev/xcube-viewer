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


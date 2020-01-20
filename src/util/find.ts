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
    let i1 = 0, i3 = n - 1;
    if (value <= array[i1]) {
        return i1;
    }
    if (value >= array[i3]) {
        return i3;
    }
    let i2 = Math.floor(n / 2), otherValue;
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
            return Math.abs(array[i1] - value) <= Math.abs(array[i3] - value) ? i1 : i3;
        }
    }
    return -1;
}

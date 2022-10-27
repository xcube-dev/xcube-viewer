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

export class DeveloperError extends Error {
}

export function assertTrue(condition: any, message: string) {
    if (!condition) {
        throw new DeveloperError(`assertion failed: ${message}`);
    }
}

export function assertNotNull(object: any, objectName: string) {
    if (object === null) {
        throw new DeveloperError(`assertion failed: ${objectName} must not be null`);
    }
}

export function assertDefined(object: any, objectName: string) {
    if (typeof object === "undefined") {
        throw new DeveloperError(`assertion failed: ${objectName} must not be undefined`);
    }
}

export function assertDefinedAndNotNull(object: any, objectName: string) {
    assertNotNull(object, objectName);
    assertDefined(object, objectName);
}

export function assertArray(array: any, arrayName: string) {
    if (!Array.isArray(array)) {
        throw new DeveloperError(`assertion failed: ${arrayName} must be an array`);
    }
}

export function assertArrayNotEmpty(array: any, arrayName: string) {
    assertArray(array, arrayName);
    if (array.length === 0) {
        throw new DeveloperError(`assertion failed: ${arrayName} must be a non-empty array`);
    }
}

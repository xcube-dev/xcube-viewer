/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2023 by the xcube development team and contributors.
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
 * Builds a path by concatenating a base path and subsequent path components.
 * The function ensures that only single path separators are used between
 * path components.
 *
 * @param base
 * @param components
 */
export function buildPath(base: string, ...components: string[]): string {
    let path = base;
    for (let c of components) {
        if (c !== '') {
            if (path.endsWith('/')) {
                if (c.startsWith('/')) {
                    path += c.substr(1);
                } else {
                    path += c;
                }
            } else {
                if (c.startsWith('/')) {
                    path += c;
                } else {
                    path += '/' + c;
                }
            }
        }
    }
    return path;
}

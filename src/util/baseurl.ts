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

function _getBaseUrl(): URL {
    const url = new URL(window.location.href);
    const pathComponents = url.pathname.split('/');
    const numPathComponents = pathComponents.length;
    if (numPathComponents > 0) {
        const lastComponent = pathComponents[numPathComponents - 1];
        if (lastComponent === 'index.html') {
            return new URL(pathComponents.slice(0, numPathComponents - 1).join('/'), window.location.origin);
        } else {
            return new URL(url.pathname, window.location.origin);
        }
    }
    return new URL(window.location.origin);
}

const baseUrl = _getBaseUrl();

export default baseUrl;

console.log("baseUrl = ", baseUrl.href);
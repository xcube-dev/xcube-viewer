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

// Ugly hack to avoid image smoothing. We alter the global HTMLCanvasElementPrototype.getContext() implementation.
// See https://github.com/openlayers/openlayers/issues/10273

const HTMLCanvasElementPrototype = HTMLCanvasElement.prototype as any;
HTMLCanvasElementPrototype._getContextDefault = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElementPrototype._getContextNoImageSmoothing = function (contextType: string, contextAttributes?: any): any {
    const self = this as any;
    const ctx = self._getContextDefault(contextType, contextAttributes);
    if (contextType === '2d') {
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
    }
    return ctx;
};


export function getGlobalCanvasImageSmoothing(): boolean {
    return HTMLCanvasElementPrototype.getContext === HTMLCanvasElementPrototype._getContextDefault;
}

export function setGlobalCanvasImageSmoothing(imageSmoothingEnabled: boolean) {
    if (imageSmoothingEnabled) {
        HTMLCanvasElementPrototype.getContext = HTMLCanvasElementPrototype._getContextDefault;
    } else {
        HTMLCanvasElementPrototype.getContext = HTMLCanvasElementPrototype._getContextNoImageSmoothing;
    }
}

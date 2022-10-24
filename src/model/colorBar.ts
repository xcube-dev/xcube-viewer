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

export interface ColorBars {
    groups: ColorBarGroup[];
    images: { [name: string]: string };
}

export interface ColorBarGroup {
    title: string;
    description: string;
    names: string[];
}

export const CB_ALPHA_SUFFIX = '_alpha';
export const CB_REVERSE_SUFFIX = '_r';


export interface ColorBar {
    baseName: string;
    isAlpha: boolean;
    isReversed: boolean;
    // https://stackoverflow.com/questions/13416800/how-to-generate-an-image-from-imagedata-in-javascript
    imageData: string | null;
}

export function parseColorBar(name: string, colorBars: ColorBars): ColorBar {
    let baseName = name;

    const isAlpha = baseName.endsWith(CB_ALPHA_SUFFIX);
    if (isAlpha) {
        baseName = baseName.slice(0, baseName.length - CB_ALPHA_SUFFIX.length);
    }

    const isReversed = baseName.endsWith(CB_REVERSE_SUFFIX);
    if (isReversed) {
        baseName = baseName.slice(0, baseName.length - CB_REVERSE_SUFFIX.length);
    }

    const imageData = colorBars.images[baseName] || null;

    return {baseName, isAlpha, isReversed, imageData};
}

export function formatColorBar(colorBar: ColorBar): string {
    let name = colorBar.baseName;
    if (colorBar.isReversed) {
        name += CB_REVERSE_SUFFIX;
    }
    if (colorBar.isAlpha) {
        name += CB_ALPHA_SUFFIX;
    }
    return name;
}
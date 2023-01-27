/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2022 by the xcube development team and contributors.
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

import { parseCsv, ParseOptions, defaultParseOptions } from '../../util/csv';
import { Format } from './common';


const checkError = (text: string): string | null => {
    if (text.trim() !== '') {
        try {
            parseCsv(text);
        } catch (e) {
            console.error(e);
            return `${e}`;
        }
    }
    return null;
};

export const csvFormat: Format = {
    name: 'Text/CSV',
    fileExt: '.txt,.csv',
    checkError
};

export interface CsvOptions extends ParseOptions {
    xName: string;
    yName: string;
    forceGeometry: boolean;
    geometryName: string;
    labelName: string;
    labelPrefix: string;
}

export const defaultCsvOptions: CsvOptions = {
    ...defaultParseOptions,
    xName: "longitude",
    yName: "latitude",
    forceGeometry: false,
    geometryName: "geometry",
    labelName: "name",
    labelPrefix: "CSV-",
};

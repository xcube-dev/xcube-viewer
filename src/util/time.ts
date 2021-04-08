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

export const LOCAL_OFFSET = -new Date("1970-01-01T00:00:00").getTime();

export function dateTimeStringToUtcTime(dateTimeString: string): number {
    return new Date(dateTimeString).getTime();
}

export function utcTimeToIsoDateString(utcTime: number, local: boolean = false) {
    return new Date(utcTime + (local ? LOCAL_OFFSET : 0))
        .toISOString()
        .substr(0, 10);
}

export function utcTimeToIsoDateTimeString(utcTime: number, local: boolean = false, skipSeconds: boolean = false) {
    return new Date(utcTime + (local ? LOCAL_OFFSET : 0))
        .toISOString()
        .substr(0, skipSeconds ? 16 : 19)
        .replace("T", " ");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
// The use of the following functions has been discontinued as an intermediate step towards issue #133.

/*

export function utcTimeToLocalTimeString(utcTime: number) {
    return new Date(utcTime).toLocaleTimeString();
}

export function utcTimeToLocalDateTimeString(utcTime: number) {
    return new Date(utcTime).toLocaleString();
}

export function utcTimeToLocalDateString(utcTime: number) {
    return new Date(utcTime).toLocaleDateString();
}

export function utcTimeToDateString(utcTime: number) {
    return new Date(utcTime).toISOString().substr(0, 10);
}

export function utcTimeToLocalIsoDateString(utcTime: number) {
    return utcTimeToIsoDateString(utcTime, true);
}

export function utcTimeToLocalIsoDateTimeString(utcTime: number, skipSeconds?: boolean) {
    return utcTimeToIsoDateTimeString(utcTime, true, skipSeconds);
}

*/

//
////////////////////////////////////////////////////////////////////////////////////////////////////////

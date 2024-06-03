/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
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

function getTimezoneOffset(date: Date): number {
  return date.getTimezoneOffset() * 60000;
}

export function localToUtcTime(local: Date): number {
  return local.getTime() - getTimezoneOffset(local);
}

export function utcTimeToLocal(utcTime: number): Date {
  const dateTime = new Date(utcTime);
  return new Date(dateTime.getTime() + getTimezoneOffset(dateTime));
}

export function utcTimeToIsoDateString(utcTime: number) {
  return new Date(utcTime).toISOString().substring(0, 10);
}

export function utcTimeToIsoDateTimeString(utcTime: number) {
  return isoDateTimeStringToLabel(new Date(utcTime).toISOString());
}

export function isoDateTimeStringToLabel(utcDateTimeString: string) {
  return utcDateTimeString.substring(0, 19).replace("T", " ");
}

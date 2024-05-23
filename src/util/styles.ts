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

import { SxProps, Theme } from "@mui/system";

type RawStyles<S, T extends Theme = Theme> = Record<keyof S, SxProps<T>>;
type Styles<S extends object, T extends Theme = Theme> = {
  [P in keyof S]: SxProps<T>;
};

/**
 * Convert given styles object into its type-safe version
 * where `S` the type of the "raw" styles
 * and `T` is the MUI theme type.
 * @param rawStyles Object that maps a property key into an `SxProps` value.
 */
export function makeStyles<S extends object, T extends Theme = Theme>(
  rawStyles: RawStyles<S, T>,
): Styles<S, T> {
  return rawStyles;
}

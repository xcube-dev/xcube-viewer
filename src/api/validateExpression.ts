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

import { callApi } from "./callApi";
import { encodeDatasetId } from "@/model/encode";
import i18n from "@/i18n";

export async function validateExpression(
  apiServerUrl: string,
  datasetId: string,
  expression: string,
): Promise<string | null> {
  if (expression!.trim() === "") {
    return i18n.get("Must not be empty");
  }
  const url = `${apiServerUrl}/expressions/validate/${encodeDatasetId(datasetId)}/${encodeURIComponent(expression)}`;
  try {
    await callApi(url);
    return null;
  } catch (e) {
    const message = (e as Error).message;
    if (message) {
      const i1 = message.indexOf("(");
      const i2 = message.lastIndexOf(")");
      return message.slice(i1 >= 0 ? i1 + 1 : 0, i2 >= 0 ? i2 : message.length);
    }
    return i18n.get("Invalid expression");
  }
}

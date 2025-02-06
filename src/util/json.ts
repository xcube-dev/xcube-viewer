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

export type JsonPrimitive = null | boolean | number | string;
export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue };
export type JsonValue = JsonPrimitive | JsonArray | JsonObject;

const primitiveTypes = new Set(["boolean", "number", "string"]);

export function isJsonValue(value: unknown): value is JsonValue {
  return isJsonPrimitive(value) || isJsonArray(value) || isJsonObject(value);
}

export function isJsonPrimitive(value: unknown): value is JsonPrimitive {
  return value === null || primitiveTypes.has(typeof value);
}

export function isJsonArray(value: unknown): value is JsonArray {
  return (
    Array.isArray(value) &&
    value.every((v) => v === undefined || isJsonValue(v))
  );
}

export function isJsonObject(value: unknown): value is JsonObject {
  return (
    isRecord(value) &&
    Object.getOwnPropertyNames(value).every(
      (k) => value[k] === undefined || isJsonValue(value[k]),
    )
  );
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

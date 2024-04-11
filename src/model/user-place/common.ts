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

export interface Format {
  name: string;
  fileExt: string;
  checkError: (text: string) => string | null;
}

const WKT_GEOM_NAMES = [
  "Point",
  "LineString",
  "Polygon",
  "MultiPoint",
  "MultiLineString",
  "MultiPolygon",
  "GeometryCollection",
].map((k) => k.toLowerCase());

export function detectFormatName(text: string): "csv" | "geojson" | "wkt" {
  text = text.trim();
  if (text === "") {
    return "csv";
  }

  if (text[0] === "{") {
    return "geojson";
  }

  const marker = text.substr(0, 20).toLowerCase();
  const geomName = WKT_GEOM_NAMES.find(
    (geomName) =>
      marker.startsWith(geomName) &&
      (marker.length === geomName.length ||
        "\n\t (".indexOf(marker[geomName.length]) >= 0),
  );
  if (geomName) {
    return "wkt";
  }

  return "csv";
}

/**
 * Helper function that splits a comma-separated string into lower-case
 * name tokens.
 *
 * @param alternatives
 */
export function parseAlternativeNames(alternatives: string): string[] {
  return alternatives
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((name) => name !== "");
}

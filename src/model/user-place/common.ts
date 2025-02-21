/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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

  const marker = text.substring(0, 20).toLowerCase();
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

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

import { default as OlWktFormat } from "ol/format/WKT";
import { default as OlGeomPoint } from "ol/geom/Point";

import i18n from "@/i18n";
import { getUserPlaceColorName } from "@/config";
import { defaultParseOptions, parseCsv, ParseOptions } from "@/util/csv";
import { newUserPlace, newUserPlaceGroup, PlaceGroup } from "@/model/place";
import { Format, parseAlternativeNames } from "./common";

const checkError = (text: string): string | null => {
  if (text.trim() !== "") {
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
  name: "Text/CSV",
  fileExt: ".txt,.csv",
  checkError,
};

export interface CsvOptions extends ParseOptions {
  xNames: string;
  yNames: string;
  forceGeometry: boolean;
  geometryNames: string;
  timeNames: string;
  groupNames: string;
  groupPrefix: string;
  labelNames: string;
  labelPrefix: string;
}

export const defaultCsvOptions: CsvOptions = {
  ...defaultParseOptions,
  xNames: "longitude, lon, x",
  yNames: "latitude, lat, y",
  forceGeometry: false,
  geometryNames: "geometry, geom",
  timeNames: "time, date, datetime, date-time",
  groupNames: "group, cruise, station, type",
  groupPrefix: "Group-",
  labelNames: "label, name, title, id",
  labelPrefix: "Place-",
};

let LAST_PLACE_GROUP_ID_CSV = 0;
let LAST_PLACE_LABEL_ID_CSV = 0;

export function getUserPlacesFromCsv(
  text: string,
  options: CsvOptions,
): PlaceGroup[] {
  const table = parseCsv(text, options);
  if (table.length < 2) {
    throw new Error(i18n.get("Missing header line in CSV"));
  }

  for (const v of table[0]) {
    if (typeof v !== "string" || v === "") {
      throw new Error(i18n.get("Invalid header line in CSV"));
    }
  }

  const headerRow: string[] = table[0].map((v) => v as string);
  const headerRowLC = headerRow.map((v) => v.toLowerCase());
  const numColumns = headerRow.length;

  for (const row of table) {
    if (row.length !== numColumns) {
      throw new Error(i18n.get("All rows must have same length"));
    }
  }

  const columnNameToIndex = getColumnNameToIndex(headerRowLC);
  const groupNameIndex = findColumnIndex(columnNameToIndex, options.groupNames);
  const labelNameIndex = findColumnIndex(columnNameToIndex, options.labelNames);
  const timeNameIndex = findColumnIndex(columnNameToIndex, options.timeNames);
  const xNameIndex = findColumnIndex(columnNameToIndex, options.xNames);
  const yNameIndex = findColumnIndex(columnNameToIndex, options.yNames);
  let geometryNameIndex = findColumnIndex(
    columnNameToIndex,
    options.geometryNames,
  );
  const forceGeometry = options.forceGeometry;

  if (
    forceGeometry ||
    xNameIndex < 0 ||
    yNameIndex < 0 ||
    xNameIndex === yNameIndex
  ) {
    if (geometryNameIndex < 0) {
      throw new Error(i18n.get("No geometry column(s) found"));
    }
  } else {
    geometryNameIndex = -1;
  }

  let groupPrefix = options.groupPrefix.trim();
  if (groupPrefix === "") {
    groupPrefix = defaultCsvOptions.groupPrefix;
  }

  let labelPrefix = options.labelPrefix.trim();
  if (labelPrefix === "") {
    labelPrefix = defaultCsvOptions.labelPrefix;
  }

  let group: string = "";
  if (groupNameIndex === -1) {
    const groupId = ++LAST_PLACE_GROUP_ID_CSV;
    group = `${groupPrefix}${groupId}`;
  }

  const wktFormat = new OlWktFormat();

  const placeGroups: { [group: string]: PlaceGroup } = {};
  let rowIndex = 1;
  let numPlaceGroups = 0;
  let color = getUserPlaceColorName(0);
  for (; rowIndex < table.length; rowIndex++) {
    const dataRow = table[rowIndex];

    let time = "";
    if (timeNameIndex >= 0) {
      time = `${dataRow[timeNameIndex]}`;
    }

    if (groupNameIndex >= 0) {
      group = `${dataRow[groupNameIndex]}`;
    }

    let placeGroup = placeGroups[group];
    if (!placeGroup) {
      placeGroup = newUserPlaceGroup(group, []);
      placeGroups[group] = placeGroup;
      color = getUserPlaceColorName(numPlaceGroups);
      numPlaceGroups++;
    }

    let geometry = null;
    if (geometryNameIndex >= 0) {
      const wkt = dataRow[geometryNameIndex];
      if (typeof wkt === "string") {
        try {
          geometry = wktFormat.readGeometry(text);
        } catch (e) {
          // will handle error below
        }
      }
    } else {
      const x = dataRow[xNameIndex];
      const y = dataRow[yNameIndex];
      if (
        typeof x === "number" &&
        Number.isFinite(x) &&
        typeof y === "number" &&
        Number.isFinite(y)
      ) {
        geometry = new OlGeomPoint([x, y]);
      }
    }
    if (geometry === null) {
      throw new Error(i18n.get(`Invalid geometry in data row ${rowIndex}`));
    }

    const geoJsonProps: { [k: string]: number | string | boolean | null } = {};
    dataRow.forEach((propertyValue, index) => {
      if (
        index !== xNameIndex &&
        index !== yNameIndex &&
        index !== geometryNameIndex
      ) {
        const propertyName = headerRow[index];
        geoJsonProps[propertyName] = propertyValue;
      }
    });

    let label: string;
    if (labelNameIndex >= 0) {
      label = `${dataRow[labelNameIndex]}`;
    } else {
      const labelId = ++LAST_PLACE_LABEL_ID_CSV;
      label = `${labelPrefix}${labelId}`;
    }

    if (time !== "") geoJsonProps["time"] = time;
    if (!geoJsonProps["color"]) geoJsonProps["color"] = color;
    if (!geoJsonProps["label"]) geoJsonProps["label"] = label;
    if (!geoJsonProps["source"]) geoJsonProps["source"] = "CSV";

    placeGroup.features.push(newUserPlace(geometry, geoJsonProps));
  }

  return Object.getOwnPropertyNames(placeGroups).map(
    (group) => placeGroups[group],
  );
}

type ColumnNameToIndex = { [columnName: string]: number };

function getColumnNameToIndex(columnNames: string[]): ColumnNameToIndex {
  const indices: ColumnNameToIndex = {};
  for (let index = 0; index < columnNames.length; index++) {
    indices[columnNames[index].toLowerCase()] = index;
  }
  return indices;
}

function findColumnIndex(
  columnNameToIndex: ColumnNameToIndex,
  alternatives: string,
): number {
  const names = parseAlternativeNames(alternatives);
  for (const name of names) {
    const columnIndex: number | undefined = columnNameToIndex[name];
    // noinspection SuspiciousTypeOfGuard
    if (typeof columnIndex === "number") {
      return columnIndex;
    }
  }
  return -1;
}

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

import i18n from "@/i18n";
import { getUserPlaceColorName } from "@/config";
import { utcTimeToIsoDateTimeString } from "@/util/time";
import { newUserPlace, newUserPlaceGroup, PlaceGroup } from "@/model/place";
import { Format } from "./common";

// noinspection JSUnusedLocalSymbols
const checkError = (_text: string): string | null => {
  // TODO
  return null;
};

export const wktFormat: Format = {
  name: "WKT",
  fileExt: ".txt,.wkt",
  checkError,
};

export interface WktOptions {
  group: string;
  groupPrefix: string;
  label: string;
  labelPrefix: string;
  time: string;
}

export const defaultWktOptions: WktOptions = {
  group: "",
  groupPrefix: "Group-",
  label: "",
  labelPrefix: "Place-",
  time: utcTimeToIsoDateTimeString(new Date().getTime()),
};

let LAST_PLACE_GROUP_ID_WKT = 0;
let LAST_PLACE_LABEL_ID_WKT = 0;

export function getUserPlacesFromWkt(
  text: string,
  options: WktOptions,
): PlaceGroup[] {
  let groupPrefix = options.groupPrefix.trim();
  if (groupPrefix === "") {
    groupPrefix = defaultWktOptions.groupPrefix;
  }
  let group = options.group.trim();
  if (group === "") {
    const groupId = ++LAST_PLACE_GROUP_ID_WKT;
    group = `${groupPrefix}${groupId}`;
  }

  let labelPrefix = options.labelPrefix.trim();
  if (labelPrefix === "") {
    labelPrefix = defaultWktOptions.labelPrefix;
  }
  let label = options.label.trim();
  if (label === "") {
    const labelId = ++LAST_PLACE_LABEL_ID_WKT;
    label = `${labelPrefix}${labelId}`;
  }

  const time = options.time.trim();

  try {
    const geometry = new OlWktFormat().readGeometry(text);
    let geoJsonProps: Record<string, unknown> = {
      color: getUserPlaceColorName(Math.floor(1000 * Math.random())),
      label,
      source: "WKT",
    };
    if (time !== "") {
      geoJsonProps = { time, ...geoJsonProps };
    }
    const places = [newUserPlace(geometry, geoJsonProps)];
    return [newUserPlaceGroup(group, places)];
  } catch (e) {
    throw new Error(i18n.get(`Invalid Geometry WKT`));
  }
}

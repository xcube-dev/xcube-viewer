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

import {
  ColorBars,
  ColorBarGroup,
  CustomColorMap,
  CssColorRecord,
} from "@/model/colorBar";
import { callJsonApi } from "./callApi";
import { RGB, RGBA, rgbToHex } from "@/util/color";
import { isString } from "@/util/types";

export type RawColor = string | RGB | RGBA;
export type RawCustomColorRecord =
  | [number, RawColor]
  | [number, RawColor, string];

export type ColorMapType = "continuous" | "stepwise" | "categorical";

export interface RawCustomColorMap {
  name: string;
  type: ColorMapType;
  colors: RawCustomColorRecord[];
}

type RawColorBar = [string, string] | [string, string, RawCustomColorMap];
type RawColorBarGroup = [string, string, RawColorBar[]];
type RawColorBarGroups = RawColorBarGroup[];

export function getColorBars(apiServerUrl: string): Promise<ColorBars> {
  return callJsonApi(`${apiServerUrl}/colorbars`, parseColorBars);
}

function parseColorBars(colorBarGroups: RawColorBarGroups): ColorBars {
  const groups: ColorBarGroup[] = [];
  const images: Record<string, string> = {};
  const customColorMaps: Record<string, CustomColorMap> = {};
  colorBarGroups.forEach((colorBarGroup) => {
    const [title, description, colorBars] = colorBarGroup;
    const names: string[] = [];
    colorBars.forEach((colorBar) => {
      if (colorBar.length === 3) {
        const [name, image, customColorMap] = colorBar;
        names.push(name);
        images[name] = image;
        customColorMaps[name] = {
          name: customColorMap.name,
          type: customColorMap.type,
          colorRecords: customColorMap.colors.map(parseCustomColorRecord),
        };
      } else if (colorBar.length === 2) {
        const [name, image] = colorBar;
        names.push(name);
        images[name] = image;
      }
    });
    groups.push({ title, description, names });
  });
  return { groups, images, customColorMaps };
}

function parseCustomColorRecord(
  colorRecord: RawCustomColorRecord,
): CssColorRecord {
  const color = parseRawColor(colorRecord[1]);
  const value = colorRecord[0];
  if (colorRecord.length === 3) {
    const label = colorRecord[2];
    return { value, color, label };
  } else {
    return { value, color };
  }
}

function parseRawColor(color: RawColor): string {
  if (!color) {
    return "#000000";
  } else if (isString(color)) {
    return color;
  } else {
    return rgbToHex(color);
  }
}

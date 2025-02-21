/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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

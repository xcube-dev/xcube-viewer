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

import { CSSProperties } from "react";
import {
  amber,
  blue,
  blueGrey,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from "@mui/material/colors";
import { ColorPartial } from "@mui/material/styles/createPalette";
import { PaletteColorOptions } from "@mui/material/styles";
import baseUrl from "./baseurl";
import { buildPath } from "./path";

const COLOR_NAMES: { [name: string]: ColorPartial } = {
  amber,
  blue,
  blueGrey,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
};

// Align any changes made here with
// - resources/config.json
// - resources/config.schema.json
export interface Branding {
  appBarTitle: string;
  windowTitle: string;
  windowIcon: string | null;
  compact: boolean;
  themeName: "dark" | "light";
  primaryColor: PaletteColorOptions;
  secondaryColor: PaletteColorOptions;
  headerBackgroundColor?: string;
  headerTitleStyle?: CSSProperties;
  headerIconStyle?: CSSProperties;
  organisationUrl?: string;
  logoImage: string;
  logoWidth: number;
  baseMapUrl?: string;
  defaultAgg?: "median" | "mean";
  polygonFillOpacity?: number;
  mapProjection?: string;
  allowDownloads?: boolean;
  allowRefresh?: boolean;
  allowViewModePython?: boolean;
  allow3D?: boolean;
}

function setBrandingColor(
  brandingConfig: Record<string, unknown>,
  key: keyof Branding,
) {
  const rawColor = brandingConfig[key];
  let color: PaletteColorOptions | null = null;
  if (typeof rawColor === "string") {
    color = COLOR_NAMES[rawColor] || null;
    if (
      color === null &&
      rawColor.startsWith("#") &&
      (rawColor.length === 7 || rawColor.length === 9)
    ) {
      color = { main: rawColor };
    }
  } else if (typeof rawColor === "object" && rawColor !== null) {
    if ("main" in rawColor) {
      color = rawColor as unknown as PaletteColorOptions;
    }
  }
  if (color !== null) {
    brandingConfig[key] = color;
  } else {
    throw new Error(`Value of branding.${key} is invalid: ${rawColor}`);
  }
}

function setBrandingImage(
  brandingConfig: Record<string, unknown>,
  key: keyof Branding,
  configPath: string,
) {
  const imagePath = brandingConfig[key];
  if (typeof imagePath === "string") {
    brandingConfig[key] = buildPath(baseUrl.href, configPath, imagePath);
  }
}

export function parseBranding(
  brandingConfig: Record<string, unknown>,
  configPath: string,
): Branding {
  brandingConfig = { ...brandingConfig };
  setBrandingColor(brandingConfig, "primaryColor");
  setBrandingColor(brandingConfig, "secondaryColor");
  setBrandingImage(brandingConfig, "logoImage", configPath);
  return brandingConfig as unknown as Branding;
}

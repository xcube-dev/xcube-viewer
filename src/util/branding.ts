/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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
import { PaletteMode } from "@mui/material";
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
  themeMode?: PaletteMode | "system";
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
  allowSharing?: boolean;
  allowViewModePython?: boolean;
  allowUserVariables?: boolean;
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

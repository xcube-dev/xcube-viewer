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
import { LayerVisibilities } from "@/states/controlState";
import { LayerDefinition } from "@/model/layerDefinition";

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

export interface Layers {
  overlays?: LayerDefinition[];
  baseMaps?: LayerDefinition[];
}

// Align any changes made here with
// - resources/config.json
// - resources/config.schema.json
export interface Branding {
  appBarTitle: string;
  windowTitle?: string;
  windowIcon?: string;
  compact?: boolean;
  themeMode?: PaletteMode | "system";
  primaryColor?: PaletteColorOptions;
  secondaryColor?: PaletteColorOptions;
  headerBackgroundColor?: string;
  headerTitleStyle?: CSSProperties;
  headerIconStyle?: CSSProperties;
  organisationUrl?: string;
  logoImage: string;
  logoWidth: number;
  layers?: Layers;
  layerVisibilities?: LayerVisibilities;
  defaultAgg?: "median" | "mean";
  polygonFillOpacity?: number;
  mapProjection?: string;
  allowAboutPage?: boolean;
  allowDownloads?: boolean;
  allowRefresh?: boolean;
  allowSharing?: boolean;
  allowUserVariables?: boolean;
  allowViewModePython?: boolean;
  allow3D?: boolean;
  permalinkExpirationDays?: number;
  showZoomInfoBox?: boolean;
}

function setBrandingPaletteColor(
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
    brandingConfig[key] = undefined;
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
  setBrandingPaletteColor(brandingConfig, "primaryColor");
  setBrandingPaletteColor(brandingConfig, "secondaryColor");
  setBrandingImage(brandingConfig, "logoImage", configPath);
  return brandingConfig as unknown as Branding;
}

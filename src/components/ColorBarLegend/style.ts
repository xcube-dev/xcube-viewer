/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type { Theme } from "@mui/system";

export const legendThemeDark = {
  borderColor: "#3B3B3B",
};

export const legendThemeLight = {
  borderColor: "#E5E5E5",
};

export function getBorderColor(theme: Theme): string {
  const legendTheme =
    theme.palette.mode === "dark" ? legendThemeDark : legendThemeLight;
  return legendTheme.borderColor;
}

export function getBorderStyle(theme: Theme): string {
  return `1px solid ${getBorderColor(theme)}`;
}

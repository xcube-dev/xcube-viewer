/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { createTheme, type Theme } from "@mui/material";

const baseTheme = {
  typography: {
    fontSize: 12,
  },
};

export const lightTheme: Theme = createTheme({
  ...baseTheme,
  cssVariables: true,
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#00bc4e" },
    background: { default: "#ffffff" },
  },
});

export const darkTheme: Theme = createTheme({
  ...baseTheme,
  cssVariables: true,
  palette: {
    mode: "dark",
    primary: { main: "#39a6f2" },
    secondary: { main: "#20dc6e" },
    background: { default: "#2b2d30" },
  },
});

/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import { useTheme, GlobalStyles } from "@mui/material";

const scrollbarTheme = {
  size: "0.5rem",
  borderRadius: 0,
};

const stylesDark = {
  trackColor: "#222",
  thumbColor: "#666",
  thumbColorHover: "#444",
};

const stylesLight = {
  trackColor: "#eee",
  thumbColor: "#ccc",
  thumbColorHover: "#aaa",
};

const ScrollbarStyles: React.FC = () => {
  const theme = useTheme();
  const scrollbarStyles =
    theme.palette.mode === "dark" ? stylesDark : stylesLight;
  return (
    <GlobalStyles
      styles={{
        "::-webkit-scrollbar": {
          width: scrollbarTheme.size,
          height: scrollbarTheme.size,
        },
        "::-webkit-scrollbar-track": {
          backgroundColor: scrollbarStyles.trackColor,
          borderRadius: scrollbarTheme.borderRadius,
        },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: scrollbarStyles.thumbColor,
          borderRadius: scrollbarTheme.borderRadius,
          "&:hover": {
            backgroundColor: scrollbarStyles.thumbColorHover,
          },
        },
        "::-webkit-scrollbar-corner": {
          backgroundColor: scrollbarStyles.trackColor,
        },
      }}
    />
  );
};

export default ScrollbarStyles;

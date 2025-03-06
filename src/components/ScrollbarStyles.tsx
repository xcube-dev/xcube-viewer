/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import { useTheme, GlobalStyles } from "@mui/material";

const scrollbarTheme = {
  width: "0.5rem",
  borderRadius: 0,
};

const stylesDark = {
  trackColor: "#1f1f1f",
  thumbColor: "#666",
  thumbColorHover: "#444",
};

const stylesLight = {
  trackColor: "#fff",
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
          width: scrollbarTheme.width,
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
      }}
    />
  );
};

export default ScrollbarStyles;

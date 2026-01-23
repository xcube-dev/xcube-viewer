/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type { ReactNode } from "react";
import Box, { type BoxProps } from "@mui/material/Box";

export interface HoverVisibleBoxProps extends BoxProps {
  children: ReactNode;
  initialOpacity?: number;
}

const HoverVisibleBox = ({
  children,
  initialOpacity,
  sx,
  ...props
}: HoverVisibleBoxProps) => {
  return (
    <Box
      id="data-hover-invisible-box"
      {...props}
      sx={{
        ...sx,
        "&:hover > *": {
          opacity: 1,
          visibility: "visible",
        },
        "& > *": {
          opacity: initialOpacity || 0,
          visibility: !initialOpacity ? "hidden" : undefined,
          transition: "opacity 0.5s ease, visibility 0.5s ease",
        },
      }}
    >
      {children}
    </Box>
  );
};

export default HoverVisibleBox;

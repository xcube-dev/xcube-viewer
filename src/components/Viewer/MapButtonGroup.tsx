/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { CSSProperties, PropsWithChildren } from "react";
import { SxProps } from "@mui/material";
import Box from "@mui/material/Box";

const CONTAINER_STYLE: CSSProperties = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  zIndex: 1000,
};

interface MapButtonGroupProps {
  style?: CSSProperties;
  sx?: SxProps;
}

export default function MapButtonGroup({
  style,
  sx,
  children,
}: PropsWithChildren<MapButtonGroupProps>) {
  return (
    <Box
      className="ol-unselectable ol-control"
      sx={sx}
      style={style ? { ...CONTAINER_STYLE, ...style } : CONTAINER_STYLE}
    >
      {children}
    </Box>
  );
}

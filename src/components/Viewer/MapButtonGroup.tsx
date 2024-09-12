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

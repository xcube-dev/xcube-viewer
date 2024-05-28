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

import Box from "@mui/material/Box";

import { makeStyles } from "@/util/styles";
import useMouseDrag, { Point } from "@/hooks/useMouseDrag";

const styles = makeStyles({
  hor: (theme) => ({
    flex: "none",
    border: "none",
    outline: "none",
    width: "8px",
    minHeight: "100%",
    maxHeight: "100%",
    cursor: "col-resize",

    backgroundColor: theme.palette.mode === "dark" ? "white" : "black",
    opacity: 0.0,
  }),
  ver: (theme) => ({
    flex: "none",
    border: "none",
    outline: "none",
    height: "8px",
    minWidth: "100%",
    maxWidth: "100%",
    cursor: "row-resize",

    backgroundColor: theme.palette.mode === "dark" ? "white" : "black",
    opacity: 0.0,
  }),
});

export type SplitDir = "hor" | "ver";

interface SplitterProps {
  dir?: SplitDir;
  onChange: (delta: number) => void;
}

/**
 * A splitter component.
 * In order to work properly, clients must provide the onChange
 * which is a callback that receives the delta position either
 * in x-direction if direction is "hor" or y-direction if
 * direction is "ver". The callback must then adjust either
 * a container's width if direction is "hor" or its height
 * if direction is "ver".
 */
export default function Splitter({ dir, onChange }: SplitterProps) {
  const handleDrag = ([deltaX, _]: Point) => {
    onChange(deltaX);
  };
  const handleMouseDown = useMouseDrag(handleDrag);
  return (
    <Box
      sx={dir === "hor" ? styles.hor : styles.ver}
      onMouseDown={handleMouseDown}
    />
  );
}

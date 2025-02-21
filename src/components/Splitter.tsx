/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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

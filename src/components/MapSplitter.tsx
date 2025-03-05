/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";

import { isNumber } from "@/util/types";
import { makeStyles } from "@/util/styles";
import useMouseDrag from "@/hooks/useMouseDrag";

const styles = makeStyles({
  splitter: {
    position: "absolute",
    top: 0,
    left: "50%",
    width: "6px",
    height: "100%",
    backgroundColor: "#ffffff60",
    zIndex: 999,
    borderLeft: "0.5px solid #ffffffd0",
    borderRight: "0.5px solid #ffffffd0",
    cursor: "col-resize",
    boxShadow: "0px 0px 1px 0px black",
  },
});

type Point = [number, number];

interface MapSplitterProps {
  hidden?: boolean;
  position?: number;
  onPositionChange: (position: number) => void;
}

export default function MapSplitter({
  hidden,
  position,
  onPositionChange,
}: MapSplitterProps) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const handleDrag = useRef(([offsetX, _]: Point) => {
    if (divRef.current !== null) {
      onPositionChange(offsetX);
    }
  });
  const handleMouseDown = useMouseDrag(handleDrag.current);

  useEffect(() => {
    if (
      !hidden &&
      !isNumber(position) &&
      divRef.current !== null &&
      divRef.current!.parentElement !== null
    ) {
      onPositionChange(
        Math.round(divRef.current.parentElement.clientWidth / 2),
      );
    }
  }, [hidden, position, onPositionChange]);

  if (hidden) {
    return null;
  }

  return (
    <Box
      id={"MapSplitter"}
      ref={divRef}
      sx={styles.splitter}
      style={{ left: isNumber(position) ? position : "50%" }}
      onMouseDown={handleMouseDown}
    />
  );
}

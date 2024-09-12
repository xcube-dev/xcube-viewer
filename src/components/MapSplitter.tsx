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
  const handleDrag = useRef(([deltaX, _]: Point) => {
    if (divRef.current !== null) {
      onPositionChange(divRef.current.offsetLeft + deltaX);
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

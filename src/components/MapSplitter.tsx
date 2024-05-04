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

import React, { useRef } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { isNumber } from "@/util/types";

const useStyles = makeStyles({
  splitter: {
    position: "absolute",
    top: 0,
    left: "50%",
    width: "6px",
    height: "100%",
    background: "white",
    zIndex: 999,
    opacity: "50%",
    border: "1px solid yellow",
    cursor: "col-resize",
  },
});

type Point = [number, number];

function useMouseDrag(onMouseDrag: (delta: Point) => void) {
  const lastPosition = useRef<Point | null>(null);

  const handleMouseMove = useRef((event: MouseEvent) => {
    if (event.buttons === 1 && lastPosition.current !== null) {
      event.preventDefault();
      const { screenX, screenY } = event;
      const [lastScreenX, lastScreenY] = lastPosition.current;
      const delta: Point = [screenX - lastScreenX, screenY - lastScreenY];
      lastPosition.current = [screenX, screenY];
      onMouseDrag(delta);
    }
  });

  // Return value
  const startDrag = useRef((event: React.MouseEvent) => {
    if (event.buttons === 1) {
      event.preventDefault();
      document.body.addEventListener("mousemove", handleMouseMove.current);
      document.body.addEventListener("mouseup", endDrag.current);
      document.body.addEventListener("onmouseleave", endDrag.current);
      lastPosition.current = [event.screenX, event.screenY];
    }
  });

  const endDrag = useRef((event: Event) => {
    if (lastPosition.current !== null) {
      event.preventDefault();
      lastPosition.current = null;
      document.body.removeEventListener("mousemove", handleMouseMove.current);
      document.body.removeEventListener("mouseup", endDrag.current);
      document.body.removeEventListener("onmouseleave", endDrag.current);
    }
  });

  return startDrag.current;
}

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
  const classes = useStyles();
  const divRef = useRef<HTMLDivElement | null>(null);
  const handleDrag = useRef(([deltaX, _]: Point) => {
    if (divRef.current !== null) {
      onPositionChange(divRef.current.offsetLeft + deltaX);
    }
  });
  const startDrag = useMouseDrag(handleDrag.current);

  if (hidden) {
    return null;
  }

  return (
    <div
      id={"MapSplitter"}
      ref={divRef}
      className={classes.splitter}
      style={{ left: isNumber(position) ? position : "50%" }}
      onMouseDown={startDrag}
    />
  );
}

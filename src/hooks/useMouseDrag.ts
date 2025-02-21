/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React, { useRef } from "react";

export type Point = [number, number];

export default function useMouseDrag(onMouseDrag: (delta: Point) => void) {
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
  const handleMouseDown = useRef((event: React.MouseEvent) => {
    if (event.buttons === 1) {
      event.preventDefault();
      document.body.addEventListener("mousemove", handleMouseMove.current);
      document.body.addEventListener("mouseup", handleEndDrag.current);
      document.body.addEventListener("onmouseleave", handleEndDrag.current);
      lastPosition.current = [event.screenX, event.screenY];
    }
  });

  const handleEndDrag = useRef((event: Event) => {
    if (lastPosition.current !== null) {
      event.preventDefault();
      lastPosition.current = null;
      document.body.removeEventListener("mousemove", handleMouseMove.current);
      document.body.removeEventListener("mouseup", handleEndDrag.current);
      document.body.removeEventListener("onmouseleave", handleEndDrag.current);
    }
  });

  return handleMouseDown.current;
}

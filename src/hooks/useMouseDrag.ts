/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React, { useCallback, useEffect, useMemo, useRef } from "react";
// import { throttleWithRAF } from "@/util/throttle";

/**
 * A hook that takes an `onMouseDrag` handler that reports resize events
 * and returns an `onMouseDown(e: React.MouseEvent) => void` handler which
 * can be attached to components.
 *
 * @param onMouseDrag A mouse drag handler, typically memoized.
 * @returns onMouseDown A mouse handler, stable with respect to `onMouseDrag`.
 */
export default function useMouseDrag(
  onMouseDrag: (offset: [number, number]) => void,
) {
  const onMouseDragRef = useRef(onMouseDrag);
  useEffect(() => {
    onMouseDragRef.current = onMouseDrag;
  }, [onMouseDrag]);

  const firstPosRef = useRef<[number, number] | null>(null);

  const _handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (event.buttons === 1 && firstPosRef.current !== null) {
        event.preventDefault();
        const { clientX, clientY } = event;
        const [firstPosX, firstPosY] = firstPosRef.current;
        onMouseDrag([clientX - firstPosX, clientY - firstPosY]);
      }
    },
    [onMouseDrag],
  );

  const handleMouseMove = useMemo(
    // () => throttleWithRAF(_handleMouseMove),
    () => _handleMouseMove,
    [_handleMouseMove],
  );

  // Return value
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (event.buttons === 1) {
        event.preventDefault();
        firstPosRef.current = [event.clientX, event.clientY];
        const handleEndDrag = handleEndDragRef.current;
        document.body.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseup", handleEndDrag);
        document.body.addEventListener("onmouseleave", handleEndDrag);
      }
    },
    [handleMouseMove],
  );

  const handleEndDrag = useCallback(
    (event: Event) => {
      if (firstPosRef.current !== null) {
        event.preventDefault();
        firstPosRef.current = null;
        const handleEndDrag = handleEndDragRef.current;
        document.body.removeEventListener("mousemove", handleMouseMove);
        document.body.removeEventListener("mouseup", handleEndDrag);
        document.body.removeEventListener("onmouseleave", handleEndDrag);
      }
    },
    [handleMouseMove],
  );

  const handleEndDragRef = useRef<(event: Event) => void>(() => {});
  useEffect(() => {
    handleEndDragRef.current = handleEndDrag;
  }, [handleEndDrag]);

  return handleMouseDown;
}

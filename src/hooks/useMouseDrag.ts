/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { throttle } from "@/util/throttle";

export interface DragOptions {
  onDragStart?: (event: React.MouseEvent) => void;
  onDragMove?: (deltaSize: [number, number], event: MouseEvent) => void;
  onDragEnd?: (event: MouseEvent) => void;
}

/**
 * A hook that uses given drag handlers and returns
 * an `onMouseDown(e: React.MouseEvent) => void` handler which
 * can be attached to components.
 *
 * The given `onDragStart` and `onDragEnd` handlers are used to
 * report current delta sizes in pixels with respect to pixel
 * position when the pointer started dragging.
 *
 * @param onDragStart A drag-start handler, typically memoized.
 * @param onDragMove A drag-move handler, typically memoized.
 * @param onDragEnd A drag-end handler, typically memoized.
 * @returns onMouseDown A mouse handler, stable with respect
 *   to the passed handlers.
 */
export default function useMouseDrag({
  onDragStart,
  onDragMove,
  onDragEnd,
}: DragOptions) {
  const firstPosRef = useRef<[number, number] | null>(null);

  const onDragMoveRef = useRef(onDragMove);
  useEffect(() => {
    onDragMoveRef.current = onDragMove;
  }, [onDragMove]);

  const _handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (event.buttons === 1 && firstPosRef.current !== null) {
        event.preventDefault();
        if (onDragMove) {
          const { clientX, clientY } = event;
          const [firstPosX, firstPosY] = firstPosRef.current;
          onDragMove([clientX - firstPosX, clientY - firstPosY], event);
        }
      }
    },
    [onDragMove],
  );

  const handleMouseMove = useMemo(
    () => throttle(_handleMouseMove),
    [_handleMouseMove],
  );

  // Return value
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (event.buttons === 1) {
        console.info("handleMouseDown!");
        event.preventDefault();
        firstPosRef.current = [event.clientX, event.clientY];
        const _handleEndDrag = handleEndDragRef.current;
        document.body.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseup", _handleEndDrag);
        if (onDragStart) {
          onDragStart(event);
        }
      }
    },
    [onDragStart, handleMouseMove],
  );

  const handleEndDrag = useCallback(
    (event: MouseEvent) => {
      if (firstPosRef.current !== null) {
        console.info("handleEndDrag!");
        event.preventDefault();
        firstPosRef.current = null;
        const _handleEndDrag = handleEndDragRef.current;
        document.body.removeEventListener("mousemove", handleMouseMove);
        document.body.removeEventListener("mouseup", _handleEndDrag);
        if (onDragEnd) {
          onDragEnd(event);
        }
      }
    },
    [onDragEnd, handleMouseMove],
  );

  const handleEndDragRef = useRef<(event: MouseEvent) => void>(() => {});
  useEffect(() => {
    handleEndDragRef.current = handleEndDrag;
  }, [handleEndDrag]);

  return handleMouseDown;
}

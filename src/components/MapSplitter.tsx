/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useCallback, useEffect, useRef } from "react";

import { isNumber } from "@/util/types";
import useMouseDrag from "@/hooks/useMouseDrag";
import { makeCssStyles } from "@/util/styles";

const styles = makeCssStyles({
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
  updatePosition: (size: number, isDelta?: boolean) => void;
}

export default function MapSplitter({
  hidden,
  position,
  updatePosition,
}: MapSplitterProps) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const onDragMove = useCallback(
    ([offsetX, _]: Point) => {
      updatePosition(offsetX, true);
    },
    [updatePosition],
  );
  const handleMouseDown = useMouseDrag({ onDragMove });

  useEffect(() => {
    if (
      !hidden &&
      !isNumber(position) &&
      divRef.current !== null &&
      divRef.current!.parentElement !== null
    ) {
      updatePosition(Math.round(divRef.current.parentElement.clientWidth / 2));
    }
  }, [hidden, position, updatePosition]);

  if (hidden) {
    return null;
  }

  return (
    <div
      id={"MapSplitter"}
      ref={divRef}
      style={{
        ...styles.splitter,
        left: isNumber(position) ? position : "50%",
      }}
      onMouseDown={handleMouseDown}
    />
  );
}

/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { CSSProperties, useCallback, useEffect, useRef } from "react";

import { isNumber } from "@/util/types";
import useMouseDrag from "@/hooks/useMouseDrag";

const styles: Record<string, CSSProperties> = {
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
};

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
  const handleDrag = useCallback(
    ([offsetX, _]: Point) => {
      if (isNumber(position) && divRef.current !== null) {
        onPositionChange(position + offsetX);
      }
    },
    [position, onPositionChange],
  );
  const handleMouseDown = useMouseDrag(handleDrag);

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

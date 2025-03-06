/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { CSSProperties, useCallback, useMemo } from "react";
import useMouseDrag from "@/hooks/useMouseDrag";
import { isNumber } from "@/util/types";

const defaultHandleSize = "8px";

const containerStyle: CSSProperties = {
  // Important: requires a parent with position: "relative"
  position: "absolute",
  // background: "yellow",
  // opacity: 0.5,
  opacity: 0.0,
  zIndex: 999,
};

const styles: Record<string, CSSProperties> = {
  hor: {
    ...containerStyle,
    top: 0,
    width: defaultHandleSize,
    height: "100%",
    cursor: "col-resize",
  },
  ver: {
    ...containerStyle,
    left: 0,
    width: "100%",
    height: defaultHandleSize,
    cursor: "row-resize",
  },
};

export type SplitDir = "hor" | "ver";

interface SplitterProps {
  dir?: SplitDir;
  splitPos?: number;
  onChange: (delta: number) => void;
}

/**
 * A splitter component.
 *
 * In order to work properly, clients must provide the onChange
 * which is a callback that receives the delta position either
 * in x-direction if direction is "hor" or y-direction if
 * direction is "ver". The callback must then adjust either
 * a container's width if direction is "hor" or its height
 * if direction is "ver".
 *
 * The style of this component's parent container must
 * have `position: "relative"` in order to work properly
 * as `Splitter` uses absolute positioning.
 */
export default function Splitter({ dir, splitPos, onChange }: SplitterProps) {
  const handleDrag = useCallback(
    (offset: [number, number]) => {
      if (isNumber(splitPos)) {
        onChange(splitPos + (dir === "hor" ? offset[0] : offset[1]));
      }
    },
    [splitPos, dir, onChange],
  );
  const handleMouseDown = useMouseDrag(handleDrag);
  const style = useMemo(
    () =>
      dir === "hor"
        ? { ...styles.hor, left: splitPos }
        : { ...styles.ver, top: splitPos },
    [dir, splitPos],
  );
  return <div id={"Splitter"} style={style} onMouseDown={handleMouseDown} />;
}

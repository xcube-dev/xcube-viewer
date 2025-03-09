/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React, {
  type CSSProperties,
  type PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
} from "react";

import { makeCssStyles } from "@/util/styles";
import useMouseDrag from "@/hooks/useMouseDrag";

const containerStyle: CSSProperties = {
  display: "flex",
};

const child1Style: CSSProperties = {};

const child2Style: CSSProperties = {
  // Important, because resize handle uses "absolute"
  position: "relative",
};

const resizeHandleSize = "8px";

const resizeHandleStyle: CSSProperties = {
  // Important: requires a child 2 with position: "relative"
  position: "absolute",
  background: "yellow",
  opacity: 0.5,
  zIndex: 999,
  top: 0,
  left: 0,
};

// noinspection JSUnusedLocalSymbols
const stylesHor = makeCssStyles({
  container: {
    ...containerStyle,
    flexFlow: "row nowrap",
  },
  resizeHandle: {
    ...resizeHandleStyle,
    width: resizeHandleSize,
    height: "100%",
    cursor: "col-resize",
  },
  child1: {
    ...child1Style,
    height: "100%",
  },
  child2: {
    ...child2Style,
    height: "100%",
  },
});

const stylesVer = makeCssStyles({
  container: {
    ...containerStyle,
    flexFlow: "column nowrap",
  },
  resizeHandle: {
    ...resizeHandleStyle,
    width: "100%",
    height: resizeHandleSize,
    cursor: "row-resize",
  },
  child1: {
    ...child1Style,
    width: "100%",
  },
  child2: {
    ...child2Style,
    width: "100%",
  },
});

export interface SplitPaneProps {
  dir: "hor" | "ver";
  childPos?: "first" | "last";
  childSize: number;
  setChildSize: (childSize: number) => void;
  style?: CSSProperties;
  children: React.ReactNode[];
}

/**
 * A simple resizeable SplitPane component,
 * which must have exactly two child elements.
 */
export default function SplitPane({
  dir,
  childPos,
  childSize,
  setChildSize,
  children,
  style,
}: PropsWithChildren<SplitPaneProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const child1Ref = useRef<HTMLDivElement>(null);

  const isFirst = !childPos || childPos === "first";

  // The handler for drag-move events
  const onDragMove = useCallback(
    ([deltaX, deltaY]: [number, number]) => {
      const sizeDelta = dir === "hor" ? deltaX : deltaY;
      const newChildSize = childSize + (isFirst ? sizeDelta : -sizeDelta);
      setChildSize(newChildSize);
      // console.info("onDragMove", newSplitPosition);
    },
    [dir, isFirst, childSize, setChildSize],
  );

  // The handler for a mouse-down event
  const handleMouseDown = useMouseDrag({ onDragMove });

  // Use splitPosition or defaults to set child sizes
  const computedStyles = useMemo(() => {
    const styles = dir === "hor" ? stylesHor : stylesVer;
    const size1 = `${childSize}px`;
    const size2 = `calc(100% - ${childSize}px)`;
    const child1Size = isFirst ? size1 : size2;
    const child2Size = isFirst ? size2 : size1;
    return {
      ...styles,
      container: { ...styles.container, ...style },
      child1: {
        ...styles.child1,
        ...(dir === "hor" ? { width: child1Size } : { height: child1Size }),
      },
      child2: {
        ...styles.child2,
        ...(dir === "hor" ? { width: child2Size } : { height: child2Size }),
      },
    };
  }, [style, dir, isFirst, childSize]);
  //console.log("computedStyles", computedStyles);

  // Render only 2 children
  if (!children || !Array.isArray(children) || children.length !== 2) {
    return null;
  }

  return (
    <div
      id="SplitPane-Container"
      style={computedStyles.container}
      ref={containerRef}
    >
      <div id="SplitPane-Child1" style={computedStyles.child1} ref={child1Ref}>
        {children[0]}
      </div>
      <div id="SplitPane-Child2" style={computedStyles.child2}>
        <div
          id="SplitPane-ResizeHandle"
          style={computedStyles.resizeHandle}
          onMouseDown={handleMouseDown}
        />
        {children[1]}
      </div>
    </div>
  );
}

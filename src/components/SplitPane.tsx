/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React, {
  type CSSProperties,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { isNumber } from "@/util/types";
import { makeCssStyles } from "@/util/styles";
import useMouseDrag from "@/hooks/useMouseDrag";
import useResizeObserver, { type Size } from "@/hooks/useResizeObserver";

const defaultChild1Size = 66;

const containerStyle: CSSProperties = {
  display: "flex",
};

const child1Style: CSSProperties = {
  //flexGrow: 0,
};

const child2Style: CSSProperties = {
  // Important, because resize handle uses "absolute"
  position: "relative",
  //flexGrow: 1,
};

const resizeHandleSize = "8px";

const resizeHandleStyle: CSSProperties = {
  // Important: requires a parent with position: "relative"
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
  splitPosition?: number | null;
  setSplitPosition: (splitPosition: number) => void;
  style?: CSSProperties;
  children: React.ReactNode[];
}

/**
 * A simple resizeable SplitPane component,
 * which must have exactly two child elements.
 */
export default function SplitPane({
  dir,
  splitPosition,
  setSplitPosition,
  children,
  style,
}: PropsWithChildren<SplitPaneProps>) {
  const containerSizeRef = useRef<Size | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const child1Ref = useRef<HTMLDivElement>(null);

  // If the container resizes, save the last size so we
  // can use it when dragging starts
  useResizeObserver((containerSize) => {
    // console.log("containerSize", containerSize);
    containerSizeRef.current = containerSize;
  }, containerRef);

  // Make sure we receive splitPosition as a number
  useEffect(() => {
    const child1Element = child1Ref.current;
    if (!isNumber(splitPosition) && child1Element) {
      const clientRect = child1Element.getBoundingClientRect();
      setSplitPosition(dir === "hor" ? clientRect.width : clientRect.height);
    }
  }, [dir, splitPosition, setSplitPosition]);

  // Use splitPosition or defaults to set child sizes
  const computedStyles = useMemo(() => {
    const styles = dir === "hor" ? stylesHor : stylesVer;
    let child1Size: number | string;
    let child2Size: number | string;
    if (isNumber(splitPosition)) {
      const containerElement = containerRef.current;
      if (containerElement) {
        const containerSize =
          dir === "hor"
            ? containerElement.clientWidth
            : containerElement.clientWidth;
        const percent = 100 * (splitPosition / containerSize);
        child1Size = `${percent}%`;
        child2Size = `${100 - percent}%`;
      } else {
        child1Size = `${splitPosition}px`;
        child2Size = `calc(100% - ${child1Size})`;
      }
    } else {
      child1Size = `${defaultChild1Size}%`;
      child2Size = `${100 - defaultChild1Size}%`;
    }
    containerSizeRef.current = null;
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
  }, [style, dir, splitPosition]);
  console.log("computedStyles", computedStyles);

  // The handler for mouse-drag events
  const handleMouseDrag = useCallback(
    (offset: [number, number]) => {
      const sizeDelta = dir === "hor" ? offset[0] : offset[1];
      if (containerSizeRef.current) {
        const containerSize =
          dir === "hor"
            ? containerSizeRef.current.width
            : containerSizeRef.current.height;
        containerSizeRef.current = null;
        setSplitPosition(containerSize + sizeDelta);
      } else if (isNumber(splitPosition)) {
        setSplitPosition(splitPosition + sizeDelta);
      }
    },
    [dir, splitPosition, setSplitPosition],
  );

  // The handler for a mouse-down event
  const handleMouseDown = useMouseDrag(handleMouseDrag);

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

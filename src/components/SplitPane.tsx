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

import { isNumber } from "@/util/types";
import { makeCssStyles } from "@/util/styles";
import useMouseDrag from "@/hooks/useMouseDrag";

const defaultChild1Size = 66;

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
  const containerRef = useRef<HTMLDivElement>(null);
  const child1Ref = useRef<HTMLDivElement>(null);

  // The handler for drag-start events
  const onDragStart = useCallback(() => {
    if (child1Ref.current) {
      const rect = child1Ref.current.getBoundingClientRect();
      const newSplitPosition = dir === "hor" ? rect.width : rect.height;
      setSplitPosition(newSplitPosition);
      console.info("onDragStart", newSplitPosition);
    }
  }, [dir, setSplitPosition]);

  // The handler for drag-move events
  const onDragMove = useCallback(
    (_sizeDelta: [number, number]) => {
      const sizeDelta = dir === "hor" ? _sizeDelta[0] : _sizeDelta[1];
      if (isNumber(splitPosition) && sizeDelta !== 0) {
        const newSplitPosition = splitPosition + sizeDelta;
        setSplitPosition(newSplitPosition);
        console.info("onDragMove", newSplitPosition);
      }
    },
    [dir, splitPosition, setSplitPosition],
  );

  // The handler for a mouse-down event
  const handleMouseDown = useMouseDrag({ onDragStart, onDragMove });

  // Use splitPosition or defaults to set child sizes
  const computedStyles = useMemo(() => {
    const styles = dir === "hor" ? stylesHor : stylesVer;
    let child1Size: string;
    let child2Size: string;
    if (isNumber(splitPosition)) {
      const containerElement = containerRef.current;
      if (containerElement) {
        const rect = containerElement.getBoundingClientRect();
        const containerSize = dir === "hor" ? rect.width : rect.height;
        const percent = 100 * crop(splitPosition / containerSize);
        child1Size = `${percent}%`;
        child2Size = `${100 - percent}%`;
      } else {
        child1Size = `${splitPosition}px`;
        child2Size = `calc(100% - ${splitPosition}px)`;
      }
    } else {
      child1Size = `${defaultChild1Size}%`;
      child2Size = `${100 - defaultChild1Size}%`;
    }
    console.info("computed sizes:", child1Size, child2Size);
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

function crop(x: number, min = 0, max = 1) {
  return x < min ? min : x > max ? max : x;
}

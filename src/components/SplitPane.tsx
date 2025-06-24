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
import type { SystemStyleObject, Theme } from "@mui/system";
import Box from "@mui/material/Box";

import { makeStyles } from "@/util/styles";
import useMouseDrag from "@/hooks/useMouseDrag";

const resizeHandleSize = "8px";

const commonStyles = makeStyles({
  container: {
    display: "flex",
  },
  resizeHandle: (theme) => ({
    // Important: requires a child 2 with position: "relative"
    position: "absolute",
    opacity: 0.0,
    zIndex: 999,
    top: 0,
    left: 0,
    transition: "background 0.3s ease, opacity 0.3s ease",
    "&:hover": {
      background: theme.palette.mode === "dark" ? "#FFF" : "#000",
      opacity: 0.25,
    },
  }),
  child1: {},
  child2: {
    // Important, because resize handle uses "absolute"
    position: "relative",
  },
});

// noinspection JSUnusedLocalSymbols
const stylesHor = makeStyles({
  container: {
    ...commonStyles.container,
    flexFlow: "row nowrap",
  },
  resizeHandle: (theme: Theme) => ({
    ...(
      commonStyles.resizeHandle as (theme: Theme) => SystemStyleObject<Theme>
    )(theme),
    width: resizeHandleSize,
    height: "100%",
    cursor: "col-resize",
  }),
  child1: {
    ...commonStyles.child1,
    height: "100%",
  },
  child2: {
    ...commonStyles.child2,
    height: "100%",
  },
});

const stylesVer = makeStyles({
  container: {
    ...commonStyles.container,
    flexFlow: "column nowrap",
  },
  resizeHandle: (theme: Theme) => ({
    ...(
      commonStyles.resizeHandle as (theme: Theme) => SystemStyleObject<Theme>
    )(theme),
    width: "100%",
    height: resizeHandleSize,
    cursor: "row-resize",
  }),
  child1: {
    ...commonStyles.child1,
    width: "100%",
  },
  child2: {
    ...commonStyles.child2,
    width: "100%",
  },
});

export interface SplitPaneProps {
  dir: "hor" | "ver";
  childPos?: "first" | "last";
  childSize: number;
  updateChildSize: (childSize: number) => void;
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
  updateChildSize,
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
      updateChildSize(isFirst ? sizeDelta : -sizeDelta);
    },
    [dir, isFirst, updateChildSize],
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
    return makeStyles({
      ...styles,
      container: styles.container,
      child1: {
        ...styles.child1,
        ...(dir === "hor" ? { width: child1Size } : { height: child1Size }),
      },
      child2: {
        ...styles.child2,
        ...(dir === "hor" ? { width: child2Size } : { height: child2Size }),
      },
    });
  }, [dir, isFirst, childSize]);

  // Render only 2 children
  if (!children || !Array.isArray(children) || children.length !== 2) {
    return null;
  }

  return (
    <Box
      id="SplitPane-Container"
      sx={computedStyles.container}
      ref={containerRef}
      style={style}
    >
      <Box id="SplitPane-Child1" sx={computedStyles.child1} ref={child1Ref}>
        {children[0]}
      </Box>
      <Box id="SplitPane-Child2" sx={computedStyles.child2}>
        <Box
          id="SplitPane-ResizeHandle"
          sx={computedStyles.resizeHandle}
          onMouseDown={handleMouseDown}
        />
        {children[1]}
      </Box>
    </Box>
  );
}

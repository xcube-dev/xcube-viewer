/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React, {
  CSSProperties,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
} from "react";

import Splitter, { SplitDir } from "./Splitter";
import { isNumber } from "@/util/types";
import { makeCssStyles } from "@/util/styles";

const defaultSplitPosition = "66%";

const containerStyle: CSSProperties = {
  // Important, because Splitter uses "absolute"
  position: "relative",
  display: "flex",
};

// noinspection JSUnusedLocalSymbols
const stylesHor = makeCssStyles({
  container: {
    ...containerStyle,
    flexFlow: "row nowrap",
    height: "100%",
  },
  child1: {},
  child2: {
    flex: 1,
  },
});

const stylesVer = makeCssStyles({
  container: {
    ...containerStyle,
    flexFlow: "column nowrap",
    width: "100%",
  },
  child1: {},
  child2: {
    flex: 1,
  },
});

export interface SplitPaneProps {
  dir: SplitDir;
  splitPosition?: number | null;
  setSplitPosition: (splitPosition: number) => void;
  style?: CSSProperties;
  children: React.ReactNode[];
}

/**
 * A simple SplitPane component which must have exactly two child elements.
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
  const splitPos = isNumber(splitPosition)
    ? splitPosition
    : defaultSplitPosition;
  useEffect(() => {
    const child1Element = child1Ref.current;
    if (!isNumber(splitPosition) && child1Element !== null) {
      const clientRect = child1Element.getBoundingClientRect();
      setSplitPosition(dir === "hor" ? clientRect.width : clientRect.height);
    }
  }, [dir, splitPosition, setSplitPosition]);
  const computedStyles = useMemo(() => {
    const styles = dir === "hor" ? stylesHor : stylesVer;
    const containerElement = containerRef.current;
    let splitSize: number | string = splitPos;
    if (containerElement && isNumber(splitPos)) {
      const clientRect = containerElement.getBoundingClientRect();
      const percent =
        100 *
        (dir === "hor"
          ? splitPos / clientRect.width
          : splitPos / clientRect.height);
      splitSize = `${percent}%`;
    }
    console.log("splitSize:", splitSize);
    return {
      container: { ...styles.container, ...style },
      child1: {
        ...styles.child1,
        ...(dir === "hor" ? { width: splitSize } : { height: splitSize }),
      },
      child2: {
        ...styles.child2,
        //...(dir === "hor"
        //  ? { width: `calc(100% - ${splitPos}px)` }
        //  : { height: `calc(100% - ${splitPos}px)` }),
      },
    };
  }, [style, dir, splitPos]);
  if (!children || !Array.isArray(children) || children.length !== 2) {
    return null;
  }
  return (
    <div id="SplitPane" style={computedStyles.container} ref={containerRef}>
      <div id="SplitPane-Child-1" style={computedStyles.child1} ref={child1Ref}>
        {children[0]}
      </div>
      {isNumber(splitPos) && (
        <Splitter dir={dir} splitPos={splitPos} onChange={setSplitPosition} />
      )}
      <div id="SplitPane-Child-2" style={computedStyles.child2}>
        {children[1]}
      </div>
    </div>
  );
}

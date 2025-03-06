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

const defaultSplitPosition = "66%";

const containerStyle: CSSProperties = {
  // Important, because Splitter uses "absolute"
  position: "relative",
  display: "flex",
};

// noinspection JSUnusedLocalSymbols
const stylesHor: Record<string, CSSProperties> = {
  container: {
    ...containerStyle,
    flexFlow: "row nowrap",
    height: "100%",
  },
  child1: {},
  child2: {
    flex: 1,
  },
};

const stylesVer: Record<string, CSSProperties> = {
  container: {
    ...containerStyle,
    flexFlow: "column nowrap",
    width: "100%",
  },
  child1: {},
  child2: {
    flex: 1,
  },
};

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
  const child1Ref = useRef<HTMLDivElement>(null);
  const splitPos = isNumber(splitPosition)
    ? splitPosition
    : defaultSplitPosition;
  useEffect(() => {
    if (!isNumber(splitPosition) && child1Ref.current !== null) {
      const clientRect = child1Ref.current.getBoundingClientRect();
      setSplitPosition(dir === "hor" ? clientRect.width : clientRect.height);
    }
  }, [dir, splitPosition, setSplitPosition]);
  const computedStyles = useMemo(() => {
    const styles = dir === "hor" ? stylesHor : stylesVer;
    return {
      container: { ...styles.container, ...style },
      child1: {
        ...styles.child1,
        ...(dir === "hor" ? { width: splitPos } : { height: splitPos }),
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
    <div id="SplitPane" style={computedStyles.container}>
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

/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React, {
  CSSProperties,
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
} from "react";

import Splitter, { SplitDir } from "./Splitter";
import { isNumber, isString } from "@/util/types";

// noinspection JSUnusedLocalSymbols
const stylesHor: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    flexFlow: "row nowrap",
    height: "100%",
    boxSizing: "border-box",
  },
  child1: {
    width: "50%",
  },
  child2: {
    flex: 1,
  },
};

const stylesVer: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    flexFlow: "column nowrap",
    width: "100%",
    boxSizing: "border-box",
  },
  child1: {
    height: "50%",
  },
  child2: {
    flex: 1,
  },
};

export interface SplitPaneProps {
  dir: SplitDir;
  splitPosition?: number | null;
  setSplitPosition: (splitPosition: number) => void;
  defaultSplitPosition?: number | string;
  style?: CSSProperties;
  children: React.ReactNode[];
  debug?: boolean;
}

/**
 * A simple SplitPane component which must have exactly two child elements.
 */
export default function SplitPane({
  dir,
  splitPosition,
  setSplitPosition,
  defaultSplitPosition,
  children,
  style,
  debug,
}: PropsWithChildren<SplitPaneProps>) {
  const child1Ref = useRef<HTMLDivElement | null>(null);

  const styles = dir === "hor" ? stylesHor : stylesVer;

  let splitSize: string | number;
  if (isNumber(splitPosition)) {
    splitSize = splitPosition;
  } else if (isNumber(defaultSplitPosition) || isString(defaultSplitPosition)) {
    splitSize = defaultSplitPosition;
  } else {
    splitSize = "66%";
  }

  const child1SizeStyle: CSSProperties = useMemo(
    () => (dir === "hor" ? { width: splitSize } : { height: splitSize }),
    [dir, splitSize],
  );

  const handleSplitChange = useCallback(
    (splitPosition: number) => {
      const divElement = child1Ref.current;
      if (divElement) {
        setSplitPosition(splitPosition);
      }
    },
    [setSplitPosition],
  );

  if (!children || !Array.isArray(children) || children.length !== 2) {
    return null;
  }

  return (
    <div id="SplitPane" style={{ ...styles.container, ...style }}>
      <div
        ref={child1Ref}
        id="SplitPane-Child-1"
        style={{
          background: debug ? "lightblue" : undefined,
          ...styles.child1,
          ...child1SizeStyle,
        }}
      >
        {children[0]}
      </div>
      <Splitter dir={dir} onChange={handleSplitChange} />
      <div
        id="SplitPane-Child-2"
        style={{
          background: debug ? "lightcoral" : undefined,
          ...styles.child2,
        }}
      >
        {children[1]}
      </div>
    </div>
  );
}

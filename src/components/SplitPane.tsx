/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React, { CSSProperties, PropsWithChildren, useRef } from "react";

import Splitter, { SplitDir } from "./Splitter";

// noinspection JSUnusedLocalSymbols
const styles: Record<string, CSSProperties> = {
  hor: {
    display: "flex",
    flexFlow: "row nowrap",
    flex: "auto", // same as "flex: 1 1 auto;"
    boxSizing: "border-box",
  },
  ver: {
    height: "100%",
    display: "flex",
    flexFlow: "column nowrap",
    flex: "auto", // same as "flex: 1 1 auto;"
    boxSizing: "border-box",
  },
  childHor: {
    flex: "none",
  },
  childVer: {
    flex: "none",
  },
};

export interface SplitPaneProps {
  dir: SplitDir;
  splitPosition: number;
  setSplitPosition: (splitPosition: number) => void;
  style?: CSSProperties;
  child1Style?: CSSProperties;
  child2Style?: CSSProperties;
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
  child1Style,
  child2Style,
}: PropsWithChildren<SplitPaneProps>) {
  const child1Ref = useRef<HTMLDivElement | null>(null);

  if (!children || !Array.isArray(children) || children.length !== 2) {
    return null;
  }

  const childStyle = dir === "hor" ? styles.childHor : styles.childVer;

  const child1SizeStyle =
    dir === "hor" ? { width: splitPosition } : { height: splitPosition };

  const handleSplitChange = (delta: number) => {
    const divElement = child1Ref.current;
    if (divElement) {
      const clientRect = divElement.getBoundingClientRect();
      const oldSplitPosition =
        dir === "hor" ? clientRect.width : clientRect.height;
      setSplitPosition(oldSplitPosition + delta);
    }
  };

  return (
    <div
      id="SplitPane"
      style={{ ...style, ...(dir === "hor" ? styles.hor : styles.ver) }}
    >
      <div
        ref={child1Ref}
        id="SplitPane-Child-1"
        style={{ ...childStyle, ...child1Style, ...child1SizeStyle }}
      >
        {children[0]}
      </div>
      <Splitter dir={dir} onChange={handleSplitChange} />
      <div id="SplitPane-Child-2" style={{ ...childStyle, ...child2Style }}>
        {children[1]}
      </div>
    </div>
  );
}

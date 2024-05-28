/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React, { CSSProperties, PropsWithChildren, useRef } from "react";

import { isNumber } from "@/util/types";
import Splitter, { SplitDir } from "./Splitter";

// noinspection JSUnusedLocalSymbols
const styles: Record<string, CSSProperties> = {
  hor: {
    display: "flex",
    flexFlow: "row nowrap",
    flex: "auto", // same as "flex: 1 1 auto;"
  },
  ver: {
    // width: "100%",
    height: "100%",
    display: "flex",
    flexFlow: "column nowrap",
    flex: "auto", // same as "flex: 1 1 auto;"
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
    if (child1Ref.current && isNumber(child1Ref.current.clientWidth)) {
      setSplitPosition(child1Ref.current.clientWidth + delta);
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

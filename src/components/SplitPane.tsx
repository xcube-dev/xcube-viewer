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

import React, { PropsWithChildren } from "react";
import makeStyles from "@mui/styles/makeStyles";
import classNames from "classnames";

import Splitter, { SplitDir } from "./Splitter";

// noinspection JSUnusedLocalSymbols
const useStyles = makeStyles({
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
});

export interface SplitPaneProps {
  dir: SplitDir;
  splitPosition: number;
  onCommit?: (splitPosition: number) => void;
  onChange?: (newSplitPosition: number, oldSplitPosition: number) => void;
  style?: React.CSSProperties;
  child1Style?: React.CSSProperties;
  child2Style?: React.CSSProperties;
  className?: string;
  child1ClassName?: string;
  child2ClassName?: string;
  children: React.ReactNode[];
}

/**
 * A simple SplitPane component which must have exactly two child elements.
 *
 * Properties:
 * - dir: the split direction, either "hor" or "ver"
 * - initialSize: the initial width ("hor") or height ("ver") of the first child's container
 */
export default function SplitPane({
  dir,
  splitPosition,
  onCommit,
  onChange,
  children,
  style,
  child1Style,
  child2Style,
  child1ClassName,
  child2ClassName,
}: PropsWithChildren<SplitPaneProps>) {
  const classes = useStyles();
  if (!children || !Array.isArray(children)) {
    return null;
  }
  if (children.length === 1) {
    return <>{children[0]}</>;
  }
  if (children.length > 2) {
    throw new Error("SplitPane expects not more than two children");
  }
  let className;
  let childClassName;
  if (dir === "hor") {
    const width1 = splitPosition;
    className = classes.hor;
    childClassName = classes.childHor;
    child1Style = { width: width1, ...child1Style };
  } else {
    const height1 = splitPosition;
    className = classes.ver;
    childClassName = classes.childVer;
    child1Style = { height: height1, ...child1Style };
  }

  const handleSplitChange = (delta: number) => {
    const oldSplitPosition = splitPosition;
    const newSplitPosition = oldSplitPosition + delta;
    if (onChange) {
      onChange(newSplitPosition, oldSplitPosition);
    }
  };

  const handleSplitCommit = () => {
    if (onCommit) {
      onCommit(splitPosition);
    }
  };

  return (
    <div
      id="SplitPane"
      className={classNames(className, className)}
      style={style}
    >
      <div
        id="SplitPane-Child-1"
        className={classNames(childClassName, child1ClassName)}
        style={child1Style}
      >
        {children[0]}
      </div>
      <Splitter
        dir={dir}
        onChange={handleSplitChange}
        onCommit={handleSplitCommit}
      />
      <div
        id="SplitPane-Child-2"
        className={classNames(childClassName, child2ClassName)}
        style={child2Style}
      >
        {children[1]}
      </div>
    </div>
  );
}

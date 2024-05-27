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

import * as React from "react";
import { Theme } from "@mui/material/styles";

import { WithStyles } from "@mui/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { isNumber } from "@/util/types";

const styles = (theme: Theme) =>
  createStyles({
    hor: {
      flex: "none",
      border: "none",
      outline: "none",
      width: "8px",
      minHeight: "100%",
      maxHeight: "100%",
      cursor: "col-resize",

      backgroundColor: theme.palette.mode === "dark" ? "white" : "black",
      opacity: 0.0,
    },
    ver: {
      flex: "none",
      border: "none",
      outline: "none",
      height: "8px",
      minWidth: "100%",
      maxWidth: "100%",
      cursor: "row-resize",

      backgroundColor: theme.palette.mode === "dark" ? "white" : "black",
      opacity: 0.0,
    },
  });

export type SplitDir = "hor" | "ver";

interface ISplitterProps extends WithStyles<typeof styles> {
  dir?: SplitDir;
  onChange: (delta: number) => void;
  onCommit?: (position: number) => void;
}

interface IButtonEvent {
  button: number;
  buttons: number;
}

interface IScreenEvent {
  screenX: number;
  screenY: number;
}

type EventListenerItem = [
  string,
  EventListener | ((event: MouseEvent) => void),
];

/**
 * A splitter component.
 * In order to work properly, clients must provide the onChange which is a callback that receives the delta position
 * either in x-direction if direction is "hor" or y-direction if direction is "ver". The callback must then
 * adjust either a container's width if direction is "hor" or its height if direction is "ver".
 */
class _Splitter extends React.PureComponent<ISplitterProps> {
  private lastPosition: null | number = null;
  private bodyEventListeners: Array<EventListenerItem>;

  constructor(props: ISplitterProps) {
    super(props);
    if (!props.onChange) {
      throw Error("onChange property must be provided");
    }
    this.onMouseDown = this.onMouseDown.bind(this);
    this.bodyEventListeners = [
      ["mousemove", this.onBodyMouseMove.bind(this)],
      ["mouseup", this.onBodyMouseUp.bind(this)],
      ["onmouseenter", this.onBodyMouseEnter.bind(this)],
      ["onmouseleave", this.onBodyMouseLeave.bind(this)],
    ];
  }

  componentWillUnmount() {
    this.removeBodyMouseListeners();
  }

  render() {
    return (
      <div
        className={
          this.props.dir === "hor"
            ? this.props.classes.hor
            : this.props.classes.ver
        }
        onMouseDown={this.onMouseDown}
      />
    );
  }

  private onMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    if (this.isButton1Pressed(event)) {
      this.lastPosition = this.getCurrentPosition(event);
      this.removeBodyMouseListeners();
      this.addBodyMouseListeners();
    } else {
      this.lastPosition = null;
    }
  }

  private onBodyMouseMove(event: MouseEvent) {
    if (this.lastPosition === null || !this.isButton1Pressed(event)) {
      return;
    }
    const currentPosition = this.getCurrentPosition(event);
    const positionDelta = currentPosition - this.lastPosition;
    this.lastPosition = currentPosition;
    if (positionDelta !== 0) {
      this.props.onChange(positionDelta);
    }
  }

  //noinspection JSUnusedLocalSymbols
  private onBodyMouseUp(_event: MouseEvent) {
    // console.log("onBodyMouseUp: ", event, this);
    if (this.props.onCommit && isNumber(this.lastPosition)) {
      this.props.onCommit(this.lastPosition);
    }
    this.endDragging();
  }

  //noinspection JSUnusedLocalSymbols
  private onBodyMouseEnter(_event: MouseEvent) {
    // console.log("onBodyMouseEnter: ", event, this);
    this.endDragging();
  }

  //noinspection JSUnusedLocalSymbols
  private onBodyMouseLeave(_event: MouseEvent) {
    // console.log("onBodyMouseLeave: ", event, this);
    this.endDragging();
  }

  //noinspection JSMethodCanBeStatic
  private isButton1Pressed(event: IButtonEvent) {
    return event.button === 0 && event.buttons === 1;
  }

  private getCurrentPosition(event: IScreenEvent) {
    return this.props.dir === "hor" ? event.screenX : event.screenY;
  }

  private endDragging() {
    this.removeBodyMouseListeners();
    this.lastPosition = null;
  }

  private addBodyMouseListeners() {
    this.bodyEventListeners.forEach((pair: EventListenerItem) =>
      document.body.addEventListener(pair[0], pair[1] as EventListener),
    );
  }

  private removeBodyMouseListeners() {
    this.bodyEventListeners.forEach((pair: EventListenerItem) =>
      document.body.removeEventListener(pair[0], pair[1] as EventListener),
    );
  }
}

const Splitter = withStyles(styles)(_Splitter);
export default Splitter;

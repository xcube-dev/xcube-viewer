import React, { useState, useRef } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { isNumber } from "@/util/types";

const useStyles = makeStyles({
  splitter: {
    position: "absolute",
    top: 0,
    left: "50%",
    width: "6px",
    height: "100%",
    background: "white",
    zIndex: 999,
    opacity: "50%",
    border: "1px solid yellow",
    cursor: "col-resize",
  },
});

type Point = [number, number];

function useMouseDrag(onMouseDrag: (delta: Point) => void) {
  const lastPosition = useRef<Point | null>(null);

  const handleMouseMove = useRef((event: MouseEvent) => {
    if (event.buttons === 1 && lastPosition.current !== null) {
      event.preventDefault();
      const { screenX, screenY } = event;
      const [lastScreenX, lastScreenY] = lastPosition.current;
      const delta: Point = [screenX - lastScreenX, screenY - lastScreenY];
      lastPosition.current = [screenX, screenY];
      onMouseDrag(delta);
    }
  });

  // Return value
  const startDrag = useRef((event: React.MouseEvent) => {
    if (event.buttons === 1) {
      event.preventDefault();
      document.body.addEventListener("mousemove", handleMouseMove.current);
      document.body.addEventListener("mouseup", endDrag.current);
      document.body.addEventListener("onmouseleave", endDrag.current);
      lastPosition.current = [event.screenX, event.screenY];
    }
  });

  const endDrag = useRef((event: Event) => {
    if (lastPosition.current !== null) {
      event.preventDefault();
      lastPosition.current = null;
      document.body.removeEventListener("mousemove", handleMouseMove.current);
      document.body.removeEventListener("mouseup", endDrag.current);
      document.body.removeEventListener("onmouseleave", endDrag.current);
    }
  });

  return startDrag.current;
}

interface MapSplitterProps {
  hidden?: boolean;
  position?: number;
}

export default function MapSplitter({ hidden, position }: MapSplitterProps) {
  // TODO: move up as prop
  const [_position, setPosition] = useState(position);

  const classes = useStyles();
  const divRef = useRef<HTMLDivElement | null>(null);
  const handleDrag = useRef(([deltaX, _]: Point) => {
    if (divRef.current !== null) {
      setPosition(divRef.current.offsetLeft + deltaX);
    }
  });
  const startDrag = useMouseDrag(handleDrag.current);

  if (hidden) {
    return null;
  }

  return (
    <div
      id={"MapSplitter"}
      ref={divRef}
      className={classes.splitter}
      style={{ left: isNumber(_position) ? _position : "50%" }}
      onMouseDown={startDrag}
    />
  );
}

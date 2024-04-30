import { useEffect, useRef } from "react";

type Undo = () => void;
type UndoSetter = (undo: Undo | undefined) => void;

export default function useUndo(): [Undo, UndoSetter] {
  const undoRef = useRef<() => void>();
  const undo = useRef(() => {
    if (undoRef.current) {
      undoRef.current();
      undoRef.current = undefined;
    }
  });
  const setUndo = useRef((undo: Undo | undefined) => {
    undoRef.current = undo;
  });
  useEffect(() => undo.current, []);
  return [undo.current, setUndo.current];
}

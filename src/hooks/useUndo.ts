/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useEffect, useRef } from "react";

type Undo = () => void;
type UndoSetter = (undo: Undo | undefined) => void;

export default function useUndo(): [Undo, UndoSetter] {
  const undoRef = useRef<Undo>();
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

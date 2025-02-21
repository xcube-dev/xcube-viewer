/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { MutableRefObject, useCallback, useEffect, useRef } from "react";
import { useTheme } from "@mui/system";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";

import i18n from "@/i18n";
import { ExpressionCapabilities } from "@/model/userVariable";

interface ExprEditorProps {
  expression: string;
  onExpressionChange: (value: string) => void;
  variableNames: string[];
  expressionCapabilities: ExpressionCapabilities;
  handleInsertPartRef: MutableRefObject<null | ((part: string) => void)>;
}

export default function ExprEditor({
  expression,
  onExpressionChange,
  variableNames,
  expressionCapabilities,
  handleInsertPartRef,
}: ExprEditorProps) {
  const theme = useTheme();
  const codeMirrorRef = useRef<ReactCodeMirrorRef | null>(null);

  const handleInsertPart = useCallback((part: string) => {
    const view = codeMirrorRef.current?.view;
    if (view) {
      const selection = view.state.selection.main;
      const selectedText = view.state
        .sliceDoc(selection.from, selection.to)
        .trim();
      if (selectedText !== "" && part.includes("X")) {
        part = part.replace("X", selectedText);
      }
      const transaction = view.state.replaceSelection(part);
      if (transaction) {
        view.dispatch(transaction);
      }
    }
  }, []);

  useEffect(() => {
    handleInsertPartRef.current = handleInsertPart;
  }, [handleInsertPartRef, handleInsertPart]);

  const textCompletions = useCallback(
    (context: CompletionContext) => {
      // Determine the word before the cursor
      const word = context.matchBefore(/\w*/);
      if (word === null || (word.from == word.to && !context.explicit)) {
        return null;
      }

      // Return custom completions
      return {
        from: word.from,
        options: [
          ...variableNames.map((label) => ({ label, type: "variable" })),
          ...expressionCapabilities.namespace.constants.map((label) => ({
            label,
            type: "variable",
          })),
          ...expressionCapabilities.namespace.arrayFunctions.map((label) => ({
            label,
            type: "function",
          })),
          ...expressionCapabilities.namespace.otherFunctions.map((label) => ({
            label,
            type: "function",
          })),
          // Add more custom completions as needed
        ],
      };
    },
    [variableNames, expressionCapabilities.namespace],
  );

  return (
    <CodeMirror
      theme={theme.palette.mode || "none"}
      width="100%"
      height="100px"
      placeholder={i18n.get("Use keys CTRL+SPACE to show autocompletions")}
      extensions={[autocompletion({ override: [textCompletions] })]}
      value={expression}
      onChange={onExpressionChange}
      ref={codeMirrorRef}
    />
  );
}

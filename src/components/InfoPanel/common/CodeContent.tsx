/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { type Extension } from "@codemirror/state";

import { useTheme } from "@mui/material";
import InfoCardContent from "./InfoCardContent";

export interface CodeContentBaseProps {
  code: string;
}

export interface CodeContentProps extends CodeContentBaseProps {
  extension: Extension;
}

const CodeContent: React.FC<CodeContentProps> = ({ code, extension }) => {
  const themeMode = useTheme();
  return (
    <InfoCardContent>
      <CodeMirror
        theme={themeMode.palette.mode}
        height="320px"
        extensions={[extension]}
        value={code}
        readOnly={true}
      />
    </InfoCardContent>
  );
};

export default CodeContent;

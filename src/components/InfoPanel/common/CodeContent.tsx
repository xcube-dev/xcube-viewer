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

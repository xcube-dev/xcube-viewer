/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import { python } from "@codemirror/lang-python";

import type { CodeContentBaseProps } from "./CodeContent";
import CodeContent from "./CodeContent";

const PythonCodeContent: React.FC<CodeContentBaseProps> = ({ code }) => {
  return <CodeContent code={code} extension={python()} />;
};

export default PythonCodeContent;

/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import { json } from "@codemirror/lang-json";

import type { CodeContentBaseProps } from "./CodeContent";
import CodeContent from "./CodeContent";

const JsonCodeContent: React.FC<CodeContentBaseProps> = ({ code }) => {
  return <CodeContent code={code} extension={json()} />;
};

export default JsonCodeContent;

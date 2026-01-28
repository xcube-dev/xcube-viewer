/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { Variable } from "./variable";
import { isString } from "@/util/types";

export interface ExpressionCapabilities {
  namespace: {
    constants: string[];
    arrayFunctions: string[];
    otherFunctions: string[];
    arrayOperators: string[];
    otherOperators: string[];
  };
}

export interface UserVariable extends Variable {
  expression: string;
}

export function isUserVariable(variable: Variable): variable is UserVariable {
  return isString(variable.expression);
}

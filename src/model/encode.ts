/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { Dataset } from "@/model/dataset";
import { Variable } from "@/model/variable";
import { isUserVariable } from "@/model/userVariable";
import { isString } from "@/util/types";

export function encodeDatasetId(dataset: Dataset | string): string {
  return encodeURIComponent(isString(dataset) ? dataset : dataset.id);
}

export function encodeVariableName(variable: Variable | string): string {
  return encodeURIComponent(
    isString(variable)
      ? variable
      : isUserVariable(variable)
        ? `${variable.name}=${variable.expression}`
        : variable.name,
  );
}

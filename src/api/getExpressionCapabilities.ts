/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { ExpressionCapabilities } from "@/model/userVariable";
import { callJsonApi } from "./callApi";

export function getExpressionCapabilities(
  apiServerUrl: string,
): Promise<ExpressionCapabilities> {
  return callJsonApi(`${apiServerUrl}/expressions/capabilities`);
}

/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { callApi } from "./callApi";
import { encodeDatasetId } from "@/model/encode";
import i18n from "@/i18n";

export async function validateExpression(
  apiServerUrl: string,
  datasetId: string,
  expression: string,
): Promise<string | null> {
  if (expression!.trim() === "") {
    return i18n.get("Must not be empty");
  }
  const url = `${apiServerUrl}/expressions/validate/${encodeDatasetId(datasetId)}/${encodeURIComponent(expression)}`;
  try {
    await callApi(url);
    return null;
  } catch (e) {
    const message = (e as Error).message;
    if (message) {
      const i1 = message.indexOf("(");
      const i2 = message.lastIndexOf(")");
      return message.slice(i1 >= 0 ? i1 + 1 : 0, i2 >= 0 ? i2 : message.length);
    }
    return i18n.get("Invalid expression");
  }
}

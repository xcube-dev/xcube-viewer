/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { JsonValue } from "@/util/json";

export interface ItemRecord<V extends JsonValue, S extends JsonValue> {
  value: V;
  source: S;
}

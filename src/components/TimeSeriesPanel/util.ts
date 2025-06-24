/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { isNumber } from "@/util/types";
import { utcTimeToIsoDateString } from "@/util/time";

export const formatTimeTick = (value: number | string) => {
  if (!isNumber(value) || !Number.isFinite(value)) {
    return "";
  }
  return utcTimeToIsoDateString(value);
};

export const formatValueTick = (value: number) => {
  return value.toPrecision(3);
};

/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type { ReactElement, ReactNode } from "react";
import { isNumber, isString } from "@/util/types";

export interface PanelModel {
  id: string;
  title: string;
  disabled?: boolean;
  visible?: boolean;
  icon: ReactElement | string;
  tooltip?: string;
  position?: number;
  after?: number | string;
  before?: number | string;
  content?: ReactNode;
}

export function comparePanelModels(p1: PanelModel, p2: PanelModel): number {
  if (isString(p1.before) && p1.before === p2.id) {
    return 1;
  }
  if (isString(p2.before) && p2.before === p1.id) {
    return -1;
  }
  if (isString(p2.after) && p2.after === p1.id) {
    return 1;
  }
  if (isString(p1.after) && p1.after === p2.id) {
    return -1;
  }
  if (isNumber(p1.position) && isNumber(p2.position)) {
    const value = p1.position - p2.position;
    if (value !== 0) {
      return value;
    }
  }
  const value = p1.title.localeCompare(p2.title);
  return value === 0 ? p1.id.localeCompare(p2.id) : value;
}

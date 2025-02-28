/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type { ReactElement, ReactNode } from "react";
import { isNumber } from "@/util/types";

export interface PanelModel {
  id: string;
  title: string;
  disabled?: boolean;
  visible?: boolean;
  icon?: ReactElement | string;
  tooltip?: string;
  position?: number;
  content?: ReactNode;
}

export function getEffectivePanelModels(
  panelModels: PanelModel[],
): PanelModel[] {
  return (
    panelModels
      .filter(isPanelModelRenderable)
      .map(normalizePanelModel)
      // sort() is in-place, but filter() and map() create new instances
      .sort(comparePanelModels)
  );
}

export function isPanelModelRenderable(panelModel: PanelModel): boolean {
  return !!(panelModel.visible && panelModel.content);
}

export function normalizePanelModel(panelModel: PanelModel, position: number) {
  return !isNumber(panelModel.position) || panelModel.position < 0
    ? { ...panelModel, position }
    : panelModel;
}

export function comparePanelModels(p1: PanelModel, p2: PanelModel): number {
  if (isNumber(p1.position)) {
    if (isNumber(p2.position)) {
      const value = p1.position - p2.position;
      if (value !== 0) {
        return value;
      }
    } else {
      return -1;
    }
  } else if (isNumber(p2.position)) {
    return 1;
  }
  const value = p1.title.localeCompare(p2.title);
  return value === 0 ? p1.id.localeCompare(p2.id) : value;
}

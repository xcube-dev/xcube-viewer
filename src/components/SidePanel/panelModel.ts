/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type { ReactElement, ReactNode } from "react";
import { isNumber } from "@/util/types";

/**
 * The data model for side panel.
 */
export interface PanelModel {
  /**
   * Panel identifier.
   */
  id: string;
  /**
   * Panel title.
   */
  title: string;
  /**
   * Whether the panel is disabled
   */
  disabled?: boolean;
  /**
   * The name of the panel's tool button icon.
   * Must be the name of a Material Design icon.
   */
  icon?: ReactElement | string;
  /**
   * The name of the panel's tooltip text.
   */
  tooltip?: string;
  /**
   * The position of the panel's tool button.
   */
  position?: number;
  /**
   * The panel's content container.
   */
  content?: ReactNode;
  /**
   * Whether the panel's (remote) component has been requested.
   * Defined and valid for server-side panels only.
   * The component is created from the return value of the
   * API endpoint /viewer/ext/layout.
   */
  componentRequested?: boolean;
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
  return !!panelModel.content;
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

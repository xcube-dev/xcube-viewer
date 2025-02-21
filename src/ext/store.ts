/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { Store } from "redux";
import { type HostStore } from "chartlets";

import { AppState } from "@/states/appState";
import {
  selectedDataset2IdSelector,
  selectedDatasetIdSelector,
  selectedDatasetTimeLabelSelector,
  selectedPlaceGeometrySelector,
  selectedVariable2NameSelector,
  selectedVariableNameSelector,
} from "@/selectors/controlSelectors";
import { getPaletteMode } from "@/states/controlState";

export interface DerivedStateProperty {
  type: string;
  description: string;
  selector: (state: AppState) => unknown;
}

export const derivedStateProperties: Record<string, DerivedStateProperty> = {
  selectedDatasetId: {
    type: "str | None",
    description: "The identifier of the currently selected dataset.",
    selector: selectedDatasetIdSelector,
  },
  selectedVariableName: {
    type: "str | None",
    description:
      "The name of the currently selected variable within the selected dataset.",
    selector: selectedVariableNameSelector,
  },
  selectedDataset2Id: {
    type: "str | None",
    description:
      "The identifier of the dataset that contains the pinned variable.",
    selector: selectedDataset2IdSelector,
  },
  selectedVariable2Name: {
    type: "str | None",
    description: "The name of the pinned variable.",
    selector: selectedVariable2NameSelector,
  },
  selectedPlaceGeometry: {
    type: "dict[str, Any] | None",
    description:
      "The geometry of the currently selected place in GeoJSON format.",
    selector: selectedPlaceGeometrySelector,
  },
  selectedTimeLabel: {
    type: "str | None",
    description: "The currently selected UTC time using ISO format.",
    selector: selectedDatasetTimeLabelSelector,
  },
  themeMode: {
    type: "str",
    description: 'The appearance mode of the UI. Either "light" or "dark".',
    selector: (appState: AppState) =>
      getPaletteMode(appState.controlState.themeMode),
  },
};

export function newDerivedStore(store: Store<AppState>): HostStore {
  return {
    subscribe(listener: () => void): () => void {
      return store.subscribe(listener);
    },
    get(propertyName: string): unknown {
      const derivedProperty = derivedStateProperties[propertyName];
      if (derivedProperty) {
        return derivedProperty.selector(store.getState());
      }
    },
  };
}

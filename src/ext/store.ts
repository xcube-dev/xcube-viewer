/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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

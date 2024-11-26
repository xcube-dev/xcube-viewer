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

export interface DerivedProperty {
  type: string;
  description: string;
  selector: (state: AppState) => unknown;
}

export const derivedProperties: Record<string, DerivedProperty> = {
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
};

export function newDerivedStore(store: Store<AppState>): HostStore {
  return {
    subscribe(listener: () => void): () => void {
      return store.subscribe(listener);
    },
    get(propertyName: string): unknown {
      const derivedProperty = derivedProperties[propertyName];
      if (derivedProperty) {
        return derivedProperty.selector(store.getState());
      }
    },
  };
}

export function getDerivedStateMarkdown() {
  const lines: string[] = [];
  Object.getOwnPropertyNames(derivedProperties).forEach(
    (propertyName: string) => {
      const derivedProperty = derivedProperties[propertyName];
      lines.push(
        `- \`${propertyName}\`: **${derivedProperty.type}**    ${derivedProperty.description}`,
      );
    },
  );
  return lines.join("\n\n");
}

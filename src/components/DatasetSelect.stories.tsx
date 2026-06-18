/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { Dataset } from "@/model/dataset";
import DatasetSelect from "./DatasetSelect";

interface DatasetSelectDemoProps {
  datasets: Dataset[];
  selectedDatasetId: string | null;
  selectedDataset2Id: string | null;
}

const datasets: Dataset[] = [
  createDataset("de-berlin", "Berlin Sentinel-2", "Germany", 1, 1),
  createDataset("de-hamburg", "Hamburg Urban Heat", "Germany", 1, 2),
  createDataset("de-munich", "Munich Vegetation", "Germany", 1, 3),
  createDataset("fr-paris", "Paris Land Cover", "France", 2, 1),
  createDataset("fr-lyon", "Lyon Air Quality", "France", 2, 2),
  createDataset("fr-marseille", "Marseille Coastal", "France", 2, 3),
  createDataset("es-madrid", "Madrid Drought Index", "Spain", 3, 1),
  createDataset("es-barcelona", "Barcelona Canopy", "Spain", 3, 2),
  createDataset("es-valencia", "Valencia Agriculture", "Spain", 3, 3),
  createDataset("it-rome", "Rome Surface Water", "Italy", 4, 1),
  createDataset("it-milan", "Milan Imperviousness", "Italy", 4, 2),
  createDataset("unclassified", "Unclassified Test Dataset", undefined, 5, 1),
];

function DatasetSelectDemo({
  datasets,
  selectedDatasetId,
  selectedDataset2Id,
}: DatasetSelectDemoProps) {
  const selectedDataset =
    datasets.find((dataset) => dataset.id === selectedDatasetId) ?? null;

  return (
    <DatasetSelect
      selectedDataset={selectedDataset}
      selectedDataset2Id={selectedDataset2Id}
      datasets={datasets}
      selectDataset={() => {}}
      layerVisibilities={{
        datasetRgb: false,
        datasetVariable: true,
      }}
      toggleDatasetRgbLayer={() => {}}
      locateSelectedDataset={() => {}}
    />
  );
}

const meta = {
  component: DatasetSelectDemo,
  title: "DatasetSelect",
  parameters: {
    // Optional parameter to center the component in the Canvas.
    // More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry:
  // https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof DatasetSelectDemo>;

// noinspection JSUnusedGlobalSymbols
export default meta;

type Story = StoryObj<typeof meta>;

export const Grouped: Story = {
  args: {
    datasets,
    selectedDatasetId: "de-hamburg",
    selectedDataset2Id: "fr-paris",
  },
};

function createDataset(
  id: string,
  title: string,
  groupTitle: string | undefined,
  groupOrder: number,
  sortValue: number,
): Dataset {
  return {
    id,
    title,
    groupTitle,
    groupOrder,
    groupDescription: groupTitle
      ? `Datasets grouped under ${groupTitle}.`
      : undefined,
    sortValue,
    bbox: [0, 0, 1, 1],
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
      ],
    },
    spatialRef: "EPSG:4326",
    dimensions: [],
    variables: [],
    attrs: {},
    resolutions: [1],
    spatialUnits: "degrees",
  };
}

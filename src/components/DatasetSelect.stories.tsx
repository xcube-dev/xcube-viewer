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
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DatasetSelectDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const GroupedOneSelected: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Datasets are organized into multiple groups. Demonstrates group headers, collapsing/expanding, tooltips, and one selected dataset.",
      },
    },
  },
  args: {
    datasets,
    selectedDatasetId: "de-hamburg",
    selectedDataset2Id: null,
  },
};

export const GroupedTwoSelected: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "This story demonstrates a component with two selected datasets.",
      },
    },
  },
  args: {
    datasets,
    selectedDatasetId: "de-hamburg",
    selectedDataset2Id: "fr-paris",
  },
};

export const SingleGroup: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "All datasets belong to the same group. Demonstrates that group headers are not rendered when all datasets share the same group.",
      },
    },
  },
  args: {
    datasets: datasets.filter((dataset) => dataset.groupTitle === "Germany"),
    selectedDatasetId: "de-hamburg",
    selectedDataset2Id: null,
  },
};

export const NoGroups: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Datasets do not belong to any group. Demonstrates the component's behavior when groupTitle is undefined.",
      },
    },
  },
  args: {
    datasets: datasets.map((dataset) => ({
      ...dataset,
      groupTitle: undefined,
      groupDescription: undefined,
    })),
    selectedDatasetId: "de-hamburg",
    selectedDataset2Id: null,
  },
};

export const Empty: Story = {
  args: {
    datasets: [],
    selectedDatasetId: null,
    selectedDataset2Id: null,
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

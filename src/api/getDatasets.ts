/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { Dataset, Dimension, TimeDimension } from "@/model/dataset";
import { callJsonApi, makeRequestInit, makeRequestUrl } from "./callApi";

interface RawDatasets {
  datasets?: Dataset[];
}

export function getDatasets(
  apiServerUrl: string,
  accessToken: string | null,
): Promise<Dataset[]> {
  const url = makeRequestUrl(`${apiServerUrl}/datasets`, [["details", "1"]]);
  const init = makeRequestInit(accessToken);
  return callJsonApi(url, init, adjustTimeDimensionsForDatasets);
}

function adjustTimeDimensionsForDatasets(datasets: RawDatasets): Dataset[] {
  return (datasets.datasets || []).map(adjustTimeDimensionsForDataset);
}

function adjustTimeDimensionsForDataset(dataset: Dataset): Dataset {
  if (dataset.dimensions && dataset.dimensions.length) {
    let dimensions = dataset.dimensions;
    const index = dimensions.findIndex(
      (dimension: Dimension) => dimension.name === "time",
    );
    if (index > -1) {
      const timeDimension = dimensions[index];
      const timeCoordinates: number[] | string[] = timeDimension.coordinates;
      if (
        timeCoordinates &&
        timeCoordinates.length &&
        typeof timeCoordinates[0] === "string"
      ) {
        const labels = timeCoordinates as unknown as string[];
        const coordinates = labels.map((label: string) =>
          new Date(label).getTime(),
        );
        dimensions = [...dimensions];
        dimensions[index] = {
          ...timeDimension,
          coordinates,
          labels,
        } as TimeDimension;
        return { ...dataset, dimensions };
      }
    }
  }
  return dataset;
}

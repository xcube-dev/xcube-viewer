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

import { callJsonApi, makeRequestInit, makeRequestUrl } from "./callApi";
import { Dataset, Dimension, TimeDimension } from "../model/dataset";

export function getDatasets(
  apiServerUrl: string,
  accessToken: string | null,
): Promise<Dataset[]> {
  const url = makeRequestUrl(`${apiServerUrl}/datasets`, [["details", "1"]]);
  const init = makeRequestInit(accessToken);
  return callJsonApi<Dataset[]>(url, init)
    .then((result: any) => result["datasets"])
    .then(adjustTimeDimensionsForDatasets);
}

function adjustTimeDimensionsForDatasets(datasets: Dataset[]): Dataset[] {
  return datasets.map(adjustTimeDimensionsForDataset);
}

function adjustTimeDimensionsForDataset(dataset: Dataset): Dataset {
  if (dataset.dimensions && dataset.dimensions.length) {
    let dimensions = dataset.dimensions;
    const index = dimensions.findIndex(
      (dimension: Dimension) => dimension.name === "time",
    );
    if (index > -1) {
      const timeDimension = dimensions[index];
      const timeCoordinates: any = timeDimension.coordinates;
      if (
        timeCoordinates &&
        timeCoordinates.length &&
        typeof timeCoordinates[0] === "string"
      ) {
        const labels = timeCoordinates as string[];
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

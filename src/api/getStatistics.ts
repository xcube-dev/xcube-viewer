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

import * as geojson from "geojson";

import { Dataset } from "@/model/dataset";
import { Variable } from "@/model/variable";
import {
  Statistics,
  StatisticsRecord,
  StatisticsSource,
} from "@/model/statistics";
import {
  callJsonApi,
  makeRequestInit,
  makeRequestUrl,
  QueryComponent,
} from "./callApi";

interface StatisticsResult {
  result: Statistics;
}

export function getStatisticsForGeometry(
  apiServerUrl: string,
  dataset: Dataset,
  variable: Variable,
  placeId: string,
  geometry: geojson.Geometry,
  time: string,
  accessToken: string | null,
): Promise<StatisticsRecord> {
  const query: QueryComponent[] = [["time", time]];
  query.push(["time", time]);
  const dsId = encodeURIComponent(dataset.id);
  const variableName = encodeURIComponent(variable.name);
  const url = makeRequestUrl(
    `${apiServerUrl}/statistics/${dsId}/${variableName}`,
    query,
  );

  const init = {
    ...makeRequestInit(accessToken),
    method: "post",
    body: JSON.stringify(geometry),
  };

  const source: StatisticsSource = {
    datasetId: dataset.id,
    datasetTitle: dataset.title,
    variableName: variable.name,
    placeId,
    geometry,
  };

  return callJsonApi(url, init, (r: StatisticsResult) => ({
    source,
    ...r.result,
  }));
}

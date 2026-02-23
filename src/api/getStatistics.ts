/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { Dataset } from "@/model/dataset";
import { Variable } from "@/model/variable";
import { PlaceInfo } from "@/model/place";
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
import { encodeDatasetId, encodeVariableName } from "@/model/encode";

interface StatisticsResult {
  result: Statistics;
}

export function getStatistics(
  apiServerUrl: string,
  dataset: Dataset,
  variable: Variable,
  placeInfo: PlaceInfo,
  timeLabel: string | null,
  accessToken: string | null,
): Promise<StatisticsRecord> {
  const query: QueryComponent[] =
    timeLabel !== null ? [["time", timeLabel]] : [];
  const url = makeRequestUrl(
    `${apiServerUrl}/statistics/${encodeDatasetId(dataset)}/${encodeVariableName(variable)}`,
    query,
  );

  const init = {
    ...makeRequestInit(accessToken),
    method: "post",
    body: JSON.stringify(placeInfo.place.geometry),
  };

  const source: StatisticsSource = {
    dataset,
    variable,
    placeInfo,
    time: timeLabel,
  };

  return callJsonApi(url, init, (r: StatisticsResult) => ({
    source,
    statistics: r.result,
  }));
}

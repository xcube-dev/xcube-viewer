/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { Dataset } from "@/model/dataset";
import { Variable } from "@/model/variable";
import {
  callJsonApi,
  makeRequestInit,
  makeRequestUrl,
  QueryComponent,
} from "@/api/callApi";
import { encodeDatasetId, encodeVariableName } from "@/model/encode";

interface Value {
  value?: number;
}

interface Result {
  result?: Value;
}

export function getPointValue(
  apiServerUrl: string,
  dataset: Dataset,
  variable: Variable,
  lon: number,
  lat: number,
  time: string | null,
  accessToken: string | null,
): Promise<Value> {
  const query: QueryComponent[] = [
    ["lon", lon.toString()],
    ["lat", lat.toString()],
  ];
  if (time) {
    query.push(["time", time]);
  }
  const url = makeRequestUrl(
    `${apiServerUrl}/statistics/${encodeDatasetId(dataset)}/${encodeVariableName(variable)}`,
    query,
  );
  return callJsonApi(url, makeRequestInit(accessToken), (result: Result) =>
    result.result ? result.result : {},
  );
}

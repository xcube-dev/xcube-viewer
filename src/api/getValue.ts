import { Dataset } from "@/model/dataset";
import { Variable } from "@/model/variable";
import {
  callJsonApi,
  makeRequestInit,
  makeRequestUrl,
  QueryComponent,
} from "@/api/callApi";
import { encodeDatasetId, encodeVariableName } from "@/model/encode";
import { isNumber } from "@/util/types";

interface RawValue {
  value?: number;
}

interface Value {
  source: { dataset: Dataset; variable: Variable };
  lon: number;
  lat: number;
  time: string;
  value: number;
}

export function getValue(
  apiServerUrl: string,
  dataset: Dataset,
  variable: Variable,
  lon: number,
  lat: number,
  time: string,
  accessToken: string | null,
): Promise<Value> {
  const query: QueryComponent[] = [
    ["lon", lon.toString()],
    ["lat", lat.toString()],
    ["time", time],
  ];
  const url = makeRequestUrl(
    `${apiServerUrl}/statistics/${encodeDatasetId(dataset)}/${encodeVariableName(variable)}`,
    query,
  );

  const init = makeRequestInit(accessToken);

  return callJsonApi(url, init, (rv: RawValue) => ({
    source: { dataset, variable },
    lon,
    lat,
    time,
    value: isNumber(rv.value) ? rv.value : NaN,
  }));
}

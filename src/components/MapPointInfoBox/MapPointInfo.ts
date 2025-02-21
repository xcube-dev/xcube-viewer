/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { Variable } from "@/model/variable";
import { Dataset } from "@/model/dataset";

export interface Location {
  pixelX: number;
  pixelY: number;
  lon: number;
  lat: number;
}

export interface Payload {
  dataset: Dataset;
  variable: Variable;
  result: {
    value?: number;
    fetching?: boolean;
    error?: unknown;
  };
}

export default interface MapPointInfo {
  location: Location;
  payload: Payload;
  payload2?: Payload;
}

/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { PlaceGroup } from "@/model/place";
import { callJsonApi, makeRequestInit } from "./callApi";

export function getDatasetPlaceGroup(
  apiServerUrl: string,
  datasetId: string,
  placeGroupId: string,
  accessToken: string | null,
): Promise<PlaceGroup> {
  const init = makeRequestInit(accessToken);
  const dsId = encodeURIComponent(datasetId);
  const pgId = encodeURIComponent(placeGroupId);
  return callJsonApi<PlaceGroup>(
    `${apiServerUrl}/datasets/${dsId}/places/${pgId}`,
    init,
  );
}

/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { ApiServerInfo } from "@/model/apiServer";
import { callJsonApi } from "./callApi";

export function getServerInfo(apiServerUrl: string): Promise<ApiServerInfo> {
  return callJsonApi<ApiServerInfo>(`${apiServerUrl}/`);
}

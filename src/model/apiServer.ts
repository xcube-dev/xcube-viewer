/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

export interface ApiServerConfig {
  id: string;
  name: string;
  url: string;
}

export interface ApiServerInfo {
  name: string;
  description: string;
  version: string;
  configTime: string;
  serverTime: string;
}

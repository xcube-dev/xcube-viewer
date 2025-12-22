/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import baseUrl from "@/util/baseurl";
import { buildPath } from "@/util/path";

let resolvedConfigPath: string | null = null;

export function getConfigPath(): string {
  if (resolvedConfigPath === null) {
    throw new Error("internal error: configPath not resolved yet");
  }
  return resolvedConfigPath;
}

export function setConfigPath(path: string) {
  if (resolvedConfigPath !== null) {
    throw new Error("internal error: configPath already resolved");
  }
  resolvedConfigPath = buildPath(baseUrl.href, path);
}

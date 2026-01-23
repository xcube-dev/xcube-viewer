/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

export function newId(prefix?: string): string {
  return (prefix || "") + Math.random().toString(16).substring(2);
}

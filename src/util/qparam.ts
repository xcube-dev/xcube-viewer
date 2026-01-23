/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

// based on https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript

export function getQueryParameterByName(
  queryStr: string | null,
  name: string,
  defaultValue: string | null = null,
): string | null {
  queryStr = queryStr || window.location.search;
  if (!queryStr) {
    return defaultValue;
  }
  const match = RegExp("[?&]" + name + "=([^&]*)").exec(queryStr);
  if (!match) {
    return defaultValue;
  }
  return decodeURIComponent(match[1].replace(/\+/g, " "));
}

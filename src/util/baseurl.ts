/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

function _getBaseUrl(): URL {
  const url = new URL(window.location.href);
  const pathComponents = url.pathname.split("/");
  const numPathComponents = pathComponents.length;
  if (numPathComponents > 0) {
    const lastComponent = pathComponents[numPathComponents - 1];
    if (lastComponent === "index.html") {
      return new URL(
        pathComponents.slice(0, numPathComponents - 1).join("/"),
        window.location.origin,
      );
    } else {
      return new URL(url.pathname, window.location.origin);
    }
  }
  return new URL(window.location.origin);
}

const baseUrl = _getBaseUrl();

export default baseUrl;

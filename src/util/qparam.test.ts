/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { expect, it, describe } from "vitest";
import { getQueryParameterByName } from "./qparam";

describe("getQueryParameterByName", () => {
  it("works", () => {
    const serverUrl = "http://xcube-org:3000/xcube-server/api/v1.0";
    const serverName = "Default Server";

    const queryStr = `?serverUrl=${encodeURIComponent(serverUrl)}&serverName=${encodeURIComponent(serverName)}`;

    const actualServerUrl = getQueryParameterByName(queryStr, "serverUrl");
    expect(actualServerUrl).toEqual(serverUrl);

    const actualServerName = getQueryParameterByName(queryStr, "serverName");
    expect(actualServerName).toEqual(serverName);
  });

  it("works with default (missing param)", () => {
    const serverUrl = "http://xcube-org:3000/xcube-server/api/v1.0";
    const serverName = "Default Server";

    const queryStr = `?server=${encodeURIComponent(serverUrl)}&serverName=${encodeURIComponent(serverName)}`;

    const actualServerUrl = getQueryParameterByName(
      queryStr,
      "serverUrl",
      "https://pippo",
    );
    expect(actualServerUrl).toEqual("https://pippo");
    const actualServerName = getQueryParameterByName(
      queryStr,
      "serverName",
      "https://pippo",
    );
    expect(actualServerName).toEqual(serverName);
  });

  it("works with default (no queryStr)", () => {
    const actualServerUrl = getQueryParameterByName(
      null,
      "serverUrl",
      "https://pippo",
    );
    expect(actualServerUrl).toEqual("https://pippo");
  });
});

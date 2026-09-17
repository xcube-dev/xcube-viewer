/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Config } from "@/config";
import { ControlState } from "./controlState";
import { loadUserSettings, storeUserSettings } from "./userSettings";

const defaultSettings = {
  exportDataType: "timeSeries",
  exportFormat: "text",
  exportTimeRange: "full",
  exportAsZipArchive: false,
  exportTimeSeriesSeparator: "TAB",
  exportFileName: "export",
} as ControlState;

describe("export user settings", () => {
  beforeEach(() => {
    vi.spyOn(Config, "instance", "get").mockReturnValue({
      name: "test",
    } as Config);
  });

  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("stores and restores the selected export options", () => {
    const settings = {
      ...defaultSettings,
      exportDataType: "places",
      exportFormat: "geojson",
      exportTimeRange: "displayed",
      exportAsZipArchive: true,
    } as ControlState;

    storeUserSettings(settings);

    expect(loadUserSettings(defaultSettings)).toMatchObject({
      exportDataType: "places",
      exportFormat: "geojson",
      exportTimeRange: "displayed",
      exportAsZipArchive: true,
    });
  });

  it("falls back to valid defaults for malformed stored export settings", () => {
    window.localStorage.setItem("xcube.test.exportDataType", "invalid");
    window.localStorage.setItem("xcube.test.exportFormat", "invalid");
    window.localStorage.setItem("xcube.test.exportTimeRange", "invalid");

    expect(loadUserSettings(defaultSettings)).toMatchObject({
      exportDataType: "timeSeries",
      exportFormat: "text",
      exportTimeRange: "full",
    });
  });

  it("does not reuse the legacy ZIP setting", () => {
    window.localStorage.setItem("xcube.test.exportZipArchive", "true");

    expect(loadUserSettings(defaultSettings)).toMatchObject({
      exportAsZipArchive: false,
    });
  });
});

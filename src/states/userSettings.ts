/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Config } from "@/config";
import { ApiServerConfig } from "@/model/apiServer";
import { getLocalStorage } from "@/util/storage";
import { ControlState } from "./controlState";
import { UserVariable } from "@/model/userVariable";
import { ColorMapType } from "@/model/colorBar";
import { isString } from "@/util/types";

export function storeUserServers(userServers: ApiServerConfig[]) {
  const storage = getLocalStorage(Config.instance.name);
  if (storage) {
    try {
      storage.setObjectItem("userServers", userServers);
    } catch (e) {
      console.warn(`failed to store user servers: ${e}`);
    }
  }
}

export function loadUserServers(): ApiServerConfig[] {
  const storage = getLocalStorage(Config.instance.name);
  if (storage) {
    try {
      return storage.getObjectItem("userServers", []);
    } catch (e) {
      console.warn(`failed to load user servers: ${e}`);
    }
  }
  return [];
}

export function storeUserVariables(
  userVariables: Record<string, UserVariable[]>,
) {
  const storage = getLocalStorage(Config.instance.name);
  if (storage) {
    try {
      storage.setObjectItem("userVariables", userVariables);
    } catch (e) {
      console.warn(`failed to store user variables: ${e}`);
    }
  }
}

export function loadUserVariables(): Record<string, UserVariable[]> {
  const storage = getLocalStorage(Config.instance.name);
  if (storage) {
    try {
      return storage.getObjectItem("userVariables", {});
    } catch (e) {
      console.warn(`failed to load user variables: ${e}`);
    }
  }
  return {};
}

export function storeUserSettings(settings: ControlState) {
  const storage = getLocalStorage(Config.instance.name);
  if (storage) {
    try {
      storage.setPrimitiveProperty("locale", settings);
      storage.setPrimitiveProperty("privacyNoticeAccepted", settings);
      storage.setPrimitiveProperty("autoShowTimeSeries", settings);
      storage.setPrimitiveProperty("timeSeriesIncludeStdev", settings);
      storage.setPrimitiveProperty("timeSeriesChartTypeDefault", settings);
      storage.setPrimitiveProperty("timeSeriesUseMedian", settings);
      storage.setPrimitiveProperty("timeAnimationInterval", settings);
      storage.setPrimitiveProperty("timeChunkSize", settings);
      storage.setPrimitiveProperty("sidebarOpen", settings);
      storage.setPrimitiveProperty("sidebarPanelId", settings);
      storage.setPrimitiveProperty("volumeRenderMode", settings);
      storage.setObjectProperty("infoCardElementStates", settings);
      storage.setPrimitiveProperty("imageSmoothingEnabled", settings);
      storage.setPrimitiveProperty("mapProjection", settings);
      storage.setPrimitiveProperty("selectedBaseMapId", settings);
      storage.setPrimitiveProperty("selectedOverlayId", settings);
      storage.setArrayProperty("userBaseMaps", settings);
      storage.setArrayProperty("userOverlays", settings);
      storage.setArrayProperty("userColorBars", settings);
      storage.setPrimitiveProperty("userDrawnPlaceGroupName", settings);
      storage.setPrimitiveProperty("datasetLocateMode", settings);
      storage.setPrimitiveProperty("placeLocateMode", settings);
      storage.setPrimitiveProperty("exportTimeSeries", settings);
      storage.setPrimitiveProperty("exportTimeSeriesSeparator", settings);
      storage.setPrimitiveProperty("exportPlaces", settings);
      storage.setPrimitiveProperty("exportPlacesAsCollection", settings);
      storage.setPrimitiveProperty("exportZipArchive", settings);
      storage.setPrimitiveProperty("exportFileName", settings);
      storage.setPrimitiveProperty("userPlacesFormatName", settings);
      storage.setObjectProperty("userPlacesFormatOptions", settings);
      if (import.meta.env.DEV) {
        console.debug("Stored user settings:", settings);
      }
    } catch (e) {
      console.warn(`failed to store user settings: ${e}`);
    }
  }
}

export function loadUserSettings(defaultSettings: ControlState): ControlState {
  const storage = getLocalStorage(Config.instance.name);
  if (storage) {
    const settings = { ...defaultSettings };
    try {
      storage.getStringProperty("locale", settings, defaultSettings);
      storage.getBooleanProperty(
        "privacyNoticeAccepted",
        settings,
        defaultSettings,
      );
      storage.getBooleanProperty(
        "autoShowTimeSeries",
        settings,
        defaultSettings,
      );
      storage.getBooleanProperty(
        "timeSeriesIncludeStdev",
        settings,
        defaultSettings,
      );
      storage.getStringProperty(
        "timeSeriesChartTypeDefault",
        settings,
        defaultSettings,
      );
      storage.getBooleanProperty(
        "timeSeriesUseMedian",
        settings,
        defaultSettings,
      );
      storage.getIntProperty(
        "timeAnimationInterval",
        settings,
        defaultSettings,
      );
      storage.getIntProperty("timeChunkSize", settings, defaultSettings);
      storage.getBooleanProperty("sidebarOpen", settings, defaultSettings);
      storage.getStringProperty("sidebarPanelId", settings, defaultSettings);
      storage.getStringProperty("volumeRenderMode", settings, defaultSettings);
      storage.getObjectProperty(
        "infoCardElementStates",
        settings,
        defaultSettings,
      );
      storage.getBooleanProperty(
        "imageSmoothingEnabled",
        settings,
        defaultSettings,
      );
      storage.getStringProperty("mapProjection", settings, defaultSettings);
      storage.getStringProperty("selectedBaseMapId", settings, defaultSettings);
      storage.getStringProperty("selectedOverlayId", settings, defaultSettings);
      storage.getArrayProperty("userBaseMaps", settings, defaultSettings);
      storage.getArrayProperty("userOverlays", settings, defaultSettings);
      storage.getArrayProperty(
        "userColorBars",
        settings,
        defaultSettings,
        convertColorBarsFrom16To17,
      );
      storage.getStringProperty(
        "userDrawnPlaceGroupName",
        settings,
        defaultSettings,
      );
      storage.getStringProperty("datasetLocateMode", settings, defaultSettings);
      storage.getStringProperty("placeLocateMode", settings, defaultSettings);
      storage.getBooleanProperty("exportTimeSeries", settings, defaultSettings);
      storage.getStringProperty(
        "exportTimeSeriesSeparator",
        settings,
        defaultSettings,
      );
      storage.getBooleanProperty("exportPlaces", settings, defaultSettings);
      storage.getBooleanProperty(
        "exportPlacesAsCollection",
        settings,
        defaultSettings,
      );
      storage.getBooleanProperty("exportZipArchive", settings, defaultSettings);
      storage.getStringProperty("exportFileName", settings, defaultSettings);
      storage.getStringProperty(
        "userPlacesFormatName",
        settings,
        defaultSettings,
      );
      storage.getObjectProperty(
        "userPlacesFormatOptions",
        settings,
        defaultSettings,
      );
      if (import.meta.env.DEV) {
        console.debug("Loaded user settings:", settings);
      }
    } catch (e) {
      console.warn(`Failed to load user settings: ${e}`);
    }
    return settings;
  } else {
    console.warn("User settings not found or access denied");
  }
  return defaultSettings;
}

/* Translates old color map types names to currently used names */
const _COLOR_MAP_TYPES: Record<string, ColorMapType> = {
  node: "continuous",
  continuous: "continuous",
  bound: "stepwise",
  stepwise: "stepwise",
  key: "categorical",
  categorical: "categorical",
};

function convertColorBarsFrom16To17(colorBars: unknown) {
  if (Array.isArray(colorBars)) {
    return colorBars.map((colorBar: Record<string, unknown>) => ({
      ...colorBar,
      type: convertColorBarTypeFrom16To17(colorBar.type),
    }));
  }
}

function convertColorBarTypeFrom16To17(type: unknown): ColorMapType {
  return isString(type) && type in _COLOR_MAP_TYPES
    ? _COLOR_MAP_TYPES[type]
    : "continuous";
}

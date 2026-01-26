/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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
      storage.setPrimitiveProperty("sidePanelOpen", settings);
      storage.setPrimitiveProperty("sidePanelId", settings);
      storage.setPrimitiveProperty("sidePanelSize", settings);
      storage.setPrimitiveProperty("volumeRenderMode", settings);
      storage.setObjectProperty("layerVisibilities", settings);
      storage.setObjectProperty("infoCardElementStates", settings);
      storage.setPrimitiveProperty("imageSmoothingEnabled", settings);
      storage.setPrimitiveProperty("mapProjection", settings);
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
      storage.setPrimitiveProperty("themeMode", settings);
      storage.setPrimitiveProperty("exportResolution", settings);
      storage.setPrimitiveProperty("showProgressBar", settings);
      storage.setPrimitiveProperty("showZoomInfoBox", settings);
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
      storage.getBooleanProperty("sidePanelOpen", settings, defaultSettings);
      storage.getStringProperty("sidePanelId", settings, defaultSettings);
      storage.getIntProperty("sidePanelSize", settings, defaultSettings);
      storage.getStringProperty("volumeRenderMode", settings, defaultSettings);
      storage.getObjectProperty(
        "infoCardElementStates",
        settings,
        defaultSettings,
      );
      storage.getObjectProperty("layerVisibilities", settings, defaultSettings);
      storage.getBooleanProperty(
        "imageSmoothingEnabled",
        settings,
        defaultSettings,
      );
      storage.getStringProperty("mapProjection", settings, defaultSettings);
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
      storage.getStringProperty("themeMode", settings, defaultSettings);
      storage.getStringProperty("exportResolution", settings, defaultSettings);
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

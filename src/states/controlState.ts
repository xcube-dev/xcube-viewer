/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { Extent as OlExtent } from "ol/extent";
import { Geometry as OlGeometry } from "ol/geom";
import { default as OlBaseObject } from "ol/Object";

import { Config } from "@/config";
import { UserColorBar } from "@/model/userColorBar";
import { defaultBaseMapId, LayerDefinition } from "@/model/layerDefinition";
import { DEFAULT_MAP_CRS } from "@/model/proj";
import { Time, TimeRange } from "@/model/timeSeries";
import { CsvOptions, defaultCsvOptions } from "@/model/user-place/csv";
import {
  defaultGeoJsonOptions,
  GeoJsonOptions,
} from "@/model/user-place/geojson";
import { defaultWktOptions, WktOptions } from "@/model/user-place/wkt";
import { loadUserSettings } from "./userSettings";
import { PaletteMode } from "@mui/material";
import { LayerState } from "@/model/layerState";

export type TimeAnimationInterval = 250 | 500 | 1000 | 2500;
export const TIME_ANIMATION_INTERVALS: TimeAnimationInterval[] = [
  250, 500, 1000, 2500,
];

export type MapInteraction =
  | "Select"
  | "Point"
  | "Polygon"
  | "Circle"
  | "Geometry";

export type ViewMode = "text" | "list" | "code" | "python";

export interface InfoCardElementState {
  visible?: boolean;
  viewMode?: ViewMode;
}

export interface InfoCardElementStates {
  [key: string]: InfoCardElementState;
}

export type LocateMode = "doNothing" | "pan" | "panAndZoom";
export type TimeSeriesChartType = "point" | "line" | "bar";

export type UserPlacesFormatName = "geojson" | "csv" | "wkt";

export interface UserPlacesFormatOptions {
  csv: CsvOptions;
  geojson: GeoJsonOptions;
  wkt: WktOptions;
}

export type LayerStates = Record<string, LayerState>;
export type LayerVisibilities = Record<string, boolean>;

export type LayerGroupStates = {
  overlays?: boolean;
  predefined?: boolean;
  baseMaps?: boolean;
};

export type ThemeMode = PaletteMode | "system";
export const THEME_NAMES: ThemeMode[] = ["light", "dark", "system"];
export const THEME_LABELS: [ThemeMode, string][] = [
  ["light", "Light"],
  ["dark", "Dark"],
  ["system", "System"],
];

export type VolumeRenderMode = "mip" | "aip" | "iso";
export type VolumeStatus = "loading" | "ok" | "error";
export type VolumeState = { status: VolumeStatus; message?: string };
export type VolumeStates = { [volumeId: string]: VolumeState };
export type ExportResolution = 96 | 150 | 300 | 600;

export interface ControlState {
  selectedDatasetId: string | null;
  selectedVariableName: string | null;
  selectedDataset2Id: string | null;
  selectedVariable2Name: string | null;
  selectedPlaceGroupIds: string[] | null;
  selectedPlaceId: string | null;
  selectedUserPlaceId: string | null;
  selectedServerId: string;
  selectedTime: Time | null;
  selectedTimeRange: TimeRange | null;
  timeSeriesUpdateMode: "add" | "replace";
  timeAnimationActive: boolean;
  timeAnimationInterval: TimeAnimationInterval;
  timeChunkSize: number;
  autoShowTimeSeries: boolean;
  timeSeriesChartTypeDefault: TimeSeriesChartType;
  timeSeriesIncludeStdev: boolean;
  timeSeriesUseMedian: boolean;
  userDrawnPlaceGroupName: string;
  userPlacesFormatName: UserPlacesFormatName;
  userPlacesFormatOptions: UserPlacesFormatOptions;
  flyTo: OlGeometry | OlExtent | null;
  activities: { [id: string]: string };
  locale: string;
  dialogOpen: { [dialogId: string]: boolean };
  privacyNoticeAccepted: boolean;
  mapInteraction: MapInteraction;
  lastMapInteraction: MapInteraction;
  layerMenuOpen: boolean;
  layerVisibilities: LayerVisibilities;
  layerGroupStates: LayerGroupStates;
  sidePanelOpen: boolean;
  sidePanelSize: number;
  sidePanelId: string | null;
  volumeRenderMode: VolumeRenderMode;
  volumeStates: VolumeStates;
  infoCardElementStates: InfoCardElementStates;
  mapProjection: string;
  imageSmoothingEnabled: boolean;
  variableCompareMode: boolean;
  variableSplitPos?: number;
  mapPointInfoBoxEnabled: boolean;
  userBaseMaps: LayerDefinition[];
  userOverlays: LayerDefinition[];
  userColorBars: UserColorBar[];
  datasetLocateMode: LocateMode;
  placeLocateMode: LocateMode;
  exportTimeSeries: boolean;
  exportPlaces: boolean;
  exportTimeSeriesSeparator: string;
  exportPlacesAsCollection: boolean;
  exportZipArchive: boolean;
  exportFileName: string;
  themeMode: ThemeMode;
  exportResolution: ExportResolution;
  showProgressBar: boolean;
  showZoomInfoBox: boolean;
  zoomLevel: number | undefined;
  datasetZLevel: number | undefined;
}

export function newControlState(): ControlState {
  const branding = Config.instance.branding;
  const state: ControlState = {
    selectedDatasetId: null,
    selectedVariableName: null,
    selectedDataset2Id: null,
    selectedVariable2Name: null,
    selectedPlaceGroupIds: [],
    selectedPlaceId: null,
    selectedUserPlaceId: null,
    selectedServerId: Config.instance.server.id,
    selectedTime: null,
    selectedTimeRange: null,
    timeSeriesUpdateMode: "add",
    timeAnimationActive: false,
    timeAnimationInterval: 1000,
    timeChunkSize: 20,
    autoShowTimeSeries: true,
    timeSeriesChartTypeDefault: "line",
    timeSeriesIncludeStdev: true,
    timeSeriesUseMedian: branding.defaultAgg === "median",
    userDrawnPlaceGroupName: "",
    userPlacesFormatName: "csv",
    userPlacesFormatOptions: {
      csv: { ...defaultCsvOptions },
      geojson: { ...defaultGeoJsonOptions },
      wkt: { ...defaultWktOptions },
    },
    flyTo: null,
    activities: {},
    locale: "en",
    dialogOpen: {},
    privacyNoticeAccepted: false,
    mapInteraction: "Select",
    lastMapInteraction: "Select",
    layerMenuOpen: false,
    layerVisibilities: {
      datasetRgb: false,
      datasetRgb2: false,
      datasetVariable: true,
      datasetVariable2: true,
      datasetBoundary: false,
      datasetPlaces: true,
      userPlaces: true,
      [defaultBaseMapId]: true,
      ...branding.layerVisibilities,
    },
    layerGroupStates: {
      overlays: false,
      predefined: true,
      baseMaps: false,
    },
    variableCompareMode: false,
    mapPointInfoBoxEnabled: false,
    datasetLocateMode: "panAndZoom",
    placeLocateMode: "panAndZoom",
    sidePanelOpen: false,
    sidePanelId: "details",
    sidePanelSize: Math.max(window.innerWidth, window.innerHeight) / 3,
    volumeRenderMode: "mip",
    volumeStates: {},
    infoCardElementStates: {
      dataset: { visible: true, viewMode: "text" },
      variable: { visible: true, viewMode: "text" },
      place: { visible: true, viewMode: "text" },
    },
    mapProjection: branding.mapProjection || DEFAULT_MAP_CRS,
    imageSmoothingEnabled: false,
    userBaseMaps: [],
    userOverlays: [],
    userColorBars: [],
    exportTimeSeries: true,
    exportTimeSeriesSeparator: "TAB",
    exportPlaces: true,
    exportPlacesAsCollection: true,
    exportZipArchive: true,
    exportFileName: "export",
    themeMode: getInitialThemeMode(),
    exportResolution: 300,
    showProgressBar: branding.showProgressBar ?? true,
    showZoomInfoBox: branding.showZoomInfoBox || false,
    zoomLevel: undefined,
    datasetZLevel: undefined,
  };
  return loadUserSettings(state);
}

function getInitialThemeMode(): ThemeMode {
  const themeMode = Config.instance.branding.themeMode;
  if (themeMode && THEME_NAMES.includes(themeMode)) {
    return themeMode;
  }
  return "system";
}

export function getPaletteMode(
  themeMode: ThemeMode,
  defaultPaletteMode?: PaletteMode,
): PaletteMode {
  if (!defaultPaletteMode) {
    defaultPaletteMode = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
  }
  return themeMode && THEME_NAMES.includes(themeMode) && themeMode !== "system"
    ? themeMode
    : defaultPaletteMode;
}

// We cannot keep "MAP_OBJECTS" in control state object, because these
// objects are (1) not serializable and (2) logging actions will cause
// the browsers to crash

export const MAP_OBJECTS: { [id: string]: OlBaseObject } = {};

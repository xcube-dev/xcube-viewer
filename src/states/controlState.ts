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

import { Extent as OlExtent } from "ol/extent";
import { Geometry as OlGeometry } from "ol/geom";
import { default as OlBaseObject } from "ol/Object";

import { Config } from "@/config";
import { Time, TimeRange } from "@/model/timeSeries";
import { defaultBaseMapId, LayerDefinition } from "@/model/layerDefinition";
import { loadUserSettings } from "./userSettings";
import { DEFAULT_MAP_CRS } from "@/model/proj";
import { CsvOptions, defaultCsvOptions } from "@/model/user-place/csv";
import {
  defaultGeoJsonOptions,
  GeoJsonOptions,
} from "@/model/user-place/geojson";
import { defaultWktOptions, WktOptions } from "@/model/user-place/wkt";

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

export type UserPlacesFormatName = "geojson" | "csv" | "wkt";

export interface UserPlacesFormatOptions {
  csv: CsvOptions;
  geojson: GeoJsonOptions;
  wkt: WktOptions;
}

export interface LayerVisibilities {
  baseMap?: boolean;
  datasetRgb?: boolean;
  datasetVariable?: boolean;
  datasetBoundary?: boolean;
  datasetPlaces?: boolean;
  userPlaces?: boolean;
  overlay?: boolean;
}

// TODO: check if really unused
// noinspection JSUnusedGlobalSymbols
export interface ExportSettings {
  format: "GeoJSON" | "CSV";
  multiFile: boolean;
  zipArchive: boolean;
}

export type VolumeRenderMode = "mip" | "aip" | "iso";
export type VolumeStatus = "loading" | "ok" | "error";
export type VolumeState = { status: VolumeStatus; message?: string };
export type VolumeStates = { [volumeId: string]: VolumeState };

export interface ControlState {
  selectedDatasetId: string | null;
  selectedVariableName: string | null;
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
  showTimeSeriesPointsOnly: boolean;
  showTimeSeriesErrorBars: boolean;
  showTimeSeriesMedian: boolean;
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
  volumeCardOpen: boolean;
  volumeRenderMode: VolumeRenderMode;
  volumeStates: VolumeStates;
  infoCardOpen: boolean;
  infoCardElementStates: InfoCardElementStates;
  mapProjection: string;
  imageSmoothingEnabled: boolean;
  layerVisibilities: LayerVisibilities;
  selectedBaseMapId: string | null;
  selectedOverlayId: string | null;
  userBaseMaps: LayerDefinition[];
  userOverlays: LayerDefinition[];
  datasetLocateMode: LocateMode;
  placeLocateMode: LocateMode;
  exportTimeSeries: boolean;
  exportPlaces: boolean;
  exportTimeSeriesSeparator: string;
  exportPlacesAsCollection: boolean;
  exportZipArchive: boolean;
  exportFileName: string;
}

export function newControlState(): ControlState {
  const branding = Config.instance.branding;
  const state: ControlState = {
    selectedDatasetId: null,
    selectedVariableName: null,
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
    showTimeSeriesPointsOnly: false,
    showTimeSeriesErrorBars: true,
    showTimeSeriesMedian: branding.defaultAgg === "median",
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
    mapInteraction: "Point",
    lastMapInteraction: "Point",
    layerVisibilities: {
      baseMap: true,
      datasetRgb: false,
      datasetVariable: true,
      datasetBoundary: false,
      datasetPlaces: true,
      userPlaces: true,
      overlay: true,
    },
    datasetLocateMode: "pan",
    placeLocateMode: "panAndZoom",
    volumeCardOpen: false,
    volumeRenderMode: "mip",
    volumeStates: {},
    infoCardOpen: false,
    infoCardElementStates: {
      dataset: { visible: true, viewMode: "text" },
      variable: { visible: true, viewMode: "text" },
      place: { visible: true, viewMode: "text" },
    },
    mapProjection: branding.mapProjection || DEFAULT_MAP_CRS,
    imageSmoothingEnabled: false,
    selectedBaseMapId: defaultBaseMapId,
    selectedOverlayId: null,
    userBaseMaps: [],
    userOverlays: [],
    exportTimeSeries: true,
    exportTimeSeriesSeparator: "TAB",
    exportPlaces: true,
    exportPlacesAsCollection: true,
    exportZipArchive: true,
    exportFileName: "export",
  };
  return loadUserSettings(state);
}

// We cannot keep "MAP_OBJECTS" in control state object, because these objects are (1) not serializable
// and (2) logging actions will cause the browsers to crash

export const MAP_OBJECTS: { [id: string]: OlBaseObject } = {};

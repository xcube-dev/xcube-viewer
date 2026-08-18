/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as geojson from "geojson";
import JSZip from "jszip";

import { PlaceGroup } from "./place";
import {
  TimeRange,
  TimeSeriesGroup,
  timeSeriesGroupsToGeoJSON,
  timeSeriesGroupsToTable,
  timeSeriesTableToDelimitedText,
} from "./timeSeries";

export type ExportDataType = "timeSeries" | "places";
export type ExportFormat = "text" | "geojson";
export type ExportTimeRange = "full" | "displayed";

export const EXPORT_DATA_TYPES: ExportDataType[] = ["timeSeries", "places"];
export const EXPORT_FORMATS: ExportFormat[] = ["text", "geojson"];
export const EXPORT_TIME_RANGES: ExportTimeRange[] = ["full", "displayed"];

export interface ExportOptions {
  dataType: ExportDataType;
  format: ExportFormat;
  timeRange: TimeRange | null;
  separator: string;
  fileName: string;
}

export interface ExportFile {
  fileName: string;
  content: string;
  contentType: string;
}

export function createExportArchive(exportFile: ExportFile): Promise<Blob> {
  const archive = new JSZip();
  archive.file(exportFile.fileName, exportFile.content);
  return archive.generateAsync({ type: "blob", compression: "DEFLATE" });
}

export function createExportFile(
  timeSeriesGroups: TimeSeriesGroup[],
  placeGroups: PlaceGroup[],
  options: ExportOptions,
): ExportFile {
  const { dataType, format, timeRange, separator, fileName } = options;
  const rootFileName = fileName || "export";
  if (dataType === "places") {
    return createGeoJSONExportFile(
      rootFileName,
      getPlacesCollection(placeGroups),
    );
  }
  if (format === "geojson") {
    return createGeoJSONExportFile(
      rootFileName,
      timeSeriesGroupsToGeoJSON(timeSeriesGroups, timeRange),
    );
  }
  const table = timeSeriesGroupsToTable(
    timeSeriesGroups,
    placeGroups,
    timeRange,
  );
  return {
    fileName: `${rootFileName}.txt`,
    content: timeSeriesTableToDelimitedText(table, getSeparator(separator)),
    contentType: "text/plain;charset=utf-8",
  };
}

function getSeparator(separator: string): string {
  return separator.toUpperCase() === "TAB" ? "\t" : separator;
}

function getPlacesCollection(
  placeGroups: PlaceGroup[],
): geojson.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: placeGroups.flatMap((placeGroup) => placeGroup.features || []),
  };
}

function createGeoJSONExportFile(
  fileName: string,
  content: object,
): ExportFile {
  return {
    fileName: `${fileName}.geojson`,
    content: JSON.stringify(content, null, 2),
    contentType: "application/geo+json;charset=utf-8",
  };
}

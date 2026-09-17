/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { describe, expect, it } from "vitest";

import { PlaceGroup } from "@/model/place";
import { TimeSeriesGroup } from "@/model/timeSeries";
import JSZip from "jszip";

import { createExportArchive, createExportFile } from "@/model/dataExport";

const firstTime = Date.parse("2024-01-01T00:00:00Z");
const secondTime = Date.parse("2024-01-02T00:00:00Z");

const placeGroups: PlaceGroup[] = [
  {
    id: "places",
    title: "Places",
    type: "FeatureCollection",
    features: [
      {
        id: "point-1",
        type: "Feature",
        geometry: { type: "Point", coordinates: [12.5, 48.1] },
        properties: {},
      },
    ],
  },
];

const timeSeriesGroups: TimeSeriesGroup[] = [
  {
    id: "group",
    timeSeriesArray: [
      {
        source: {
          datasetId: "dataset",
          datasetTitle: "Dataset",
          variableName: "temperature",
          placeId: "point-1",
          geometry: { type: "Point", coordinates: [12.5, 48.1] },
          valueDataKey: "mean",
          errorDataKey: null,
        },
        data: [
          { time: firstTime, countTot: 1, mean: 280 },
          { time: secondTime, countTot: 1, mean: 281 },
        ],
      },
    ],
  },
];

describe("createExportFile", () => {
  it("creates one text file containing place information and values", () => {
    const exportFile = createExportFile(timeSeriesGroups, placeGroups, {
      dataType: "timeSeries",
      format: "text",
      timeRange: null,
      separator: "TAB",
      fileName: "series",
    });

    expect(exportFile.fileName).toBe("series.txt");
    expect(exportFile.contentType).toBe("text/plain;charset=utf-8");
    expect(exportFile.content).toContain(
      "placeId\tlongitude\tlatitude\tgeometry\ttime\tdataset.temperature.mean",
    );
    expect(exportFile.content).toContain(
      'point-1\t12.5\t48.1\t"{""type"":""Point"",""coordinates"":[12.5,48.1]}"\t2024-01-01 00:00:00\t280',
    );
  });

  it("creates one filtered GeoJSON time-series file", () => {
    const exportFile = createExportFile(timeSeriesGroups, placeGroups, {
      dataType: "timeSeries",
      format: "geojson",
      timeRange: [secondTime, secondTime],
      separator: "TAB",
      fileName: "series",
    });

    expect(exportFile.fileName).toBe("series.geojson");
    expect(exportFile.contentType).toBe("application/geo+json;charset=utf-8");
    expect(JSON.parse(exportFile.content)).toMatchObject({
      type: "FeatureCollection",
      features: [
        {
          geometry: { type: "Point", coordinates: [12.5, 48.1] },
          properties: {
            placeId: "point-1",
            data: [{ time: "2024-01-02 00:00:00", mean: 281 }],
          },
        },
      ],
    });
  });

  it("keeps the places-only export as one GeoJSON file", () => {
    const exportFile = createExportFile([], placeGroups, {
      dataType: "places",
      format: "text",
      timeRange: null,
      separator: "TAB",
      fileName: "places",
    });

    expect(exportFile.fileName).toBe("places.geojson");
    expect(JSON.parse(exportFile.content)).toEqual({
      type: "FeatureCollection",
      features: placeGroups[0].features,
    });
  });

  it("wraps exactly the generated export file when ZIP compression is selected", async () => {
    const exportFile = createExportFile(timeSeriesGroups, placeGroups, {
      dataType: "timeSeries",
      format: "text",
      timeRange: null,
      separator: "TAB",
      fileName: "series",
    });

    const archive = await JSZip.loadAsync(
      await createExportArchive(exportFile),
    );

    expect(Object.keys(archive.files)).toEqual(["series.txt"]);
    await expect(archive.file("series.txt")!.async("string")).resolves.toBe(
      exportFile.content,
    );
  });
});

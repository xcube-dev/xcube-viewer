/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { describe, expect, it } from "vitest";
import * as geojson from "geojson";

import { Place, PlaceGroup } from "./place";
import {
  TimeSeries,
  TimeSeriesGroup,
  timeSeriesGroupsToGeoJSON,
  timeSeriesGroupsToTable,
  timeSeriesTableToDelimitedText,
} from "./timeSeries";

const firstTime = Date.parse("2024-01-01T00:00:00Z");
const secondTime = Date.parse("2024-01-02T00:00:00Z");

const sourcePointGeometry: geojson.Point = {
  type: "Point",
  coordinates: [12.5, 48.1],
};

const pointPlace: Place = {
  id: "point-1",
  type: "Feature",
  // The source geometry must take precedence over a later changed place.
  geometry: { type: "Point", coordinates: [0, 0] },
  properties: {},
};

const polygonPlace: Place = {
  id: "polygon-1",
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [10, 40],
        [11, 40],
        [11, 41],
        [10, 40],
      ],
    ],
  },
  properties: {},
};

const placeGroups: PlaceGroup[] = [
  {
    id: "places",
    title: "Places",
    type: "FeatureCollection",
    features: [pointPlace, polygonPlace],
  },
];

const temperatureSeries: TimeSeries = {
  source: {
    datasetId: "dataset",
    datasetTitle: "Dataset",
    variableName: "temperature",
    variableUnits: "K",
    placeId: "point-1",
    geometry: sourcePointGeometry,
    valueDataKey: "mean",
    errorDataKey: "std",
  },
  data: [
    { time: firstTime, countTot: 1, mean: 280, std: 0.2 },
    { time: secondTime, countTot: 1, mean: 281, std: 0.3 },
  ],
};

const precipitationSeries: TimeSeries = {
  source: {
    datasetId: "dataset",
    datasetTitle: "Dataset",
    variableName: "precipitation",
    variableUnits: "mm",
    placeId: "point-1",
    geometry: sourcePointGeometry,
    valueDataKey: "mean",
    errorDataKey: null,
  },
  data: [
    { time: firstTime, countTot: 1, mean: 3 },
    { time: secondTime, countTot: 1, mean: 4 },
  ],
};

const polygonSeries: TimeSeries = {
  source: {
    datasetId: "dataset",
    datasetTitle: "Dataset",
    variableName: "temperature",
    variableUnits: "K",
    placeId: "polygon-1",
    geometry: polygonPlace.geometry,
    valueDataKey: "mean",
    errorDataKey: null,
  },
  data: [{ time: firstTime, countTot: 1, mean: 279 }],
};

const timeSeriesGroups: TimeSeriesGroup[] = [
  {
    id: "group",
    timeSeriesArray: [temperatureSeries, precipitationSeries, polygonSeries],
  },
];

describe("time-series export tables", () => {
  it("includes place IDs, coordinates, geometries, and merged values", () => {
    const table = timeSeriesGroupsToTable(timeSeriesGroups, placeGroups);

    expect(table.colNames).toEqual([
      "placeId",
      "longitude",
      "latitude",
      "geometry",
      "time",
      "dataset.precipitation.mean",
      "dataset.temperature.mean",
      "dataset.temperature.std",
    ]);
    expect(table.dataRows).toEqual([
      [
        "point-1",
        12.5,
        48.1,
        JSON.stringify(sourcePointGeometry),
        "2024-01-01 00:00:00",
        3,
        280,
        0.2,
      ],
      [
        "polygon-1",
        null,
        null,
        JSON.stringify(polygonPlace.geometry),
        "2024-01-01 00:00:00",
        undefined,
        279,
        undefined,
      ],
      [
        "point-1",
        12.5,
        48.1,
        JSON.stringify(sourcePointGeometry),
        "2024-01-02 00:00:00",
        4,
        281,
        0.3,
      ],
    ]);
  });

  it("keeps missing place references and imported series exportable", () => {
    const importedSeries: TimeSeries = {
      source: {
        datasetId: "imported",
        datasetTitle: "Imported",
        variableName: "value",
        placeId: null,
        geometry: null,
        valueDataKey: "mean",
        errorDataKey: null,
      },
      data: [{ time: firstTime, countTot: 1, mean: 2 }],
    };
    const missingPlaceSeries: TimeSeries = {
      ...temperatureSeries,
      source: { ...temperatureSeries.source, placeId: "missing-place" },
      data: [{ time: firstTime, countTot: 1, mean: 282 }],
    };

    const table = timeSeriesGroupsToTable(
      [{ id: "group", timeSeriesArray: [importedSeries, missingPlaceSeries] }],
      [],
    );

    expect(table.dataRows).toEqual([
      [null, null, null, null, "2024-01-01 00:00:00", undefined, undefined, 2],
      [
        "missing-place",
        12.5,
        48.1,
        JSON.stringify(sourcePointGeometry),
        "2024-01-01 00:00:00",
        282,
        undefined,
        undefined,
      ],
    ]);
    expect(table.referencedPlaces).toEqual({});
  });

  it("filters the displayed range inclusively and safely formats delimited text", () => {
    const table = timeSeriesGroupsToTable(timeSeriesGroups, placeGroups, [
      secondTime,
      secondTime,
    ]);

    expect(table.dataRows).toHaveLength(1);
    expect(table.dataRows[0][4]).toBe("2024-01-02 00:00:00");

    const commaSeparated = timeSeriesTableToDelimitedText(table, ",");
    expect(commaSeparated).toContain(
      '"{""type"":""Point"",""coordinates"":[12.5,48.1]}"',
    );
  });
});

describe("time-series GeoJSON export", () => {
  it("preserves geometry, place ID, values, and the selected time range", () => {
    const collection = timeSeriesGroupsToGeoJSON(
      [
        {
          id: "group",
          timeSeriesArray: [temperatureSeries, polygonSeries],
        },
      ],
      [secondTime, secondTime],
    );

    expect(collection).toEqual({
      type: "FeatureCollection",
      features: [
        {
          id: "dataset-temperature-point-1",
          type: "Feature",
          geometry: sourcePointGeometry,
          properties: {
            datasetId: "dataset",
            datasetTitle: "Dataset",
            variableName: "temperature",
            variableUnits: "K",
            placeId: "point-1",
            valueDataKey: "mean",
            errorDataKey: "std",
            data: [
              {
                time: "2024-01-02 00:00:00",
                countTot: 1,
                mean: 281,
                std: 0.3,
              },
            ],
          },
        },
      ],
    });
  });
});

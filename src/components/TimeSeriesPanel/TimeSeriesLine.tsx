/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { PaletteMode } from "@mui/material";
import { Bar, ErrorBar, Line } from "recharts";

import { getUserPlaceColor } from "@/config";
import { Place, PlaceInfo } from "@/model/place";
import {
  PlaceGroupTimeSeries,
  TimeSeries,
  TimeSeriesGroup,
} from "@/model/timeSeries";
import { TimeSeriesChartType } from "@/states/controlState";
import CustomDot from "./CustomDot";

interface TimeSeriesLineProps {
  timeSeriesGroup: TimeSeriesGroup;
  timeSeriesIndex: number;
  // Not implemented yet
  selectTimeSeries?: (
    timeSeriesGroupId: string,
    timeSeriesIndex: number,
    timeSeries: TimeSeries,
  ) => void;
  places: Place[];
  selectPlace: (
    placeId: string | null,
    places: Place[],
    showInMap: boolean,
  ) => void;
  placeInfos: { [placeId: string]: PlaceInfo };
  placeGroupTimeSeries: PlaceGroupTimeSeries[];
  paletteMode: PaletteMode;
  chartType: TimeSeriesChartType;
  stdevBars: boolean;
}

export default function TimeSeriesLine({
  timeSeriesGroup,
  timeSeriesIndex,
  selectTimeSeries,
  places,
  selectPlace,
  placeInfos,
  placeGroupTimeSeries,
  paletteMode,
  chartType,
  stdevBars,
}: TimeSeriesLineProps) {
  // WARNING: we cannot use hooks here, as this is not a normal component!
  // See usage in TimeSeriesChart component.

  const timeSeries = timeSeriesGroup.timeSeriesArray[timeSeriesIndex];
  const source = timeSeries.source;

  const handleClick = () => {
    if (selectTimeSeries) {
      selectTimeSeries(timeSeriesGroup.id, timeSeriesIndex, timeSeries);
    }
    selectPlace(timeSeries.source.placeId, places, true);
  };

  let lineName = `${source.datasetTitle}:${source.variableName}`;
  let lineColor = "red";
  const depthLabel = source.depth ? `, Depth: ${source.depth}` : ``;

  if (source.placeId === null) {
    // Time series is from imported CSV or GeoJSON.
    // Then source.datasetId is the place group name.
    // Try detecting line color from a place group's first place color
    let placeLineColor: string | null = null;
    placeGroupTimeSeries.forEach((pgTs) => {
      if (placeLineColor === null && pgTs.placeGroup.id === source.datasetId) {
        const places = pgTs.placeGroup.features!;
        if (places.length > 0 && places[0].properties) {
          placeLineColor = places[0].properties["color"] || null;
        }
      }
    });
    lineColor = placeLineColor || "red";
  } else if (placeInfos) {
    const placeInfo = placeInfos[source.placeId];
    if (placeInfo) {
      const { place, label, color } = placeInfo;
      if (place.geometry.type === "Point") {
        const lon = place.geometry.coordinates[0];
        const lat = place.geometry.coordinates[1];
        lineName += ` (${label}: ${lat.toFixed(5)},${lon.toFixed(5)}${depthLabel})`;
      } else {
        lineName += ` (${label}${depthLabel})`;
      }
      lineColor = color;
    }
  }

  const shadedLineColor = getUserPlaceColor(lineColor, paletteMode);

  let strokeOpacity;
  let dotProps: {
    radius: number;
    strokeWidth: number;
    symbol: "diamond" | "circle";
  };
  if (timeSeries.source.placeId === null) {
    strokeOpacity = 0;
    dotProps = {
      radius: 5,
      strokeWidth: 1.5,
      symbol: "diamond",
    };
  } else {
    strokeOpacity = chartType === "point" ? 0 : timeSeries.dataProgress;
    dotProps = {
      radius: 3,
      strokeWidth: 2,
      symbol: "circle",
    };
  }

  const errorBar = stdevBars && source.valueDataKey && source.errorDataKey && (
    <ErrorBar
      dataKey={`ev${timeSeriesIndex}`}
      width={4}
      strokeWidth={1}
      stroke={shadedLineColor}
      strokeOpacity={0.5}
    />
  );

  return chartType === "bar" ? (
    <Bar
      key={timeSeriesIndex}
      type="monotone"
      name={lineName}
      unit={source.variableUnits}
      dataKey={`v${timeSeriesIndex}`}
      fill={shadedLineColor}
      fillOpacity={strokeOpacity}
      isAnimationActive={false}
      onClick={handleClick}
    >
      {errorBar}
    </Bar>
  ) : (
    <Line
      key={timeSeriesIndex}
      type="monotone"
      name={lineName}
      unit={source.variableUnits}
      dataKey={`v${timeSeriesIndex}`}
      dot={<CustomDot {...dotProps} stroke={shadedLineColor} fill={"white"} />}
      activeDot={
        <CustomDot {...dotProps} stroke={"white"} fill={shadedLineColor} />
      }
      stroke={shadedLineColor}
      strokeOpacity={strokeOpacity}
      isAnimationActive={false}
      onClick={handleClick}
    >
      {errorBar}
    </Line>
  );
}

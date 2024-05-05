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

import { ErrorBar, Line } from "recharts";

import { getUserPlaceColor } from "@/config";
import { Place, PlaceInfo } from "@/model/place";
import {
  PlaceGroupTimeSeries,
  TimeSeries,
  TimeSeriesGroup,
} from "@/model/timeSeries";
import CustomDot from "./CustomDot";
import { PaletteMode } from "@mui/material";

interface TimeSeriesLineProps {
  timeSeriesGroup: TimeSeriesGroup;
  timeSeriesIndex: number;
  showPointsOnly: boolean;
  showErrorBars: boolean;
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
}

export default function TimeSeriesLine({
  timeSeriesGroup,
  timeSeriesIndex,
  showErrorBars,
  showPointsOnly,
  selectTimeSeries,
  places,
  selectPlace,
  placeInfos,
  placeGroupTimeSeries,
  paletteMode,
}: TimeSeriesLineProps) {
  const timeSeries = timeSeriesGroup.timeSeriesArray[timeSeriesIndex];

  const handleClick = () => {
    if (selectTimeSeries) {
      selectTimeSeries(timeSeriesGroup.id, timeSeriesIndex, timeSeries);
    }
    selectPlace(timeSeries.source.placeId, places, true);
  };

  const source = timeSeries.source;
  const valueDataKey = source.valueDataKey;
  let lineName = source.variableName;
  let lineColor = "red";
  if (source.placeId === null) {
    // Time series is from imported CSV or GeoJSON.
    // Then source.datasetId is the place group name.
    lineName = `${source.datasetTitle}/${lineName}`;
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
        lineName += ` (${label}: ${lat.toFixed(5)},${lon.toFixed(5)})`;
      } else {
        lineName += ` (${label})`;
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
    strokeOpacity = showPointsOnly ? 0 : timeSeries.dataProgress;
    dotProps = {
      radius: 3,
      strokeWidth: 2,
      symbol: "circle",
    };
  }

  return (
    <Line
      key={timeSeriesIndex}
      type="monotone"
      name={lineName}
      unit={source.variableUnits}
      data={timeSeries.data}
      dataKey={valueDataKey}
      dot={<CustomDot {...dotProps} stroke={shadedLineColor} fill={"white"} />}
      activeDot={
        <CustomDot {...dotProps} stroke={"white"} fill={shadedLineColor} />
      }
      stroke={shadedLineColor}
      strokeOpacity={strokeOpacity}
      // strokeWidth={2 * (ts.dataProgress || 1)}
      // See https://github.com/recharts/recharts/issues/1624#issuecomment-474119055
      // isAnimationActive={ts.dataProgress === 1.0}
      isAnimationActive={false}
      onClick={handleClick}
    >
      {valueDataKey && showErrorBars && source.errorDataKey && (
        <ErrorBar
          dataKey={source.errorDataKey}
          width={4}
          strokeWidth={1}
          stroke={shadedLineColor}
        />
      )}
    </Line>
  );
}

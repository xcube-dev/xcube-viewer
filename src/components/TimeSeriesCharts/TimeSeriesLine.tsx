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
  TimeRange,
  TimeSeries,
  TimeSeriesGroup,
  TimeSeriesPoint,
} from "@/model/timeSeries";
import CustomDot from "./CustomDot";
import { PaletteMode } from "@mui/material";

interface TimeSeriesLineProps {
  timeSeriesGroup: TimeSeriesGroup;
  timeSeriesIndex: number;
  showPointsOnly: boolean;
  showErrorBars: boolean;
  selectedTimeRange: TimeRange | null;
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
  selectedTimeRange,
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

  const [time1, time2] = selectedTimeRange ? selectedTimeRange : [null, null];

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

  const data: TimeSeriesPoint[] = [];
  timeSeries.data.forEach((point) => {
    if (point[valueDataKey] !== null) {
      let time1Ok = true;
      let time2Ok = true;
      if (time1 !== null) {
        time1Ok = point.time >= time1;
      }
      if (time2 !== null) {
        time2Ok = point.time <= time2;
      }
      if (time1Ok && time2Ok) {
        data.push(point);
      }
    }
  });

  const shadedLineColor = getUserPlaceColor(lineColor, paletteMode);
  let errorBar;
  if (valueDataKey && showErrorBars && source.errorDataKey) {
    errorBar = (
      <ErrorBar
        dataKey={source.errorDataKey}
        width={4}
        strokeWidth={1}
        stroke={shadedLineColor}
      />
    );
  }

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

  const dot = (
    <CustomDot {...dotProps} stroke={shadedLineColor} fill={"white"} />
  );
  const activeDot = (
    <CustomDot {...dotProps} stroke={"white"} fill={shadedLineColor} />
  );

  return (
    <Line
      type="monotone"
      name={lineName}
      unit={source.variableUnits}
      data={data}
      dataKey={valueDataKey}
      dot={dot}
      activeDot={activeDot}
      stroke={shadedLineColor}
      strokeOpacity={strokeOpacity}
      // strokeWidth={2 * (ts.dataProgress || 1)}
      // See https://github.com/recharts/recharts/issues/1624#issuecomment-474119055
      // isAnimationActive={ts.dataProgress === 1.0}
      isAnimationActive={false}
      onClick={handleClick}
    >
      {errorBar}
    </Line>
  );
}

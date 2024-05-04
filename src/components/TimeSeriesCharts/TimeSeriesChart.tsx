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

import { useState, useRef, MouseEvent } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { Theme, useTheme } from "@mui/material/styles";
import {
  CartesianGrid,
  Legend,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CategoricalChartState } from "recharts/types/chart/types";

import { Place, PlaceInfo } from "@/model/place";
import {
  equalTimeRanges,
  PlaceGroupTimeSeries,
  Time,
  TimeRange,
  TimeSeries,
  TimeSeriesGroup,
  TimeSeriesPoint,
} from "@/model/timeSeries";
import { WithLocale } from "@/util/lang";
import CustomLegend from "./CustomLegend";
import CustomTooltip from "./CustomTooltip";
import TimeSeriesLine from "@/components/TimeSeriesCharts/TimeSeriesLine";
import TimeSeriesChartHeader from "@/components/TimeSeriesCharts/TimeSeriesChartHeader";
import { isNumber } from "@/util/types";
import {
  formatTimeTick,
  formatValueTick,
} from "@/components/TimeSeriesCharts/util";

// Fix typing problem in recharts v2.12.4
type CategoricalChartState_Fixed = Omit<
  CategoricalChartState,
  "activeLabel"
> & { activeLabel?: number };

const useStyles = makeStyles((theme: Theme) => ({
  chartContainer: {
    userSelect: "none",
    marginTop: theme.spacing(1),
    width: "99%",
    height: "32vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-stretch",
  },
  responsiveContainer: {
    flexGrow: 1,
  },
}));

interface TimeRangeSelection {
  time1?: number;
  value1?: number;
  time2?: number;
  value2?: number;
}

interface TimeSeriesChartProps extends WithLocale {
  timeSeriesGroup: TimeSeriesGroup;
  selectedTime: Time | null;
  selectTime: (time: Time | null) => void;
  dataTimeRange: TimeRange | null;
  selectedTimeRange: TimeRange | null;
  selectTimeRange: (
    timeRange: TimeRange | null,
    groupId?: string,
    valueRange?: [number, number] | null,
  ) => void;
  showPointsOnly: boolean;
  showErrorBars: boolean;
  // Not implemented yet
  selectTimeSeries?: (
    timeSeriesGroupId: string,
    timeSeriesIndex: number,
    timeSeries: TimeSeries,
  ) => void;
  removeTimeSeries: (
    timeSeriesGroupId: string,
    timeSeriesIndex: number,
  ) => void;
  removeTimeSeriesGroup: (timeSeriesGroupId: string) => void;
  placeInfos: { [placeId: string]: PlaceInfo };
  selectPlace: (
    placeId: string | null,
    places: Place[],
    showInMap: boolean,
  ) => void;
  places: Place[];
  placeGroupTimeSeries: PlaceGroupTimeSeries[];
  addPlaceGroupTimeSeries: (
    timeSeriesGroupId: string,
    timeSeries: TimeSeries,
  ) => void;
}

export default function TimeSeriesChart({
  timeSeriesGroup,
  selectTimeSeries,
  selectedTime,
  selectTime,
  selectedTimeRange,
  selectTimeRange,
  places,
  selectPlace,
  placeInfos,
  dataTimeRange,
  showErrorBars,
  showPointsOnly,
  removeTimeSeries,
  removeTimeSeriesGroup,
  placeGroupTimeSeries,
  addPlaceGroupTimeSeries,
}: TimeSeriesChartProps) {
  const theme = useTheme();
  const classes = useStyles();

  const [timeRangeSelection, setTimeRangeSelection] =
    useState<TimeRangeSelection>({});
  const xDomain = useRef<[number, number]>();
  const yDomain = useRef<[number, number]>();
  const chartSize = useRef<[number, number]>();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const legendWrapperRef = useRef<HTMLDivElement | null>(null);

  const completed = timeSeriesGroup.timeSeriesArray.map((item) =>
    item.dataProgress ? item.dataProgress : 0,
  );
  const progress =
    completed.reduce((a: number, b: number) => a + b, 0) / completed.length;
  const loading = progress > 0 && progress < 1;
  const zoomed =
    !!selectedTimeRange &&
    !equalTimeRanges(selectedTimeRange, dataTimeRange || null);

  let commonValueDataKey: keyof TimeSeriesPoint | null = null;
  timeSeriesGroup.timeSeriesArray.forEach((ts) => {
    const source = ts.source;
    const valueDataKey = source.valueDataKey;
    if (commonValueDataKey === null) {
      commonValueDataKey = valueDataKey;
    }
  });

  const lightStroke = theme.palette.primary.light;
  const mainStroke = theme.palette.primary.main;
  const labelTextColor = theme.palette.text.primary;

  const clearTimeRangeSelection = () => {
    setTimeRangeSelection({});
  };

  const handleClick = (
    chartState: CategoricalChartState | CategoricalChartState_Fixed,
  ) => {
    if (
      chartState &&
      selectTime &&
      isNumber(chartState.activeLabel) &&
      Number.isFinite(chartState.activeLabel)
    ) {
      selectTime(chartState.activeLabel);
    }
    clearTimeRangeSelection();
  };

  const handleMouseDown = (
    chartState: CategoricalChartState | CategoricalChartState_Fixed | null,
  ) => {
    if (!chartState) {
      return;
    }
    const { chartX, chartY } = chartState;
    if (!isNumber(chartX) || !isNumber(chartY)) {
      return;
    }
    const point1 = getChartCoords(chartX, chartY);
    if (point1) {
      const [time1, value1] = point1;
      setTimeRangeSelection({ time1, value1 });
    }
  };

  const handleMouseMove = (
    chartState: CategoricalChartState | CategoricalChartState_Fixed | null,
    mouseEvent: MouseEvent<HTMLElement>,
  ) => {
    const { time1, value1 } = timeRangeSelection;
    if (!isNumber(time1) || !isNumber(value1)) {
      return;
    }
    if (!chartState) {
      return;
    }
    const { chartX, chartY } = chartState;
    if (!isNumber(chartX) || !isNumber(chartY)) {
      return;
    }
    const point2 = getChartCoords(chartX, chartY);
    if (point2) {
      const [time2, value2] = point2;
      if (mouseEvent.ctrlKey) {
        setTimeRangeSelection({
          time1,
          value1,
          time2,
          value2,
        });
      } else {
        setTimeRangeSelection({
          time1,
          value1,
          time2,
        });
      }
    }
  };

  const handleMouseUp = () => {
    zoomIn();
  };

  const handleMouseEnter = () => {
    clearTimeRangeSelection();
  };

  const handleMouseLeave = () => {
    clearTimeRangeSelection();
  };

  const handleRemoveTimeSeriesClick = (index: number) => {
    removeTimeSeries!(timeSeriesGroup.id, index);
  };

  const zoomIn = () => {
    const [selectedXRange, selectedYRange] =
      normalizeTimeRangeSelection(timeRangeSelection);
    if (selectedXRange && selectedXRange[0] < selectedXRange[1]) {
      if (selectedYRange) {
        selectTimeRange(selectedXRange, timeSeriesGroup.id, selectedYRange);
      } else {
        selectTimeRange(selectedXRange, timeSeriesGroup.id, null);
      }
    } else {
      clearTimeRangeSelection();
    }
  };

  const resetZoom = () => {
    clearTimeRangeSelection();
    selectTimeRange(dataTimeRange || null, timeSeriesGroup.id, null);
  };

  const handleChartResize = (w: number, h: number) => {
    chartSize.current = [w, h];
    if (containerRef.current) {
      // Hack: get the recharts legend wrapper div, so we can use its height
      // to compute cartesian chart coordinates
      const elements = containerRef.current.getElementsByClassName(
        "recharts-legend-wrapper",
      );
      if (elements.length !== 0) {
        legendWrapperRef.current = elements.item(0) as HTMLDivElement;
      }
    }
  };

  const getXDomain = ([dataMin, dataMax]: [number, number]) => {
    const padding = (dataMax - dataMin) * 0.1;
    if (selectedTimeRange) {
      xDomain.current = selectedTimeRange;
    } else {
      xDomain.current = [dataMin - padding, dataMax + padding];
    }
    return xDomain.current;
  };

  const getYDomain = ([dataMin, dataMax]: [number, number]) => {
    const padding = (dataMax - dataMin) * 0.1;
    if (timeSeriesGroup.variableRange) {
      yDomain.current = timeSeriesGroup.variableRange;
    } else {
      yDomain.current = [dataMin - padding, dataMax + padding];
    }
    return yDomain.current;
  };

  const getChartCoords = (
    chartX: number,
    chartY: number,
  ): [number, number] | undefined => {
    const legendWrapperEl = legendWrapperRef.current;
    if (
      !chartSize.current ||
      !xDomain.current ||
      !yDomain.current ||
      !legendWrapperEl
    ) {
      return undefined;
    }
    const [xMin, xMax] = xDomain.current;
    const [yMin, yMax] = yDomain.current;
    const [chartWidth, chartHeight] = chartSize.current;
    const legendHeight = legendWrapperEl.clientHeight;
    // WARNING: There is no recharts API to retrieve margin values of
    // the cartesian grid SVG group.
    // They have been found by manual analysis and may change for any
    // recharts update!
    const MARGIN_LEFT = 65;
    const MARGIN_TOP = 5;
    const MARGIN_RIGHT = 5;
    const MARGIN_BOTTOM = 34;
    const cartesianGridWidth = chartWidth - MARGIN_LEFT - MARGIN_RIGHT;
    const cartesianGridHeight =
      chartHeight - MARGIN_TOP - MARGIN_BOTTOM - legendHeight;
    const wx = (chartX - MARGIN_LEFT) / cartesianGridWidth;
    const wy = (chartY - MARGIN_TOP) / cartesianGridHeight;
    // Find margin --> wx,wy must be in range 0...1
    // console.log("-------------------------------------------");
    // console.log("wx, wy:", wx, wy);
    return [xMin + wx * (xMax - xMin), yMax - wy * (yMax - yMin)];
  };

  const [selectedXRange, selectedYRange] =
    normalizeTimeRangeSelection(timeRangeSelection);

  return (
    <div ref={containerRef} className={classes.chartContainer}>
      <TimeSeriesChartHeader
        timeSeriesGroup={timeSeriesGroup}
        placeGroupTimeSeries={placeGroupTimeSeries}
        addPlaceGroupTimeSeries={addPlaceGroupTimeSeries}
        removeTimeSeriesGroup={removeTimeSeriesGroup}
        resetZoom={resetZoom}
        loading={loading}
        zoomed={zoomed}
      />
      <ResponsiveContainer
        // 99% per https://github.com/recharts/recharts/issues/172
        width="98%"
        className={classes.responsiveContainer}
        onResize={handleChartResize}
      >
        <LineChart
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          syncId="anyId"
          style={{ color: labelTextColor, fontSize: "0.8em" }}
        >
          <XAxis
            dataKey="time"
            type="number"
            tickCount={6}
            domain={getXDomain}
            tickFormatter={formatTimeTick}
            stroke={labelTextColor}
            allowDataOverflow
          />
          <YAxis
            dataKey={commonValueDataKey || "mean"}
            type="number"
            tickCount={5}
            domain={getYDomain}
            tickFormatter={formatValueTick}
            stroke={labelTextColor}
            allowDataOverflow
          />
          <CartesianGrid strokeDasharray="3 3" />
          {!isNumber(timeRangeSelection.time1) && (
            <Tooltip content={<CustomTooltip />} />
          )}
          <Legend
            content={
              <CustomLegend removeTimeSeries={handleRemoveTimeSeriesClick} />
            }
          />
          {timeSeriesGroup.timeSeriesArray.map((_, timeSeriesIndex) =>
            // Note, we cannot render TimeSeriesLine as JSX node, because
            // recharts won't recognize the resulting higher-order component as
            // a "Line" element.
            TimeSeriesLine({
              timeSeriesGroup,
              timeSeriesIndex,
              selectTimeSeries,
              selectedTimeRange,
              showPointsOnly,
              showErrorBars,
              places,
              selectPlace,
              placeGroupTimeSeries,
              placeInfos,
              paletteMode: theme.palette.mode,
            }),
          )}
          {selectedXRange && (
            <ReferenceArea
              x1={selectedXRange[0]}
              y1={selectedYRange ? selectedYRange[0] : undefined}
              x2={selectedXRange[1]}
              y2={selectedYRange ? selectedYRange[1] : undefined}
              strokeOpacity={0.3}
              fill={lightStroke}
              fillOpacity={0.3}
            />
          )}
          {selectedTime !== null && (
            <ReferenceLine
              isFront={true}
              x={selectedTime}
              stroke={mainStroke}
              strokeWidth={3}
              strokeOpacity={0.5}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function normalizeTimeRangeSelection(timeRangeSelection: TimeRangeSelection) {
  const { time1, time2, value1, value2 } = timeRangeSelection;
  let timeRange: [number, number] | undefined = undefined;
  let valueRange: [number, number] | undefined = undefined;
  if (isNumber(time1) && isNumber(time2)) {
    timeRange = time1 < time2 ? [time1, time2] : [time2, time1];
    if (isNumber(value1) && isNumber(value2)) {
      valueRange = value1 < value2 ? [value1, value2] : [value2, value1];
    }
  }
  return [timeRange, valueRange];
}

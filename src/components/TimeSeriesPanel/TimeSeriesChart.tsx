/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart,
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
import { styled, useTheme } from "@mui/system";

import { Place, PlaceInfo } from "@/model/place";
import { TimeSeriesChartType } from "@/states/controlState";
import { MessageType } from "@/states/messageLogState";
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
import { isNumber } from "@/util/types";
import { formatTimeTick, formatValueTick } from "./util";
import CustomLegend from "./CustomLegend";
import CustomTooltip from "./CustomTooltip";
import TimeSeriesLine from "./TimeSeriesLine";
import TimeSeriesChartHeader from "./TimeSeriesChartHeader";
import i18n from "@/i18n";

// Fix typing problem in recharts v2.12.4
type CategoricalChartState_Fixed = Omit<
  CategoricalChartState,
  "activeLabel"
> & { activeLabel?: number };

const StyledContainerDiv = styled("div")(({ theme }) => ({
  userSelect: "none",
  marginTop: theme.spacing(1),
  width: "99%",
  height: "32vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-stretch",
}));

interface Rectangle {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}

type ValueRange = [number, number];

const Y_AXIS_LABEL = {
  style: { textAnchor: "middle" },
  angle: -90,
  position: "left",
  offset: 0,
};

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
  chartTypeDefault: TimeSeriesChartType;
  includeStdev: boolean;
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
  postMessage: (messageType: MessageType, messageText: string | Error) => void;
  selectedDatasetTitle: string | null;
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
  chartTypeDefault,
  includeStdev,
  removeTimeSeries,
  removeTimeSeriesGroup,
  placeGroupTimeSeries,
  addPlaceGroupTimeSeries,
  postMessage,
  selectedDatasetTitle,
}: TimeSeriesChartProps) {
  const theme = useTheme();

  const [zoomMode, setZoomMode] = useState(false);
  const [showTooltips, setShowTooltips] = useState(true);
  const [chartType, setChartType] = useState(chartTypeDefault);
  const [stdevBars, setStdevBars] = useState(includeStdev);
  const [zoomRectangle, setZoomRectangle] = useState<Rectangle>({});
  const xDomain = useRef<[number, number]>();
  const yDomain = useRef<[number, number]>();
  const chartSize = useRef<[number, number]>();
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const legendWrapperRef = useRef<HTMLDivElement | null>(null);
  const data = useMemo(() => {
    const dataMap = new Map<number, Record<string, number>>();
    timeSeriesGroup.timeSeriesArray.forEach((ts, i) => {
      const newValueDataKey = `v${i}`;
      const newErrorDataKey = `ev${i}`;
      const valueDataKey = ts.source.valueDataKey;
      const errorDataKey = ts.source.errorDataKey;
      ts.data.forEach((tsp) => {
        const oldP = dataMap.get(tsp.time);
        let newP: Record<string, number>;
        if (oldP === undefined) {
          newP = { time: tsp.time };
          dataMap.set(tsp.time, newP);
        } else {
          newP = oldP;
        }
        const v = tsp[valueDataKey];
        if (isNumber(v) && isFinite(v)) {
          newP[newValueDataKey] = v;
        }
        if (errorDataKey) {
          const ev = tsp[errorDataKey];
          if (isNumber(ev) && isFinite(ev)) {
            newP[newErrorDataKey] = ev;
          }
        }
      });
    });
    const data = Array.from(dataMap.values());
    data.sort((p1, p2) => p1.time - p2.time);
    return data;
  }, [timeSeriesGroup]);

  const completed = useMemo(
    () =>
      timeSeriesGroup.timeSeriesArray.map((ts) =>
        ts.dataProgress ? ts.dataProgress : 0,
      ),
    [timeSeriesGroup],
  );

  useEffect(updateLegendWrapperRef, []);

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

  const unitsText = timeSeriesGroup.variableUnits || i18n.get("unknown units");
  const yAxisText = `${i18n.get("Quantity")} (${unitsText})`;

  const lightStroke = theme.palette.primary.light;
  const mainStroke = theme.palette.primary.main;
  const labelTextColor = theme.palette.text.primary;

  const removeZoomRectangle = () => {
    if (isNumber(zoomRectangle.x1)) {
      setZoomRectangle({});
    }
  };

  // const handleClick = (
  //   chartState: CategoricalChartState | CategoricalChartState_Fixed,
  // ) => {
  //   console.log("Click!", chartState);
  //   removeZoomRectangle();
  //   if (
  //     chartState &&
  //     selectTime &&
  //     isNumber(chartState.activeLabel) &&
  //     Number.isFinite(chartState.activeLabel)
  //   ) {
  //     selectTime(chartState.activeLabel);
  //   }
  // };

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
      const [x1, y1] = point1;
      setZoomRectangle({ x1, y1 });
    }
  };

  const handleMouseMove = (
    chartState: CategoricalChartState | CategoricalChartState_Fixed | null,
    mouseEvent: MouseEvent<HTMLElement>,
  ) => {
    const { x1, y1 } = zoomRectangle;
    if (!isNumber(x1) || !isNumber(y1)) {
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
      const [x2, y2] = point2;
      if (mouseEvent.ctrlKey || zoomMode) {
        if (x2 !== x1 && y2 !== y1) {
          setZoomRectangle({ x1, y1, x2, y2 });
        }
      } else {
        if (x2 !== x1) {
          setZoomRectangle({ x1, y1, x2 });
        }
      }
    }
  };

  const handleMouseUp = (
    chartState: CategoricalChartState | CategoricalChartState_Fixed,
  ) => {
    const [selectedXRange1, selectedYRange1] =
      normalizeZoomRectangle(zoomRectangle);

    removeZoomRectangle();

    if (selectedXRange1 && selectedXRange1[0] < selectedXRange1[1]) {
      if (selectedYRange1) {
        selectTimeRange(selectedXRange1, timeSeriesGroup.id, selectedYRange1);
      } else {
        selectTimeRange(selectedXRange1, timeSeriesGroup.id, null);
      }
    } else if (
      chartState &&
      isNumber(chartState.activeLabel) &&
      Number.isFinite(chartState.activeLabel)
    ) {
      selectTime(chartState.activeLabel);
    }
  };

  const handleMouseEnter = () => {
    removeZoomRectangle();
  };

  const handleMouseLeave = () => {
    removeZoomRectangle();
  };

  const handleRemoveTimeSeriesClick = (index: number) => {
    removeTimeSeries!(timeSeriesGroup.id, index);
  };

  const resetZoom = () => {
    removeZoomRectangle();
    selectTimeRange(dataTimeRange || null, timeSeriesGroup.id, null);
  };

  const handleEnteredValueRange = (enteredYRange: ValueRange | undefined) => {
    if (enteredYRange) {
      selectTimeRange(selectedTimeRange, timeSeriesGroup.id, enteredYRange);
    }
  };

  function updateLegendWrapperRef() {
    if (chartContainerRef.current) {
      // Hack: get the recharts legend wrapper div, so we can use its height
      // to compute cartesian chart coordinates
      const elements = chartContainerRef.current.getElementsByClassName(
        "recharts-legend-wrapper",
      );
      if (elements.length !== 0) {
        legendWrapperRef.current = elements.item(0) as HTMLDivElement;
      }
    }
  }

  const handleChartResize = (w: number, h: number) => {
    chartSize.current = [w, h];
    updateLegendWrapperRef();
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
      const paddedMin = dataMin - padding;
      yDomain.current = [
        // don't include negative axis part if dataMin >= 0
        paddedMin < 0 && dataMin - 1e-6 > 0 ? 0 : paddedMin,
        dataMax + padding,
      ];
    }
    return yDomain.current;
  };

  const getChartCoords = (
    chartX: number,
    chartY: number,
  ): [number, number] | undefined => {
    if (!chartSize.current || !xDomain.current || !yDomain.current) {
      return undefined;
    }
    // WARNING: There is no recharts API to retrieve margin values of
    // the cartesian grid SVG group.
    // They have been found by manual analysis and may change for any
    // recharts update!
    const MARGIN_LEFT = 65;
    const MARGIN_TOP = 5;
    const MARGIN_RIGHT = 5;
    const MARGIN_BOTTOM = 38;
    const ONE_ROW_LEGEND_HEIGHT = 20;
    //
    const [xMin, xMax] = xDomain.current;
    const [yMin, yMax] = yDomain.current;
    const [chartWidth, chartHeight] = chartSize.current;
    const legendWrapperEl = legendWrapperRef.current;
    const legendHeight = legendWrapperEl
      ? legendWrapperEl.clientHeight
      : ONE_ROW_LEGEND_HEIGHT;
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
    normalizeZoomRectangle(zoomRectangle);

  const ChartComponent = chartType === "bar" ? BarChart : LineChart;

  return (
    <StyledContainerDiv>
      <TimeSeriesChartHeader
        timeSeriesGroup={timeSeriesGroup}
        placeGroupTimeSeries={placeGroupTimeSeries}
        addPlaceGroupTimeSeries={addPlaceGroupTimeSeries}
        removeTimeSeriesGroup={removeTimeSeriesGroup}
        resetZoom={resetZoom}
        loading={loading}
        zoomed={zoomed}
        zoomMode={zoomMode}
        setZoomMode={setZoomMode}
        showTooltips={showTooltips}
        setShowTooltips={setShowTooltips}
        chartType={chartType}
        setChartType={setChartType}
        stdevBarsDisabled={!includeStdev}
        stdevBars={stdevBars}
        setStdevBars={setStdevBars}
        valueRange={yDomain.current}
        setValueRange={handleEnteredValueRange}
        chartElement={chartContainerRef}
        postMessage={postMessage}
      />
      <ResponsiveContainer
        // 99% per https://github.com/recharts/recharts/issues/172
        width="98%"
        onResize={handleChartResize}
        ref={chartContainerRef}
      >
        <ChartComponent
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          // onClick={handleClick}
          syncId="anyId"
          style={{ color: labelTextColor, fontSize: "0.7rem" }}
          data={data}
          barGap={1}
          barSize={30}
          maxBarSize={30}
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
            type="number"
            tickCount={5}
            domain={getYDomain}
            tickFormatter={formatValueTick}
            stroke={labelTextColor}
            allowDataOverflow
            label={{ ...Y_AXIS_LABEL, value: yAxisText }}
          />
          <CartesianGrid strokeDasharray="3 3" />
          {showTooltips && !isNumber(zoomRectangle.x1) && (
            <Tooltip content={<CustomTooltip />} />
          )}
          <Legend
            content={
              <CustomLegend
                removeTimeSeries={handleRemoveTimeSeriesClick}
                datasetTitle={selectedDatasetTitle}
              />
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
              places,
              selectPlace,
              placeGroupTimeSeries,
              placeInfos,
              chartType,
              stdevBars,
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
        </ChartComponent>
      </ResponsiveContainer>
    </StyledContainerDiv>
  );
}

function normalizeZoomRectangle(zoomRectangle: Rectangle) {
  const { x1, x2, y1, y2 } = zoomRectangle;
  let xRange: [number, number] | undefined = undefined;
  let yRange: [number, number] | undefined = undefined;
  if (isNumber(x1) && isNumber(x2)) {
    xRange = x1 < x2 ? [x1, x2] : [x2, x1];
    if (isNumber(y1) && isNumber(y2)) {
      yRange = y1 < y2 ? [y1, y2] : [y2, y1];
    }
  }
  return [xRange, yRange];
}

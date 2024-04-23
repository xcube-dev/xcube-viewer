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

import * as React from "react";
import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import { Theme } from "@mui/material/styles";
import { WithStyles } from "@mui/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Typography from "@mui/material/Typography";
import AllOutIcon from "@mui/icons-material/AllOut";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import {
  CartesianGrid,
  DotProps,
  ErrorBar,
  Legend,
  LegendProps,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { AxisDomain } from "recharts/types/util/types";
import { Payload as TooltipPayload } from "recharts/types/component/DefaultTooltipContent";
import { Payload as LegendPayload } from "recharts/types/component/DefaultLegendContent";
import { CategoricalChartState } from "recharts/types/chart/types";

import i18n from "@/i18n";
import { getUserPlaceColor } from "@/config";
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
import {
  utcTimeToIsoDateString,
  utcTimeToIsoDateTimeString,
} from "@/util/time";
import AddTimeSeriesButton from "./AddTimeSeriesButton";

// const RECHARTS_DEFAULT_X_AXIS_WIDTH = 60; // px
// const RECHARTS_DEFAULT_LINE_CHART_MARGIN_TOP = 5; // px

// Fix typing problem in recharts v2.12.4
type CategoricalChartState_Fixed = Omit<
  CategoricalChartState,
  "activeLabel"
> & { activeLabel?: number };

interface ChartPayload {
  name: string;
  unit: string;
  value: number;
}

const INVISIBLE_LINE_COLOR = "#00000000";
const SUBSTITUTE_LABEL_COLOR = "#FAFFDD";

const styles = (theme: Theme) =>
  createStyles({
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
    actionButton: {
      zIndex: 1000,
      opacity: 0.8,
    },
    toolTipContainer: {
      backgroundColor: "black",
      opacity: 0.8,
      color: "white",
      border: "2px solid black",
      borderRadius: theme.spacing(2),
      padding: theme.spacing(1.5),
    },
    toolTipValue: {
      fontWeight: "bold",
    },
    toolTipLabel: {
      fontWeight: "bold",
      paddingBottom: theme.spacing(1),
    },
    chartTitle: {
      fontSize: "inherit",
      fontWeight: "normal",
    },
    legendContainer: {
      display: "flex",
      justifyContent: "center",
      columnGap: 12,
      flexWrap: "wrap",
    },
    legendItem: {
      display: "flex",
      alignItems: "center",
    },
    legendCloseIcon: {
      marginLeft: 4,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
    },
  });

interface TimeSeriesChartProps extends WithStyles<typeof styles>, WithLocale {
  theme: Theme;
  timeSeriesGroup: TimeSeriesGroup;
  selectedTime?: Time | null;
  selectTime?: (time: Time | null) => void;

  dataTimeRange?: TimeRange | null;
  selectedTimeRange?: TimeRange | null;
  selectTimeRange?: (
    timeRange: TimeRange | null,
    groupId?: string,
    valueRange?: [number, number] | null,
  ) => void;

  showPointsOnly: boolean;
  showErrorBars: boolean;

  selectTimeSeries?: (
    timeSeriesGroupId: string,
    timeSeriesIndex: number,
    timeSeries: TimeSeries,
  ) => void;
  removeTimeSeries?: (
    timeSeriesGroupId: string,
    timeSeriesIndex: number,
  ) => void;
  removeTimeSeriesGroup?: (timeSeriesGroupId: string) => void;
  completed: number[];

  placeInfos?: { [placeId: string]: PlaceInfo };

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

const X_AXIS_DOMAIN: AxisDomain = ["dataMin", "dataMax"];
const Y_AXIS_DOMAIN: AxisDomain = ["auto", "auto"];

interface TimeRangeSelection {
  firstTime?: number;
  secondTime?: number;

  firstPayload?: ChartPayload[];
  secondPayload?: ChartPayload[];
}

const _TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  classes,
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
  theme,
  showErrorBars,
  showPointsOnly,
  removeTimeSeries,
  removeTimeSeriesGroup,
  placeGroupTimeSeries,
  addPlaceGroupTimeSeries,
  completed,
}) => {
  const [timeRangeSelection, setTimeRangeSelection] =
    useState<TimeRangeSelection>({});

  const chartSize = useRef<[number, number]>();

  const clearTimeRangeSelection = () => {
    setTimeRangeSelection({});
  };

  const paletteType = theme.palette.mode;
  const lightStroke = theme.palette.primary.light;
  const mainStroke = theme.palette.primary.main;
  const labelTextColor = theme.palette.text.primary;

  let isZoomedIn = false,
    time1: number | null = null,
    time2: number | null = null;
  if (selectedTimeRange) {
    isZoomedIn = !equalTimeRanges(selectedTimeRange, dataTimeRange || null);
    [time1, time2] = selectedTimeRange;
  }

  const formatTimeTick = (value: number | string) => {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return "";
    }
    return utcTimeToIsoDateString(value);
  };

  const handleClick = (
    chartState: CategoricalChartState | CategoricalChartState_Fixed,
  ) => {
    if (
      chartState &&
      selectTime &&
      Number.isFinite(chartState.activeLabel) &&
      typeof chartState.activeLabel === "number"
    ) {
      selectTime(chartState.activeLabel);
    }
    clearTimeRangeSelection();
  };

  const handleTimeSeriesClick = (
    timeSeriesGroupId: string,
    timeSeriesIndex: number,
    timeSeries: TimeSeries,
  ) => {
    if (selectTimeSeries) {
      selectTimeSeries(timeSeriesGroupId, timeSeriesIndex, timeSeries);
    }
    selectPlace(timeSeries.source.placeId, places, true);
  };

  const handleMouseDown = (
    chartState: CategoricalChartState | CategoricalChartState_Fixed | null,
  ) => {
    if (chartState) {
      const firstTime =
        typeof chartState.activeLabel === "number"
          ? chartState.activeLabel
          : undefined;
      const firstPayload = Array.isArray(chartState.activePayload)
        ? [...chartState.activePayload]
        : undefined;
      if (firstTime !== undefined) {
        setTimeRangeSelection({ firstTime, firstPayload });
      }
    }
  };

  const handleMouseMove = (
    chartState: CategoricalChartState | CategoricalChartState_Fixed | null,
    mouseEvent: React.MouseEvent<HTMLElement>,
  ) => {
    if (chartState) {
      const firstTime = timeRangeSelection.firstTime;
      if (firstTime !== undefined) {
        const secondTime =
          typeof chartState.activeLabel === "number"
            ? chartState.activeLabel
            : undefined;
        if (mouseEvent.ctrlKey) {
          // console.log(chartState.chartX, chartState.chartY);
          // console.log(chartState.activeCoordinate, chartState);
        }
        const secondPayload = Array.isArray(chartState.activePayload)
          ? [...chartState.activePayload]
          : undefined;
        if (secondTime !== undefined) {
          setTimeRangeSelection({
            ...timeRangeSelection,
            secondTime,
            secondPayload,
          });
        }
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

  const handleZoomOutButtonClick = () => {
    zoomOut();
  };

  const handleRemoveTimeSeriesClick = (index: number) => {
    removeTimeSeries!(timeSeriesGroup.id, index);
  };

  const handleRemoveTimeSeriesGroupClick = () => {
    if (removeTimeSeriesGroup) {
      removeTimeSeriesGroup(timeSeriesGroup.id);
    }
  };

  const zoomIn = () => {
    // console.info("------------------------------------------------------");
    // console.info("timeRangeSelection:", timeRangeSelection);
    const { firstTime, secondTime, firstPayload, secondPayload } =
      timeRangeSelection;
    if (
      firstTime === secondTime ||
      firstTime === undefined ||
      secondTime === undefined
    ) {
      clearTimeRangeSelection();
      return;
    }
    let timeRange: [number, number];
    if (firstTime < secondTime) {
      timeRange = [firstTime, secondTime];
    } else {
      timeRange = [secondTime, firstTime];
    }
    let valueRange: [number, number] | undefined = undefined;
    if (Array.isArray(firstPayload) && Array.isArray(secondPayload)) {
      const values = [
        ...firstPayload.map((p) => p.value),
        ...secondPayload.map((p) => p.value),
      ];
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      if (minValue < maxValue) {
        valueRange = [minValue, maxValue];
      }
    }
    clearTimeRangeSelection();
    if (selectTimeRange) {
      selectTimeRange(timeRange, timeSeriesGroup.id, valueRange);
    }
  };

  const zoomOut = () => {
    clearTimeRangeSelection();
    if (selectTimeRange) {
      selectTimeRange(dataTimeRange || null, timeSeriesGroup.id, null);
    }
  };

  let commonValueDataKey: keyof TimeSeriesPoint | null = null;

  const lines = timeSeriesGroup.timeSeriesArray.map((ts, i) => {
    // TODO (forman): way too much logic here, refactor!
    const source = ts.source;
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
        if (
          placeLineColor === null &&
          pgTs.placeGroup.id === source.datasetId
        ) {
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
    ts.data.forEach((point) => {
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
    if (commonValueDataKey === null) {
      commonValueDataKey = valueDataKey;
    }
    const shadedLineColor = getUserPlaceColor(lineColor, paletteType);
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
    if (ts.source.placeId === null) {
      strokeOpacity = 0;
      dotProps = {
        radius: 5,
        strokeWidth: 1.5,
        symbol: "diamond",
      };
    } else {
      strokeOpacity = showPointsOnly ? 0 : ts.dataProgress;
      dotProps = {
        radius: 3,
        strokeWidth: 2,
        symbol: "circle",
      };
    }

    const dot = (
      <CustomizedDot {...dotProps} stroke={shadedLineColor} fill={"white"} />
    );
    const activeDot = (
      <CustomizedDot {...dotProps} stroke={"white"} fill={shadedLineColor} />
    );
    return (
      <Line
        key={i}
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
        onClick={() => handleTimeSeriesClick(timeSeriesGroup.id, i, ts)}
      >
        {errorBar}
      </Line>
    );
  });

  let referenceLine = null;
  if (selectedTime !== null) {
    referenceLine = (
      <ReferenceLine
        isFront={true}
        x={selectedTime}
        stroke={mainStroke}
        strokeWidth={3}
        strokeOpacity={0.5}
      />
    );
  }

  const { firstTime, secondTime } = timeRangeSelection;
  let referenceArea = null;
  if (firstTime !== undefined && secondTime !== undefined) {
    referenceArea = (
      <ReferenceArea
        x1={firstTime}
        x2={secondTime}
        strokeOpacity={0.3}
        fill={lightStroke}
        fillOpacity={0.3}
      />
    );
  }

  const actionButtons = [];

  if (isZoomedIn) {
    const zoomOutButton = (
      <IconButton
        key={"zoomOutButton"}
        className={classes.actionButton}
        aria-label="Zoom Out"
        onClick={handleZoomOutButtonClick}
        size="large"
      >
        <AllOutIcon />
      </IconButton>
    );
    actionButtons.push(zoomOutButton);
  }
  const progress =
    completed.reduce((a: number, b: number) => a + b, 0) / completed.length;
  const loading = progress > 0 && progress < 100;

  const addTimeSeriesButton = (
    <AddTimeSeriesButton
      key="addTimeSeries"
      className={classes.actionButton}
      timeSeriesGroupId={timeSeriesGroup.id}
      placeGroupTimeSeries={placeGroupTimeSeries}
      addPlaceGroupTimeSeries={addPlaceGroupTimeSeries}
    />
  );
  actionButtons.push(addTimeSeriesButton);

  let removeAllButton;
  if (loading) {
    removeAllButton = (
      <CircularProgress
        key={"loadingTimeSeriesGroup"}
        size={24}
        className={classes.actionButton}
        color={"secondary"}
      />
    );
  } else {
    removeAllButton = (
      <IconButton
        key={"removeTimeSeriesGroup"}
        className={classes.actionButton}
        aria-label="Close"
        onClick={handleRemoveTimeSeriesGroupClick}
        size="small"
      >
        <CloseIcon />
      </IconButton>
    );
  }

  actionButtons.push(removeAllButton);

  const timeSeriesText = i18n.get("Time-Series");
  const unitsText = timeSeriesGroup.variableUnits || i18n.get("unknown units");
  const chartTitle = `${timeSeriesText} (${unitsText})`;

  const handleChartResize = (w: number, h: number) =>
    (chartSize.current = [w, h]);

  return (
    <div className={classes.chartContainer}>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography className={classes.chartTitle}>{chartTitle}</Typography>
        <Box
          display="flex"
          flexDirection="row"
          flexWrap="nowrap"
          alignItems="center"
        >
          {actionButtons}
        </Box>
      </Box>
      <ResponsiveContainer
        // 99% per https://github.com/recharts/recharts/issues/172
        width="99%"
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
            domain={selectedTimeRange || X_AXIS_DOMAIN}
            tickFormatter={formatTimeTick}
            stroke={labelTextColor}
            allowDuplicatedCategory={false}
          />
          <YAxis
            dataKey={commonValueDataKey || "mean"}
            type="number"
            tickCount={5}
            domain={timeSeriesGroup.variableRange || Y_AXIS_DOMAIN}
            // tickFormatter={(value, index) => {
            //   return `${Math.floor(value + 0.5)}/${index}`;
            // }}
            stroke={labelTextColor}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            content={
              <CustomLegendContent
                removeTimeSeries={handleRemoveTimeSeriesClick}
              />
            }
          />
          {lines}
          {referenceArea}
          {referenceLine}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const TimeSeriesChart = withStyles(styles, { withTheme: true })(
  _TimeSeriesChart,
);
export default TimeSeriesChart;

interface _CustomTooltipProps
  extends TooltipProps<number, string>,
    WithStyles<typeof styles> {}

const _CustomTooltip: React.FC<_CustomTooltipProps> = ({
  classes,
  active,
  label,
  payload,
}) => {
  if (!active) {
    return null;
  }
  if (typeof label !== "number") {
    return null;
  }
  if (!payload || payload.length === 0) {
    return null;
  }
  const items = payload.map(
    (p: TooltipPayload<number, string>, index: number) => {
      const { name, value, unit, dataKey } = p;
      let color = p.color;
      if (typeof value !== "number") {
        return null;
      }
      // let valueText;
      // if (typeof p.std === 'number') {
      //     valueText = `${value.toFixed(2)} ±${p.std.toFixed(2)} (std)`;
      // } else {
      //     valueText = value.toFixed(3);
      // }
      const nameText = name || "?";
      const valueText = value.toFixed(3);
      if (color === INVISIBLE_LINE_COLOR) {
        color = SUBSTITUTE_LABEL_COLOR;
      }
      const isPoint = nameText.indexOf(":") !== -1;
      let suffixText = isPoint ? "" : ` (${dataKey})`;
      if (typeof unit === "string") {
        if (suffixText !== "") {
          suffixText = `${unit} ${suffixText}`;
        } else {
          suffixText = unit;
        }
      }
      return (
        <div key={index}>
          <span>{nameText}:&nbsp;</span>
          <span className={classes.toolTipValue} style={{ color }}>
            {valueText}
          </span>
          <span>&nbsp;{suffixText}</span>
        </div>
      );
    },
  );

  if (!items) {
    return null;
  }

  return (
    <div className={classes.toolTipContainer}>
      <span
        className={classes.toolTipLabel}
      >{`${utcTimeToIsoDateTimeString(label)} UTC`}</span>
      {items}
    </div>
  );
};

const CustomTooltip = withStyles(styles)(_CustomTooltip);

interface CustomizedDotProps extends DotProps {
  radius: number;
  stroke: string;
  strokeWidth: number;
  fill: string;
  symbol: "diamond" | "circle";
}

const CustomizedDot = (props: CustomizedDotProps) => {
  const { cx, cy, radius, stroke, fill, strokeWidth, symbol } = props;

  const vpSize = 1024;
  const totalRadius = radius + 0.5 * strokeWidth;
  const totalDiameter = 2 * totalRadius;

  const sw = Math.floor((100 * strokeWidth) / totalDiameter + 0.5) + "%";

  let shape;
  if (symbol === "diamond") {
    const c = vpSize / 2;
    const cx = c,
      cy = c;
    const r = vpSize * (radius / totalDiameter);
    shape = (
      <polygon
        points={`${cx - r},${cy} ${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r}`}
        strokeWidth={sw}
        stroke={stroke}
        fill={fill}
      />
    );
  } else {
    const r = Math.floor((100 * radius) / totalDiameter + 0.5) + "%";
    shape = (
      <circle
        cx="50%"
        cy="50%"
        r={r}
        strokeWidth={sw}
        stroke={stroke}
        fill={fill}
      />
    );
  }

  // noinspection SuspiciousTypeOfGuard
  if (typeof cx === "number" && typeof cy === "number") {
    return (
      <svg
        x={cx - totalRadius}
        y={cy - totalRadius}
        width={totalDiameter}
        height={totalDiameter}
        viewBox={`0 0 ${vpSize} ${vpSize}`}
      >
        {shape}
      </svg>
    );
  }

  return null;
};

interface CustomLegendProps extends WithStyles<typeof styles> {
  removeTimeSeries?: (index: number) => void;
}

const _CustomLegendContent: React.FC<CustomLegendProps & LegendProps> = (
  props,
) => {
  const { payload, removeTimeSeries, classes } = props;
  if (!payload || payload.length === 0) {
    return null;
  }
  return (
    <div className={classes.legendContainer}>
      {payload.map((pl: LegendPayload, index: number) => (
        <div
          key={pl.value}
          className={classes.legendItem}
          style={{ color: pl.color }}
        >
          <span>{pl.value}</span>
          {removeTimeSeries && (
            <span
              className={classes.legendCloseIcon}
              // Note, onClick() does not fire in any subcomponent
              // of <Legend/>!
              onMouseUp={() => removeTimeSeries(index)}
            >
              <RemoveCircleOutlineIcon fontSize={"small"} />
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

const CustomLegendContent = withStyles(styles)(_CustomLegendContent);

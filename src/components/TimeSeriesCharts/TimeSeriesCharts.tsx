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

import makeStyles from "@mui/styles/makeStyles";
import { WithLocale } from "@/util/lang";
import { Place, PlaceInfo } from "@/model/place";
import {
  PlaceGroupTimeSeries,
  Time,
  TimeRange,
  TimeSeries,
  TimeSeriesGroup,
} from "@/model/timeSeries";
import TimeRangeSlider from "./TimeRangeSlider";
import TimeSeriesChart from "./TimeSeriesChart";

// noinspection JSUnusedLocalSymbols
const useStyles = makeStyles(() => ({
  chartContainer: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    flexFlow: "flex-start",
    alignItems: "center",
  },
}));

interface TimeSeriesChartsProps extends WithLocale {
  timeSeriesGroups: TimeSeriesGroup[];
  selectedTime: Time | null;
  selectTime: (time: Time | null) => void;
  showPointsOnly: boolean;
  showErrorBars: boolean;
  dataTimeRange: TimeRange | null;
  selectedTimeRange: TimeRange | null;
  selectTimeRange: (
    timeRange: TimeRange | null,
    groupId?: string,
    valueRange?: [number, number] | null,
  ) => void;
  // Not implemented yet
  selectTimeSeries?: (
    timeSeriesGroupId: string,
    timeSeriesIndex: number,
    timeSeries: TimeSeries,
  ) => void;
  removeTimeSeries: (groupId: string, index: number) => void;
  removeTimeSeriesGroup: (groupId: string) => void;
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

export default function TimeSeriesCharts(props: TimeSeriesChartsProps) {
  const classes = useStyles();
  const {
    timeSeriesGroups,
    dataTimeRange,
    selectedTimeRange,
    selectTimeRange,
    ...chartProps
  } = props;

  if (timeSeriesGroups.length === 0) {
    return null;
  }

  return (
    <div className={classes.chartContainer}>
      <TimeRangeSlider
        dataTimeRange={dataTimeRange}
        selectedTimeRange={selectedTimeRange}
        selectTimeRange={selectTimeRange}
      />
      {timeSeriesGroups.map((timeSeriesGroup: TimeSeriesGroup) => {
        return (
          <TimeSeriesChart
            key={timeSeriesGroup.id}
            timeSeriesGroup={timeSeriesGroup}
            dataTimeRange={dataTimeRange}
            selectedTimeRange={selectedTimeRange}
            selectTimeRange={selectTimeRange}
            {...chartProps}
          />
        );
      })}
    </div>
  );
}

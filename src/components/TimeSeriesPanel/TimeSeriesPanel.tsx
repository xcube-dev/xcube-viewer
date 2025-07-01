/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import Box from "@mui/material/Box";

import { WithLocale } from "@/util/lang";
import { makeStyles } from "@/util/styles";
import { Place, PlaceInfo } from "@/model/place";
import {
  PlaceGroupTimeSeries,
  Time,
  TimeRange,
  TimeSeries,
  TimeSeriesGroup,
} from "@/model/timeSeries";
import { TimeSeriesChartType } from "@/states/controlState";
import { MessageType } from "@/states/messageLogState";
import TimeRangeSlider from "./TimeRangeSlider";
import TimeSeriesChart from "./TimeSeriesChart";
import NoTimeSeriesChart from "@/components/TimeSeriesPanel/NoTimeSeriesChart";
import { ExportResolution } from "@/states/controlState";

// noinspection JSUnusedLocalSymbols
const styles = makeStyles({
  chartContainer: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    flexFlow: "flex-start",
    alignItems: "center",
  },
});

interface TimeSeriesPanelProps extends WithLocale {
  timeSeriesGroups: TimeSeriesGroup[];
  selectedTime: Time | null;
  selectTime: (time: Time | null) => void;
  chartTypeDefault: TimeSeriesChartType;
  includeStdev: boolean;
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
  canAddTimeSeries: boolean;
  addTimeSeries: () => void;
  postMessage: (messageType: MessageType, messageText: string | Error) => void;
  selectedDatasetTitle: string | null;
  exportResolution: ExportResolution;
}

export default function TimeSeriesPanel(props: TimeSeriesPanelProps) {
  const {
    timeSeriesGroups,
    dataTimeRange,
    selectedTimeRange,
    selectTimeRange,
    canAddTimeSeries,
    addTimeSeries,
    selectedDatasetTitle,
    exportResolution,
    ...chartProps
  } = props;

  console.log(`TimeSeriesPanel: ${exportResolution}`);
  if (timeSeriesGroups.length === 0) {
    return (
      <NoTimeSeriesChart
        canAddTimeSeries={canAddTimeSeries}
        addTimeSeries={addTimeSeries}
      />
    );
  }

  return (
    <Box sx={styles.chartContainer}>
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
            selectedDatasetTitle={selectedDatasetTitle}
            exportResolution={exportResolution}
            {...chartProps}
          />
        );
      })}
    </Box>
  );
}

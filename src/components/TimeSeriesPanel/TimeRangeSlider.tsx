/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Mark } from "@mui/base/useSlider";

import { TimeRange, UNIT } from "@/model/timeSeries";
import {
  utcTimeToIsoDateString,
  utcTimeToIsoDateTimeString,
} from "@/util/time";
import { makeStyles } from "@/util/styles";

const HOR_MARGIN = 5;

// noinspection JSUnusedLocalSymbols
const styles = makeStyles({
  container: (theme) => ({
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(HOR_MARGIN),
    marginRight: theme.spacing(HOR_MARGIN),
    width: `calc(100% - ${theme.spacing(3 * (HOR_MARGIN + 1))})`,
    height: "5em",
    display: "flex",
    alignItems: "flex-end",
  }),
});

interface TimeRangeSliderProps {
  dataTimeRange?: TimeRange | null;
  selectedTimeRange?: TimeRange | null;
  selectTimeRange?: (timeRange: TimeRange | null) => void;
  updateVisibleTimeRange?: (timeRange: TimeRange | null) => void;
}

export default function TimeRangeSlider({
  dataTimeRange,
  selectedTimeRange,
  selectTimeRange,
}: TimeRangeSliderProps) {
  const [selectedTimeRange_, setSelectedTimeRange_] =
    useState(selectedTimeRange);

  useEffect(() => {
    setSelectedTimeRange_(selectedTimeRange);
  }, [selectedTimeRange]);

  const handleChange = (_event: Event, value: number | number[]) => {
    if (Array.isArray(value)) {
      setSelectedTimeRange_([value[0], value[1]]);
    }
  };

  const handleChangeCommitted = (
    _event: React.SyntheticEvent | Event,
    value: number | number[],
  ) => {
    if (selectTimeRange && Array.isArray(value)) {
      selectTimeRange([value[0], value[1]]);
    }
  };

  function valueLabelFormat(value: number) {
    return utcTimeToIsoDateTimeString(value);
  }

  const dataTimeRangeValid = Array.isArray(dataTimeRange);
  if (!dataTimeRangeValid) {
    dataTimeRange = [Date.now() - 2 * UNIT.years, Date.now()];
  }

  const marks: Mark[] = [
    {
      value: dataTimeRange![0],
      label: utcTimeToIsoDateString(dataTimeRange![0]),
    },
    {
      value: dataTimeRange![1],
      label: utcTimeToIsoDateString(dataTimeRange![1]),
    },
  ];

  return (
    <Box sx={styles.container}>
      <Slider
        disabled={!dataTimeRangeValid}
        min={dataTimeRange![0]}
        max={dataTimeRange![1]}
        value={selectedTimeRange_!}
        marks={marks}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
        size="small"
        valueLabelDisplay="on"
        valueLabelFormat={valueLabelFormat}
      />
    </Box>
  );
}

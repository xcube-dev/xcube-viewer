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
import { useEffect, useState } from "react";
import { WithStyles } from "@mui/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Theme } from "@mui/material";
import Slider from "@mui/material/Slider";
import { Mark } from "@mui/base/useSlider";
import Box from "@mui/material/Box";

import { TimeRange, UNIT } from "../model/timeSeries";
import {
  utcTimeToIsoDateString,
  utcTimeToIsoDateTimeString,
} from "../util/time";

const HOR_MARGIN = 5;

// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) =>
  createStyles({
    box: {
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(HOR_MARGIN),
      marginRight: theme.spacing(HOR_MARGIN),
      width: `calc(100% - ${theme.spacing(3 * (HOR_MARGIN + 1))})`,
      height: "5em",
      display: "flex",
      alignItems: "flex-end",
    },
  });

interface TimeRangeSliderProps extends WithStyles<typeof styles> {
  dataTimeRange?: TimeRange | null;
  selectedTimeRange?: TimeRange | null;
  selectTimeRange?: (timeRange: TimeRange | null) => void;
  updateVisibleTimeRange?: (timeRange: TimeRange | null) => void;
}

const TimeRangeSlider: React.FC<TimeRangeSliderProps> = ({
  classes,
  dataTimeRange,
  selectedTimeRange,
  selectTimeRange,
}) => {
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
    <Box className={classes.box}>
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
};

export default withStyles(styles)(TimeRangeSlider);

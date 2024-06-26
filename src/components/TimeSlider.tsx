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
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Mark } from "@mui/base/useSlider";
import Tooltip from "@mui/material/Tooltip";

import i18n from "@/i18n";
import { Time, TimeRange, UNIT } from "@/model/timeSeries";
import {
  utcTimeToIsoDateString,
  utcTimeToIsoDateTimeString,
} from "@/util/time";
import { makeStyles } from "@/util/styles";

const HOR_MARGIN = 5;

// noinspection JSUnusedLocalSymbols
const styles = makeStyles({
  box: (theme) => ({
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(HOR_MARGIN),
    marginRight: theme.spacing(HOR_MARGIN),
    minWidth: 200,
  }),
  label: {
    color: "grey",
    fontSize: "1em",
  },
});

interface TimeSliderProps {
  hasTimeDimension?: boolean;
  selectedTime?: Time | null;
  selectTime?: (time: Time | null) => void;
  selectedTimeRange?: TimeRange | null;
  selectTimeRange?: (timeRange: TimeRange | null) => void;
}

export default function TimeSlider({
  hasTimeDimension,
  selectedTime,
  selectTime,
  selectedTimeRange,
}: TimeSliderProps) {
  const [selectedTime_, setSelectedTime_] = useState(selectedTime);

  useEffect(() => {
    setSelectedTime_(
      selectedTime || (selectedTimeRange ? selectedTimeRange[0] : 0),
    );
  }, [selectedTime, selectedTimeRange]);

  if (!hasTimeDimension) {
    return null;
  }

  const handleChange = (_event: Event, value: number | number[]) => {
    if (typeof value === "number") {
      setSelectedTime_(value);
    }
  };

  const handleChangeCommitted = (
    _event: React.SyntheticEvent | Event,
    value: number | number[],
  ) => {
    if (selectTime && typeof value === "number") {
      selectTime(value as number);
    }
  };

  const selectedTimeRangeValid = Array.isArray(selectedTimeRange);
  if (!selectedTimeRangeValid) {
    selectedTimeRange = [Date.now() - 2 * UNIT.years, Date.now()];
  }

  const marks: Mark[] = [
    {
      value: selectedTimeRange![0],
      label: utcTimeToIsoDateString(selectedTimeRange![0]),
    },
    {
      value: selectedTimeRange![1],
      label: utcTimeToIsoDateString(selectedTimeRange![1]),
    },
  ];

  function valueLabelFormat(value: number) {
    return utcTimeToIsoDateTimeString(value);
  }

  return (
    <Box sx={styles.box}>
      <Tooltip arrow title={i18n.get("Select time in dataset")}>
        <Slider
          disabled={!selectedTimeRangeValid}
          min={selectedTimeRange![0]}
          max={selectedTimeRange![1]}
          value={selectedTime_ || 0}
          valueLabelDisplay="off"
          valueLabelFormat={valueLabelFormat}
          marks={marks}
          onChange={handleChange}
          onChangeCommitted={handleChangeCommitted}
          size="small"
        />
      </Tooltip>
    </Box>
  );
}

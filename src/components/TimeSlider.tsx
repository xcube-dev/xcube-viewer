/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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
  box: {
    marginLeft: HOR_MARGIN,
    marginRight: HOR_MARGIN,
    minWidth: "10rem",
    height: "3rem",
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

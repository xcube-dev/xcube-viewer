/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";
import { Theme } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { WithStyles } from "@mui/styles";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import i18n from "@/i18n";
import { Time, TimeRange } from "@/model/timeSeries";
import { WithLocale } from "@/util/lang";
import { localToUtcTime, utcTimeToLocal } from "@/util/time";
import ControlBarItem from "./ControlBarItem";

// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) =>
  createStyles({
    dateTimePicker: {
      marginTop: theme.spacing(2),
    },
  });

interface TimeSelectProps extends WithStyles<typeof styles>, WithLocale {
  hasTimeDimension?: boolean;
  selectedTime: Time | null;
  selectTime: (time: Time | null) => void;
  selectedTimeRange: TimeRange | null;
}

const _TimeSelect: React.FC<TimeSelectProps> = ({
  classes,
  hasTimeDimension,
  selectedTime,
  selectedTimeRange,
  selectTime,
}) => {
  const handleTimeChange = (date: Date | null) => {
    selectTime(date !== null ? localToUtcTime(date!) : null);
  };

  const timeInputLabel = (
    <InputLabel shrink htmlFor="time-select">
      {`${i18n.get("Time")} (UTC)`}
    </InputLabel>
  );

  const isValid = typeof selectedTime === "number";
  const timeValue = isValid ? utcTimeToLocal(selectedTime!) : null;

  let minTimeValue, maxTimeValue;
  if (Array.isArray(selectedTimeRange)) {
    minTimeValue = utcTimeToLocal(selectedTimeRange[0]);
    maxTimeValue = utcTimeToLocal(selectedTimeRange[1]);
  }

  // MUI DateTimePicker always uses local time, so we need to adjust.
  // See https://stackoverflow.com/questions/72103096/mui-x-date-pickers-utc-always-please
  // See https://github.com/dcs4cop/xcube-viewer/issues/281
  //TODO: New MUI DateTimePicker is changed and need to discuss about updating.
  const timeInput = (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        disabled={!hasTimeDimension}
        // emptyLabel={
        //     !hasTimeDimension
        //         ? i18n.get('Missing time axis')
        //         : undefined
        // }
        className={classes.dateTimePicker}
        format="yyyy-MM-dd hh:mm:ss"
        // id="time-select"
        value={timeValue}
        minDateTime={minTimeValue}
        maxDateTime={maxTimeValue}
        onChange={handleTimeChange}
        ampm={false}
        slotProps={{
          textField: {
            variant: "standard",
            size: "small",
          },
        }}
        viewRenderers={{
          hours: null,
          minutes: null,
          seconds: null,
        }}
      />
    </LocalizationProvider>
  );

  return <ControlBarItem label={timeInputLabel} control={timeInput} />;
};

const TimeSelect = withStyles(styles)(_TimeSelect);
export default TimeSelect;

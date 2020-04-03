import * as React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

import { Time, TimeRange } from '../model/timeSeries';
import { dateTimeStringToUtcTime, utcTimeToIsoDateTimeString } from '../util/time';
import { WithLocale } from '../util/lang';
import { I18N } from '../config';
import ControlBarItem from './ControlBarItem';


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {}
);

interface TimeSelectProps extends WithStyles<typeof styles>, WithLocale {
    selectedTime: Time | null;
    selectTime: (time: Time | null) => void;
    selectedTimeRange: TimeRange | null;
}


const TimeSelect: React.FC<TimeSelectProps> = ({selectedTime, selectedTimeRange, selectTime}) => {

    const handleTimeChange = (date: MaterialUiPickersDate | null, value?: string | null) => {
        selectTime(value ? dateTimeStringToUtcTime(value!) : null);
    };

    const timeInputLabel = (
        <InputLabel
            shrink
            htmlFor="time-select"
        >
            {I18N.get('Time (UTC)')}
        </InputLabel>
    );

    const isValid = typeof selectedTime === 'number';
    const timeText = isValid ? utcTimeToIsoDateTimeString(selectedTime!) : null;

    let minTimeText, maxTimeText;
    if (Array.isArray(selectedTimeRange)) {
        minTimeText = utcTimeToIsoDateTimeString(selectedTimeRange[0]);
        maxTimeText = utcTimeToIsoDateTimeString(selectedTimeRange[1]);
    }

    const timeInput = (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker
                //disableToolbar
                variant="inline"
                format="yyyy-MM-dd hh:mm:ss"
                id="time-select"
                value={timeText}
                minDate={minTimeText}
                maxDate={maxTimeText}
                onChange={handleTimeChange}

            />
        </MuiPickersUtilsProvider>
    );

    return (
        <ControlBarItem
            label={timeInputLabel}
            control={timeInput}
        />
    );
};

export default withStyles(styles)(TimeSelect);

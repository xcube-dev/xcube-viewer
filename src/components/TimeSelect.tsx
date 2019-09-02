import * as React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

import { Time, TimeRange } from '../model/timeSeries';
import { dateTimeStringToUtcTime, utcTimeToLocalIsoDateTimeString } from '../util/time';
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


class TimeSelect extends React.Component<TimeSelectProps> {

    private handleTimeChange = (date: MaterialUiPickersDate | null, value?: string | null) => {
        this.props.selectTime(value ? dateTimeStringToUtcTime(value!) : null);
    };

    render() {
        let {selectedTime, selectedTimeRange} = this.props;

        const timeInputLabel = (
            <InputLabel
                shrink
                htmlFor="time-select"
            >
                {I18N.get('Time')}
            </InputLabel>
        );

        const isValid = typeof selectedTime === 'number';
        const timeText = isValid ? utcTimeToLocalIsoDateTimeString(selectedTime!) : null;

        let minTimeText, maxTimeText;
        if (Array.isArray(selectedTimeRange)) {
            minTimeText = utcTimeToLocalIsoDateTimeString(selectedTimeRange[0]);
            maxTimeText = utcTimeToLocalIsoDateTimeString(selectedTimeRange[1]);
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
                    onChange={this.handleTimeChange}
                />
            </MuiPickersUtilsProvider>
        );

        return (
            <ControlBarItem
                label={timeInputLabel}
                control={timeInput}
            />
        );
    }
}

export default withStyles(styles)(TimeSelect);

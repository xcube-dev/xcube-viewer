/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2021 by the xcube development team and contributors.
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

import DateFnsUtils from '@date-io/date-fns';
import { Theme } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import * as React from 'react';
import i18n from '../i18n';

import { Time, TimeRange } from '../model/timeSeries';
import { WithLocale } from '../util/lang';
import { dateTimeStringToUtcTime, utcTimeToIsoDateTimeString } from '../util/time';
import ControlBarItem from './ControlBarItem';


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {}
);

interface TimeSelectProps extends WithStyles<typeof styles>, WithLocale {
    hasTimeDimension?: boolean;
    selectedTime: Time | null;
    selectTime: (time: Time | null) => void;
    selectedTimeRange: TimeRange | null;
}


const TimeSelect: React.FC<TimeSelectProps> = ({
                                                   hasTimeDimension,
                                                   selectedTime,
                                                   selectedTimeRange,
                                                   selectTime
                                               }) => {

    const handleTimeChange = (date: MaterialUiPickersDate | null, value?: string | null) => {
        selectTime(value ? dateTimeStringToUtcTime(value!) : null);
    };

    const timeInputLabel = (
        <InputLabel
            shrink
            htmlFor="time-select"
        >
            {`${i18n.get('Time')} (UTC)`}
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
                disabled={!hasTimeDimension}
                variant="inline"
                emptyLabel={
                    !hasTimeDimension
                        ? i18n.get('Missing time axis')
                        : undefined
                }
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

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

import * as React from 'react';
import { useEffect, useState } from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Slider, { Mark } from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';

import { I18N } from '../config';
import { Time, TimeRange, UNIT } from '../model/timeSeries';
import {
    utcTimeToIsoDateTimeString,
    utcTimeToIsoDateString,
} from '../util/time';

const HOR_MARGIN = 5;

// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        box: {
            marginTop: theme.spacing(2),
            marginLeft: theme.spacing(HOR_MARGIN),
            marginRight: theme.spacing(HOR_MARGIN),
            minWidth: 200,
        },
    }
);

interface TimeSliderProps extends WithStyles<typeof styles> {
    selectedTime?: Time | null;
    selectTime?: (time: Time | null) => void;
    selectedTimeRange?: TimeRange | null;
    selectTimeRange?: (timeRange: TimeRange | null) => void;
}


const TimeSlider: React.FC<TimeSliderProps> = ({
                                                   classes,
                                                   selectedTime,
                                                   selectTime,
                                                   selectedTimeRange
                                               }) => {
    const [selectedTime_, setSelectedTime_] = useState(selectedTime);

    useEffect(() => {
        setSelectedTime_(selectedTime || (selectedTimeRange ? selectedTimeRange[0] : 0));
    }, [selectedTime, selectedTimeRange]);

    const handleChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        if (typeof value === 'number') {
            setSelectedTime_(value);
        }
    };

    const handleChangeCommitted = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        if (selectTime && typeof value === 'number') {
            selectTime(value as number);
        }
    };

    let selectedTimeRangeValid = Array.isArray(selectedTimeRange);
    if (!selectedTimeRangeValid) {
        selectedTimeRange = [Date.now() - 2 * UNIT.years, Date.now()];
    }

    const marks: Mark[] = [
        {value: selectedTimeRange![0], label: utcTimeToIsoDateString(selectedTimeRange![0])},
        {value: selectedTimeRange![1], label: utcTimeToIsoDateString(selectedTimeRange![1])},
    ];

    function valueLabelFormat(value: number) {
        return utcTimeToIsoDateTimeString(value);
    }

    return (
        <Box className={classes.box}>
            <Tooltip arrow title={I18N.get('Select time in dataset')}>
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
                />
            </Tooltip>
        </Box>
    );
};

export default withStyles(styles)(TimeSlider);

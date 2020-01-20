import * as React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Slider, { Mark } from '@material-ui/core/Slider';

import { Time, TimeRange, UNIT } from '../model/timeSeries';
import {
    utcTimeToLocalDateTimeString,
    utcTimeToLocalIsoDateString,
} from '../util/time';
import { useEffect, useState } from 'react';

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
        {value: selectedTimeRange![0], label: utcTimeToLocalIsoDateString(selectedTimeRange![0])},
        {value: selectedTimeRange![1], label: utcTimeToLocalIsoDateString(selectedTimeRange![1])},
    ];

    function valueLabelFormat(value: number) {
        return utcTimeToLocalDateTimeString(value);
    }

    return (
        <Box className={classes.box}>
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
        </Box>
    );
};

export default withStyles(styles)(TimeSlider);

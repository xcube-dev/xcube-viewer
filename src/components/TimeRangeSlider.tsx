import * as React from 'react';
import { useEffect, useState } from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import Slider, { Mark } from '@material-ui/core/Slider';
import Box from '@material-ui/core/Box';

import { TimeRange, UNIT } from '../model/timeSeries';
import { utcTimeToIsoDateString } from '../util/time';

const HOR_MARGIN = 5;

// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        box: {
            marginTop: theme.spacing(1),
            marginLeft: theme.spacing(HOR_MARGIN),
            marginRight: theme.spacing(HOR_MARGIN),
            minWidth: 300,
            width: `calc(100% - ${theme.spacing(2 * (HOR_MARGIN + 1))}px)`,
        },
    }
);

interface TimeRangeSliderProps extends WithStyles<typeof styles> {
    dataTimeRange?: TimeRange | null;
    selectedTimeRange?: TimeRange | null;
    selectTimeRange?: (timeRange: TimeRange | null) => void;
    updateVisibleTimeRange?: (timeRange: TimeRange | null) => void;
}

const TimeRangeSlider: React.FC<TimeRangeSliderProps> = ({classes, dataTimeRange, selectedTimeRange, selectTimeRange}) => {
    const [selectedTimeRange_, setSelectedTimeRange_] = useState(selectedTimeRange);

    useEffect(() => {
        setSelectedTimeRange_(selectedTimeRange);
    }, [selectedTimeRange]);

    const handleChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        if (Array.isArray(value)) {
            setSelectedTimeRange_([value[0], value[1]]);
        }
    };

    const handleChangeCommitted = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        if (selectTimeRange && Array.isArray(value)) {
            selectTimeRange([value[0], value[1]]);
        }
    };

    const dataTimeRangeValid = Array.isArray(dataTimeRange);
    if (!dataTimeRangeValid) {
        dataTimeRange = [Date.now() - 2 * UNIT.years, Date.now()];
    }

    const marks: Mark[] = [
        {value: dataTimeRange![0], label: utcTimeToIsoDateString(dataTimeRange![0])},
        {value: dataTimeRange![1], label: utcTimeToIsoDateString(dataTimeRange![1])},
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
            />
        </Box>
    );
};

export default withStyles(styles)(TimeRangeSlider);

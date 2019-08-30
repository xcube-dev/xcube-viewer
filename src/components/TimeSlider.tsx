import * as React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import Box from "@material-ui/core/Box";
import Slider, { Mark } from "@material-ui/core/Slider";

import { Time, TimeRange, UNIT } from '../model/timeSeries';
import {
    utcTimeToLocalDateTimeString,
    utcTimeToLocalIsoDateString,
} from "../util/time";

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

interface TimeSliderState {
    selectedTime?: Time | null;
}

class TimeSlider extends React.Component<TimeSliderProps, TimeSliderState> {
    state: TimeSliderState;

    constructor(props: TimeSliderProps) {
        super(props);
        this.state = {
            selectedTime: props.selectedTime
        };
    }

    // noinspection JSUnusedGlobalSymbols
    static getDerivedStateFromProps(nextProps: Readonly<TimeSliderProps>) {
        return {selectedTime: nextProps.selectedTime};
    }

    handleChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        if (typeof value === 'number') {
            this.setState({selectedTime: value});
        }
    };

    handleChangeCommitted = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        if (this.props.selectTime && typeof value === 'number') {
            this.props.selectTime(value as number);
        }
    };

    render() {
        let {classes, selectedTimeRange} = this.props;

        let selectedTimeRangeValid = Array.isArray(selectedTimeRange);
        if (!selectedTimeRangeValid) {
            selectedTimeRange = [Date.now() - 2 * UNIT.years, Date.now()];
        }

        const selectedTime = this.state.selectedTime || selectedTimeRange![0];

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
                    value={selectedTime}
                    valueLabelDisplay="off"
                    valueLabelFormat={valueLabelFormat}
                    marks={marks}
                    onChange={this.handleChange}
                    onChangeCommitted={this.handleChangeCommitted}
                />
            </Box>
        );
    }
}

export default withStyles(styles)(TimeSlider);

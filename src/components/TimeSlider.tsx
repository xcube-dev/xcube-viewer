import * as React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import FormControl from "@material-ui/core/FormControl";
import Slider, { Mark } from "@material-ui/core/Slider";

import { Time, TimeRange, UNIT } from '../model/timeSeries';
import {
    utcTimeToLocalDateTimeString,
    utcTimeToLocalIsoDateString,
} from "../util/time";


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        formControl: {
            marginTop: theme.spacing(3),
            marginLeft: theme.spacing(6),
            marginRight: theme.spacing(6),
            minWidth: 300,
        },
    }
);

interface TimeSliderProps extends WithStyles<typeof styles> {
    selectedTime?: Time | null;
    selectTime?: (time: Time | null) => void;
    selectedTimeRange?: TimeRange | null;
    selectTimeRange?: (timeRange: TimeRange | null) => void;
    visibleTimeRange?: TimeRange | null;
}

interface TimeSliderState {
    selectedTime?: Time | null;
}

class TimeSlider extends React.Component<TimeSliderProps, TimeSliderState> {

    constructor(props: TimeSliderProps) {
        super(props);
        this.state = {
            selectedTime: props.selectedTime
        };
    }

    componentWillUpdate(nextProps: Readonly<TimeSliderProps>, nextState: Readonly<TimeSliderState>) {
        if (nextProps.selectedTime !== this.props.selectedTime
            && nextState.selectedTime === this.state.selectedTime) {
            this.setState({selectedTime: this.props.selectedTime});
        }
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
        let {classes, visibleTimeRange, selectedTimeRange} = this.props;

        let visibleTimeRangeValid = Array.isArray(visibleTimeRange);
        if (!visibleTimeRangeValid) {
            visibleTimeRange = [Date.now() - 2 * UNIT.years, Date.now()];
        }
        let selectedTimeRangeValid = Array.isArray(selectedTimeRange);
        if (!selectedTimeRangeValid) {
            selectedTimeRange = visibleTimeRange;
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
            <FormControl className={classes.formControl}>
                <Slider
                    disabled={!visibleTimeRangeValid}
                    min={selectedTimeRange![0]}
                    max={selectedTimeRange![1]}
                    value={selectedTime}
                    valueLabelDisplay="off"
                    valueLabelFormat={valueLabelFormat}
                    marks={marks}
                    onChange={this.handleChange}
                    onChangeCommitted={this.handleChangeCommitted}
                />
            </FormControl>
        );
    }
}

export default withStyles(styles)(TimeSlider);

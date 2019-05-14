import * as React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';

const Slider = require('material-ui-slider').Slider;

import { Time, TimeRange, UNIT } from '../model/timeSeries';
import TimeRangeContainer from "./TimeRangeContainer";
import FormControl from "@material-ui/core/FormControl";


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        formControl: {
            marginRight: theme.spacing.unit * 2,
            marginBottom: theme.spacing.unit,
            minWidth: 400,
        },
    }
);

interface TimeSliderProps extends WithStyles<typeof styles> {
    selectedTime?: Time | null;
    selectTime?: (time: Time | null, snapTimes?: Time[]) => void;
    selectedTimeRange?: TimeRange | null;
    selectTimeRange?: (timeRange: TimeRange | null) => void;
    visibleTimeRange?: TimeRange | null;
    snapTimes?: Time[];
}

interface TimeSliderState {
    selectedTime?: Time | null;
}

class TimeSlider extends React.Component<TimeSliderProps, TimeSliderState> {
    state: TimeSliderState;

    constructor(props: TimeSliderProps) {
        super(props);
        this.state = {selectedTime: this.props.selectedTime};
    }

    componentDidUpdate(prevProps: Readonly<TimeSliderProps>, prevState: Readonly<TimeSliderState>): void {
        let selectedTime = this.props.selectedTime;
        if (selectedTime !== prevProps.selectedTime) {
            this.setState({selectedTime});
        }
    }

    handleSliderChange = (selectedTime: Time) => {
        this.setState({selectedTime});
    };

    handleChangeComplete = (selectedTime: Time) => {
        if (this.props.selectTime) {
            this.props.selectTime(selectedTime, this.props.snapTimes);
        }
    };

    handleSelectedTimeRangeChange = (selectedTimeRange: TimeRange) => {
        if (this.props.selectTimeRange) {
            this.props.selectTimeRange([selectedTimeRange[0], selectedTimeRange[1]]);
        }
    };

    render() {
        let {classes, visibleTimeRange, selectedTimeRange, selectedTime} = this.props;

        let visibleDataRange = Array.isArray(visibleTimeRange);
        if (!visibleDataRange) {
            visibleTimeRange = [Date.now() - 2 * UNIT.years, Date.now()];
        }
        if (!Array.isArray(selectedTimeRange)) {
            selectedTimeRange = visibleTimeRange;
        }

        return (
            <FormControl className={classes.formControl}>
                <TimeRangeContainer
                    min={visibleTimeRange![0]}
                    max={visibleTimeRange![1]}
                    step={UNIT.weeks}
                    value={selectedTimeRange || null}
                    onChange={this.handleSelectedTimeRangeChange}
                    disabled={!visibleDataRange}
                >
                    <Slider
                        disabled={!visibleDataRange}
                        min={selectedTimeRange![0]}
                        max={selectedTimeRange![1]}
                        value={selectedTime}
                        onChange={this.handleSliderChange}
                        onChangeComplete={this.handleChangeComplete}
                    />
                </TimeRangeContainer>
            </FormControl>
        );
    }
}

export default withStyles(styles)(TimeSlider);

import * as React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';

const Slider = require('material-ui-slider').Slider;

import { Time, TimeRange, UNIT } from '../model/timeSeries';
import TimeRangeContainer from "./TimeRangeContainer";


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        button: {
            margin: theme.spacing.unit * 0.1,
        },
    }
);

interface TimeControlProps extends WithStyles<typeof styles> {
    selectedTime?: Time | null;
    selectTime?: (time: Time | null) => void;
    selectedTimeRange?: TimeRange | null;
    selectTimeRange?: (timeRange: TimeRange | null) => void;
    visibleTimeRange?: TimeRange | null;
}

interface TimeControlState {
    selectedTime?: Time | null;
}

class TimeControl extends React.Component<TimeControlProps, TimeControlState> {
    state: TimeControlState;

    constructor(props: TimeControlProps) {
        super(props);
        this.state = {selectedTime: this.props.selectedTime};
    }

    componentDidUpdate(prevProps: Readonly<TimeControlProps>, prevState: Readonly<TimeControlState>): void {
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
            this.props.selectTime(selectedTime);
        }
    };

    handleSelectedTimeRangeChange = (selectedTimeRange: TimeRange) => {
        if (this.props.selectTimeRange) {
            this.props.selectTimeRange([selectedTimeRange[0], selectedTimeRange[1]]);
        }
    };

    render() {
        let {visibleTimeRange, selectedTimeRange, selectedTime} = this.props;

        let visibleDataRange = Array.isArray(visibleTimeRange);
        if (!visibleDataRange) {
            visibleTimeRange = [Date.now() - 2 * UNIT.years, Date.now()];
        }
        if (!Array.isArray(selectedTimeRange)) {
            selectedTimeRange = visibleTimeRange;
        }

        return (
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
        );
    }
}

export default withStyles(styles)(TimeControl);

import * as React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';

const Slider = require('material-ui-slider').Slider;

import { TimeRange, UNIT } from '../model/timeSeries';
import TimeRangeContainer from "./TimeRangeContainer";


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        button: {
            margin: theme.spacing.unit * 0.1,
        },
    }
);

interface TimeRangeControlProps extends WithStyles<typeof styles> {
    dataTimeRange?: TimeRange | null;
    selectedTimeRange?: TimeRange | null;
    selectTimeRange?: (timeRange: TimeRange | null) => void;
    visibleTimeRange?: TimeRange | null;
    updateVisibleTimeRange?: (timeRange: TimeRange | null) => void;
}

interface TimeRangeControlState {
    selectedTimeRange?: TimeRange | null;
}

class TimeRangeControl extends React.Component<TimeRangeControlProps, TimeRangeControlState> {
    state: TimeRangeControlState;

    constructor(props: TimeRangeControlProps) {
        super(props);
        this.state = {selectedTimeRange: this.props.selectedTimeRange};
    }

    componentDidUpdate(prevProps: Readonly<TimeRangeControlProps>, prevState: Readonly<TimeRangeControlState>): void {
        let selectedTimeRange = this.props.selectedTimeRange;
        if (selectedTimeRange !== prevProps.selectedTimeRange) {
            if (selectedTimeRange) {
                selectedTimeRange = [selectedTimeRange[0], selectedTimeRange[1]];
            }
            this.setState({selectedTimeRange});
        }
    }

    handleSliderChange = (selectedTimeRange: TimeRange) => {
        this.setState({selectedTimeRange: [selectedTimeRange[0], selectedTimeRange[1]]});
    };

    handleChangeComplete = (selectedTimeRange: TimeRange) => {
        if (this.props.selectTimeRange) {
            this.props.selectTimeRange([selectedTimeRange[0], selectedTimeRange[1]]);
        }
    };

    handleVisibleTimeRangeChange = (selectedTimeRange: TimeRange) => {
        if (this.props.updateVisibleTimeRange) {
            this.props.updateVisibleTimeRange([selectedTimeRange[0], selectedTimeRange[1]]);
        }
    };

    render() {
        let {dataTimeRange, visibleTimeRange, selectedTimeRange} = this.props;

        const dataTimeRangeValid = Array.isArray(dataTimeRange);
        if (!dataTimeRangeValid) {
            dataTimeRange = [Date.now() - 2 * UNIT.years, Date.now()];
        }
        if (!Array.isArray(visibleTimeRange)) {
            visibleTimeRange = dataTimeRange;
        }

        return (
            <TimeRangeContainer
                min={dataTimeRange![0]}
                max={dataTimeRange![1]}
                step={UNIT.weeks + 4}
                value={visibleTimeRange || null}
                onChange={this.handleVisibleTimeRangeChange}>
                <Slider
                    range
                    disabled={!dataTimeRangeValid}
                    min={visibleTimeRange![0]}
                    max={visibleTimeRange![1]}
                    value={selectedTimeRange}
                    onChange={this.handleSliderChange}
                    onChangeComplete={this.handleChangeComplete}
                />
            </TimeRangeContainer>
        );
    }
}

export default withStyles(styles)(TimeRangeControl);

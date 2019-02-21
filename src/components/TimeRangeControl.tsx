import * as React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const Slider = require('material-ui-slider').Slider;

import { utcTimeToLocalDateString } from '../util/time';
import { TimeRange } from '../model/timeSeries';


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        button: {
            margin: theme.spacing.unit * 0.1,
        },
    }
);

interface TimeControlProps extends WithStyles<typeof styles> {
    dataTimeRange?: TimeRange | null;
    selectedTimeRange?: TimeRange | null;
    selectTimeRange?: (timeRange: TimeRange | null) => void;
}

interface TimeControlState {
    selectedTimeRange?: TimeRange | null;
}

class TimeRangeControl extends React.Component<TimeControlProps, TimeControlState> {
    state: TimeControlState;

    constructor(props: TimeControlProps) {
        super(props);
        this.state = {selectedTimeRange: this.props.selectedTimeRange};
    }

    componentDidUpdate(prevProps: Readonly<TimeControlProps>, prevState: Readonly<TimeControlState>): void {
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

    handleTimeStepDown = () => {
    };

    handleTimeStepUp = () => {
    };

    render() {
        let {classes, dataTimeRange} = this.props;
        let {selectedTimeRange} = this.state;

        const dataTimeRangeValid = Array.isArray(dataTimeRange);
        if (!dataTimeRangeValid) {
            dataTimeRange = [Date.now() - 365 * 1000 * 60 * 60 * 24, Date.now()];
        }
        if (!Array.isArray(selectedTimeRange)) {
            selectedTimeRange = dataTimeRange;
        }
        const timeMinText = utcTimeToLocalDateString(selectedTimeRange![0]);
        const timeMaxText = utcTimeToLocalDateString(selectedTimeRange![1]);

        return <div style={{width: '100%', display: 'flex', color: 'white', fontColor: 'white', alignItems: 'center'}}>
            <IconButton className={classes.button} aria-label="One time step back"
                        onClick={this.handleTimeStepDown}>
                <KeyboardArrowLeft/>
            </IconButton>
            <div style={{width: '6em'}}>{timeMinText}</div>
            <div style={{flexGrow: 1}}>
                <Slider
                    range
                    disabled={!dataTimeRangeValid}
                    min={dataTimeRange![0]}
                    max={dataTimeRange![1]}
                    value={selectedTimeRange}
                    onChange={this.handleSliderChange}
                    onChangeComplete={this.handleChangeComplete}
                />
            </div>
            <div style={{width: '6em', textAlign: 'right'}}>{timeMaxText}</div>
            <IconButton className={classes.button} aria-label="One time step forward"
                        onClick={this.handleTimeStepUp}>
                <KeyboardArrowRight/>
            </IconButton>
        </div>
    }
}

export default withStyles(styles)(TimeRangeControl);

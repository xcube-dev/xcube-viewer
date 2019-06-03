import * as React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import { utcTimeToLocalDateString } from '../util/time';
import { Time, TimeDelta, TimeRange } from '../model/timeSeries';
import Typography from '@material-ui/core/Typography';


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        button: {
            margin: theme.spacing.unit * 0.1,
        },
        chartContainer: {
            width: '100%',
            minWidth: 120,
            display: 'flex',
            color: 'white',
            fontColor: 'white',
            alignItems: 'center',
        },
        componentContainer: {flexGrow: 1},
        timeLabel: {
            width: '6em',
            textAlign: 'center',
        },
    }
);

interface TimeRangeContainerProps extends WithStyles<typeof styles> {
    min: Time;
    max: Time;
    step: TimeDelta;
    value: TimeRange | null;
    onChange: (timeRange: TimeRange) => void;
    component?: React.ReactChild;
    disabled?: boolean;
}


class TimeRangeContainer extends React.Component<TimeRangeContainerProps> {

    handleTimeStepDown = () => {
        const {value, step} = this.props;
        this.handleChange([value![0] - step, value![1]]);
    };

    handleTimeStepUp = () => {
        const {value, step} = this.props;
        this.handleChange([value![0], value![1] + step]);
    };

    handleChange = (timeRange: TimeRange) => {
        const {min, max, onChange} = this.props;
        if (timeRange[0] < min) {
            timeRange[0] = min;
        }
        if (timeRange[1] > max) {
            timeRange[1] = max;
        }
        onChange(timeRange);
    };

    render() {
        // TODO: I18N me!
        const {classes, min, max, value, component, children, disabled} = this.props;
        const timeMinText = value ? utcTimeToLocalDateString(value![0]) : "?";
        const timeMaxText = value ? utcTimeToLocalDateString(value![1]) : "?";
        return (
            <div className={classes.chartContainer}>
                <IconButton
                    className={classes.button}
                    disabled={!value || value![0] <= min || disabled}
                    aria-label="Step back"
                    onClick={this.handleTimeStepDown}
                >
                    <KeyboardArrowLeft/>
                </IconButton>
                <div className={classes.timeLabel}><Typography variant={"body2"}>{timeMinText}</Typography></div>
                <div className={classes.componentContainer}>
                    {component || children}
                </div>
                <div className={classes.timeLabel}><Typography variant={"body2"}>{timeMaxText}</Typography></div>
                <IconButton
                    className={classes.button}
                    disabled={!value || value![1] >= max || disabled}
                    aria-label="Step up"
                    onClick={this.handleTimeStepUp}
                >
                    <KeyboardArrowRight/>
                </IconButton>
            </div>
        );
    }
}

export default withStyles(styles)(TimeRangeContainer);

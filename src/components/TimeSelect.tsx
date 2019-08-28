import * as React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutline from '@material-ui/icons/PauseCircleOutline';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import Input from '@material-ui/core/Input';

import { Time, TimeRange } from '../model/timeSeries';
import { dateTimeStringToUtcTime, utcTimeToLocalDateTimeString } from '../util/time';
import { WithLocale } from '../util/lang';
import { I18N } from '../config';
import ControlBarItem from './ControlBarItem';


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        formControl: {
            marginRight: theme.spacing(2),
            marginBottom: theme.spacing(1),
            minWidth: 120,
        },
        button: {
            margin: theme.spacing(0.1),
        },
        textField: {
            width: '15em',
        },
    }
);

interface TimeSelectProps extends WithStyles<typeof styles>, WithLocale {
    selectedTime: Time | null;
    selectTime: (time: Time | null) => void;
    incSelectedTime: (increment: -1 | 1) => void;
    selectedTimeRange: TimeRange | null;
    timeAnimationActive: boolean;
    timeAnimationInterval: number;
    updateTimeAnimation: (active: boolean, interval: number) => void;
}


class TimeSelect extends React.Component<TimeSelectProps> {

    private intervalId: number | null = null;

    private handlePlayEvent = () => {
        this.props.incSelectedTime(1);
    };

    private handlePlayButtonClick = () => {
        const {timeAnimationActive, timeAnimationInterval, updateTimeAnimation} = this.props;
        updateTimeAnimation(!timeAnimationActive, timeAnimationInterval);
    };

    private handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedTimeString = event.target.value;
        this.props.selectTime(selectedTimeString ? dateTimeStringToUtcTime(selectedTimeString) : null);
    };

    private playOrNor() {
        if (this.props.timeAnimationActive) {
            this.installTimer();
        } else {
            this.uninstallTimer();
        }
    };

    private installTimer() {
        this.uninstallTimer();
        this.intervalId = window.setInterval(this.handlePlayEvent, this.props.timeAnimationInterval);
    };

    private uninstallTimer() {
        if (this.intervalId !== null) {
            window.clearInterval(this.intervalId);
            this.intervalId = null;
        }
    };

    componentDidMount(): void {
        this.playOrNor();
    }

    componentDidUpdate(): void {
        this.playOrNor();
    }

    componentWillUnmount(): void {
        this.uninstallTimer();
    }

    render() {
        let {classes, selectedTime, timeAnimationActive} = this.props;

        const timeInputLabel = (
            <InputLabel
                shrink
                htmlFor="time-select">
                {I18N.get('Time')}
            </InputLabel>
        );

        const isValid = typeof selectedTime === 'number';
        const timeText = isValid ? utcTimeToLocalDateTimeString(selectedTime!) : '?';

        const timeInput = (
            <Input
                id='time-select'
                type='text'
                value={timeText}
                className={classes.textField}
                onChange={this.handleTimeChange}
            />
        );

        const playToolTip = I18N.get(timeAnimationActive ? 'Stop' : 'Start');
        const playIcon = timeAnimationActive ? <PauseCircleOutline/> : <PlayCircleOutline/>;

        const playButton = (
            <IconButton
                className={classes.button}
                disabled={!isValid}
                aria-label={playToolTip}
                onClick={this.handlePlayButtonClick}
            >
                {playIcon}
            </IconButton>
        );

        return (
            <ControlBarItem
                label={timeInputLabel}
                control={timeInput}
                actions={playButton}
            />
        );
    }
}

export default withStyles(styles)(TimeSelect);

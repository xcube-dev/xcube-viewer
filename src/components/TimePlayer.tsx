import * as React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutline from '@material-ui/icons/PauseCircleOutline';

import { Time, TimeRange } from '../model/timeSeries';
import { dateTimeStringToUtcTime, utcTimeToLocalDateTimeString } from '../util/time';
import FormControl from '@material-ui/core/FormControl';
import { I18N } from '../config';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import Input from '@material-ui/core/Input';


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        formControl: {
            marginRight: theme.spacing.unit * 2,
            marginBottom: theme.spacing.unit,
            minWidth: 120,
        },
        button: {
            margin: theme.spacing.unit * 0.1,
        },
        textField: {
            width: '14em',
        },
        timeLabel: {
            width: '6em',
            textAlign: 'center',
            fontWeight: 'bold',
        },
    }
);

interface TimePlayerProps extends WithStyles<typeof styles> {
    selectedTime: Time | null;
    selectTime: (time: Time | null) => void;
    selectedTimeRange: TimeRange | null;
    step: Time;
    timeAnimationActive: boolean;
    timeAnimationInterval: number;
    updateTimeAnimation: (active: boolean, interval: number) => void;
}


class TimePlayer extends React.Component<TimePlayerProps> {

    private intervalId: number | null = null;

    private handlePlayEvent = () => {
        const {selectTime, selectedTime, selectedTimeRange, step} = this.props;
        let newTime = selectedTime! + step;
        if (selectedTimeRange) {
            if (newTime > selectedTimeRange[1]) {
                newTime = selectedTimeRange[0];
            }
        }
        selectTime(newTime);
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

        const isValid = typeof selectedTime === 'number';
        const timeText = isValid ? utcTimeToLocalDateTimeString(selectedTime!) : '?';

        const playToolTip = timeAnimationActive ? I18N.text`Stop` : I18N.text`Start`;
        const playIcon = timeAnimationActive ? <PauseCircleOutline/> : <PlayCircleOutline/>;

        return (
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="time-select">{I18N.text`Time`}</InputLabel>
                <Input
                    id="time-select"
                    type="text"
                    value={timeText}
                    className={classes.textField}
                    onChange={this.handleTimeChange}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                className={classes.button}
                                disabled={!isValid}
                                aria-label={playToolTip}
                                onClick={this.handlePlayButtonClick}
                            >
                                {playIcon}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
        );
    }
}

export default withStyles(styles)(TimePlayer);

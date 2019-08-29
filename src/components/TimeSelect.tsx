import * as React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutline from '@material-ui/icons/PauseCircleOutline';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

import { Time, TimeRange } from '../model/timeSeries';
import { dateTimeStringToUtcTime, /*dateTimeStringToUtcTime,*/ utcTimeToLocalDateTimeString } from '../util/time';
import { WithLocale } from '../util/lang';
import { I18N } from '../config';
import ControlBarItem from './ControlBarItem';


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
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

    private handleTimeChange = (date: MaterialUiPickersDate | null, value?: string | null) => {
        this.props.selectTime(value ? dateTimeStringToUtcTime(value!) : null);
    };

    private handleNextTimeStepButtonClick = () => {
        this.props.incSelectedTime(1);
    };

    private handlePrevTimeStepButtonClick = () => {
        this.props.incSelectedTime(-1);
    };

    private handleFirstTimeStepButtonClick = () => {
        const {selectedTimeRange} = this.props;
        this.props.selectTime(selectedTimeRange ? selectedTimeRange[0] : null);
    };

    private handleLastTimeStepButtonClick = () => {
        const {selectedTimeRange} = this.props;
        this.props.selectTime(selectedTimeRange ? selectedTimeRange[1] : null);
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
        let {selectedTime, timeAnimationActive} = this.props;

        const timeInputLabel = (
            <InputLabel
                shrink
                htmlFor="time-select"
            >
                {I18N.get('Time')}
            </InputLabel>
        );

        const isValid = typeof selectedTime === 'number';
        const timeText = isValid ? utcTimeToLocalDateTimeString(selectedTime!) : '?';

        const timeInput = (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                    disableToolbar
                    variant="inline"
                    format="yyyy-MM-dd hh:mm:ss"
                    id="time-select"
                    value={timeText}
                    onChange={this.handleTimeChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </MuiPickersUtilsProvider>
        );

        const playToolTip = I18N.get(timeAnimationActive ? 'Stop' : 'Start');
        const playIcon = timeAnimationActive ? <PauseCircleOutline/> : <PlayCircleOutline/>;

        const playButton = (
            <IconButton
                disabled={!isValid}
                aria-label={playToolTip}
                onClick={this.handlePlayButtonClick}
            >
                {playIcon}
            </IconButton>
        );

        const firstTimeStepButton = (
            <IconButton
                disabled={timeAnimationActive}
                onClick={this.handleFirstTimeStepButtonClick}
            >
                <FirstPageIcon/>
            </IconButton>
        );

        const prevTimeStepButton = (
            <IconButton
                disabled={timeAnimationActive}
                onClick={this.handlePrevTimeStepButtonClick}
            >
                <ChevronLeftIcon/>
            </IconButton>
        );
        const nextTimeStepButton = (
            <IconButton
                disabled={timeAnimationActive}
                onClick={this.handleNextTimeStepButtonClick}
            >
                <ChevronRightIcon/>
            </IconButton>
        );
        const lastTimeStepButton = (
            <IconButton
                disabled={timeAnimationActive}
                onClick={this.handleLastTimeStepButtonClick}
            >
                <LastPageIcon/>
            </IconButton>);

        return (
            <ControlBarItem
                label={timeInputLabel}
                control={timeInput}
                actions={[
                    firstTimeStepButton,
                    prevTimeStepButton,
                    playButton,
                    nextTimeStepButton,
                    lastTimeStepButton
                ]}
            />
        );
    }
}

export default withStyles(styles)(TimeSelect);

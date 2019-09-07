import * as React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutline from '@material-ui/icons/PauseCircleOutline';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';

import { Time, TimeRange } from '../model/timeSeries';
import { WithLocale } from '../util/lang';
import { I18N } from '../config';


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        formControl: {
            marginTop: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
    }
);

interface TimePlayerProps extends WithStyles<typeof styles>, WithLocale {
    selectedTime: Time | null;
    selectTime: (time: Time | null) => void;
    incSelectedTime: (increment: -1 | 1) => void;
    selectedTimeRange: TimeRange | null;
    timeAnimationActive: boolean;
    timeAnimationInterval: number;
    updateTimeAnimation: (active: boolean, interval: number) => void;
}


class TimePlayer extends React.Component<TimePlayerProps> {

    private intervalId: number | null = null;

    private handlePlayEvent = () => {
        this.props.incSelectedTime(1);
    };

    private handlePlayButtonClick = () => {
        const {timeAnimationActive, timeAnimationInterval, updateTimeAnimation} = this.props;
        updateTimeAnimation(!timeAnimationActive, timeAnimationInterval);
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

    private playOrNot() {
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
        this.playOrNot();
    }

    componentDidUpdate(): void {
        this.playOrNot();
    }

    componentWillUnmount(): void {
        this.uninstallTimer();
    }

    render() {
        let {classes, selectedTime, timeAnimationActive} = this.props;

        const isValid = typeof selectedTime === 'number';

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
            <FormControl className={classes.formControl}>
                <Box>
                    {firstTimeStepButton}
                    {prevTimeStepButton}
                    {playButton}
                    {nextTimeStepButton}
                    {lastTimeStepButton}
                </Box>
            </FormControl>
        );
    }
}

export default withStyles(styles)(TimePlayer);

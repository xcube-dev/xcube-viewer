import * as React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutline from '@material-ui/icons/PauseCircleOutline';

import { Time, TimeRange } from '../model/timeSeries';
import { utcTimeToLocalDateString } from "../util/time";


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        button: {
            margin: theme.spacing.unit * 0.1,
        },
        container: {
            width: '100%',
            display: 'flex',
            color: 'white',
            fontColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
        },
        componentContainer: {},
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

        const isValid = typeof selectedTime === "number";
        const timeText = isValid ? utcTimeToLocalDateString(selectedTime!) : "?";

        // TODO: I18N me!
        const playToolTip = timeAnimationActive ? "Pause" : "Play";
        const playIcon = timeAnimationActive ? <PauseCircleOutline/> : <PlayCircleOutline/>;

        return (
            <div className={classes.container}>
                <div className={classes.timeLabel}>{timeText}</div>
                <IconButton
                    className={classes.button}
                    disabled={!isValid}
                    aria-label={playToolTip}
                    onClick={this.handlePlayButtonClick}
                >
                    {playIcon}
                </IconButton>
            </div>
        );
    }
}

export default withStyles(styles)(TimePlayer);

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2021 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
import Tooltip from '@material-ui/core/Tooltip';

import { Time, TimeRange } from '../model/timeSeries';
import { TimeAnimationInterval } from '../states/controlState';
import { WithLocale } from '../util/lang';
import { I18N } from '../config';
import { useEffect, useRef } from 'react';


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
    timeAnimationInterval: TimeAnimationInterval;
    updateTimeAnimation: (active: boolean, interval: TimeAnimationInterval) => void;
}


const TimePlayer: React.FC<TimePlayerProps> = ({
                                                   classes,
                                                   timeAnimationActive,
                                                   timeAnimationInterval,
                                                   updateTimeAnimation,
                                                   selectedTime,
                                                   selectedTimeRange,
                                                   selectTime,
                                                   incSelectedTime
                                               }) => {

    const intervalId = useRef<number | null>(null);

    useEffect(() => {
        playOrNot();
        return uninstallTimer;
    });

    const handlePlayEvent = () => {
        incSelectedTime(1);
    };

    const handlePlayButtonClick = () => {
        updateTimeAnimation(!timeAnimationActive, timeAnimationInterval);
    };

    const handleNextTimeStepButtonClick = () => {
        incSelectedTime(1);
    };

    const handlePrevTimeStepButtonClick = () => {
        incSelectedTime(-1);
    };

    const handleFirstTimeStepButtonClick = () => {
        selectTime(selectedTimeRange ? selectedTimeRange[0] : null);
    };

    const handleLastTimeStepButtonClick = () => {
        selectTime(selectedTimeRange ? selectedTimeRange[1] : null);
    };

    const playOrNot = () => {
        if (timeAnimationActive) {
            installTimer();
        } else {
            uninstallTimer();
        }
    };

    const installTimer = () => {
        uninstallTimer();
        intervalId.current = window.setInterval(handlePlayEvent, timeAnimationInterval);
    };

    const uninstallTimer = () => {
        if (intervalId.current !== null) {
            window.clearInterval(intervalId.current!);
            intervalId.current = null;
        }
    };


    const isValid = typeof selectedTime === 'number';

    const playToolTip = I18N.get(timeAnimationActive ? 'Stop' : 'Start');
    const playIcon = timeAnimationActive ? <PauseCircleOutline/> : <PlayCircleOutline/>;

    const playButton = (
        <IconButton
            disabled={!isValid}
            aria-label={playToolTip}
            onClick={handlePlayButtonClick}
        >
            <Tooltip arrow title={I18N.get('Auto-step through times in the dataset')}>
                {playIcon}
            </Tooltip>
        </IconButton>
    );

    const firstTimeStepButton = (
        <IconButton
            disabled={timeAnimationActive}
            onClick={handleFirstTimeStepButtonClick}
        >
            <FirstPageIcon/>
        </IconButton>
    );

    const prevTimeStepButton = (
        <IconButton
            disabled={timeAnimationActive}
            onClick={handlePrevTimeStepButtonClick}
        >
            <ChevronLeftIcon/>
        </IconButton>
    );
    const nextTimeStepButton = (
        <IconButton
            disabled={timeAnimationActive}
            onClick={handleNextTimeStepButtonClick}
        >
            <ChevronRightIcon/>
        </IconButton>
    );
    const lastTimeStepButton = (
        <IconButton
            disabled={timeAnimationActive}
            onClick={handleLastTimeStepButtonClick}
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
};

export default withStyles(styles)(TimePlayer);

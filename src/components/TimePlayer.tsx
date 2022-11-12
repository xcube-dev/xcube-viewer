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

import { Theme } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import Tooltip from '@mui/material/Tooltip';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import PauseCircleOutline from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutline from '@mui/icons-material/PlayCircleOutline';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import i18n from '../i18n';

import { Time, TimeRange } from '../model/timeSeries';
import { TimeAnimationInterval } from '../states/controlState';
import { WithLocale } from '../util/lang';


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

    const playToolTip = i18n.get(timeAnimationActive ? 'Stop' : 'Start');
    const playIcon = timeAnimationActive ? <PauseCircleOutline/> : <PlayCircleOutline/>;

    const playButton = (
        <IconButton
            disabled={!isValid}
            aria-label={playToolTip}
            onClick={handlePlayButtonClick}
            size="large">
            <Tooltip arrow title={i18n.get('Auto-step through times in the dataset')}>
                {playIcon}
            </Tooltip>
        </IconButton>
    );

    const firstTimeStepButton = (
        <IconButton
            disabled={!isValid || timeAnimationActive}
            onClick={handleFirstTimeStepButtonClick}
            size="large">
            <FirstPageIcon/>
        </IconButton>
    );

    const prevTimeStepButton = (
        <IconButton
            disabled={!isValid || timeAnimationActive}
            onClick={handlePrevTimeStepButtonClick}
            size="large">
            <ChevronLeftIcon/>
        </IconButton>
    );
    const nextTimeStepButton = (
        <IconButton
            disabled={!isValid || timeAnimationActive}
            onClick={handleNextTimeStepButtonClick}
            size="large">
            <ChevronRightIcon/>
        </IconButton>
    );
    const lastTimeStepButton = (
        <IconButton
            disabled={!isValid || timeAnimationActive}
            onClick={handleLastTimeStepButtonClick}
            size="large">
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

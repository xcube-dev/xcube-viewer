/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
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

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

import i18n from "@/i18n";
import { WithLocale } from "@/util/lang";
import { Time, TimeRange } from "@/model/timeSeries";
import { TimeAnimationInterval } from "@/states/controlState";
import { makeStyles } from "@/util/styles";

// noinspection JSUnusedLocalSymbols
const styles = makeStyles({
  formControl: (theme) => ({
    marginTop: theme.spacing(2.5),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  }),
  iconButton: {
    padding: "2px",
  },
});

interface TimePlayerProps extends WithLocale {
  selectedTime: Time | null;
  selectTime: (time: Time | null) => void;
  incSelectedTime: (increment: -1 | 1) => void;
  selectedTimeRange: TimeRange | null;
  timeAnimationActive: boolean;
  timeAnimationInterval: TimeAnimationInterval;
  updateTimeAnimation: (
    active: boolean,
    interval: TimeAnimationInterval,
  ) => void;
}

export default function TimePlayer({
  timeAnimationActive,
  timeAnimationInterval,
  updateTimeAnimation,
  selectedTime,
  selectedTimeRange,
  selectTime,
  incSelectedTime,
}: TimePlayerProps) {
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
    intervalId.current = window.setInterval(
      handlePlayEvent,
      timeAnimationInterval,
    );
  };

  const uninstallTimer = () => {
    if (intervalId.current !== null) {
      window.clearInterval(intervalId.current!);
      intervalId.current = null;
    }
  };

  const isValid = typeof selectedTime === "number";

  const playIcon = timeAnimationActive ? (
    <PauseCircleOutlineIcon />
  ) : (
    <PlayCircleOutlineIcon />
  );

  const playButton = (
    <IconButton
      disabled={!isValid}
      onClick={handlePlayButtonClick}
      size="small"
      sx={styles.iconButton}
    >
      <Tooltip arrow title={i18n.get("Auto-step through times in the dataset")}>
        {playIcon}
      </Tooltip>
    </IconButton>
  );

  const firstTimeStepButton = (
    <IconButton
      disabled={!isValid || timeAnimationActive}
      onClick={handleFirstTimeStepButtonClick}
      size="small"
      sx={styles.iconButton}
    >
      <Tooltip arrow title={i18n.get("First time step")}>
        <FirstPageIcon />
      </Tooltip>
    </IconButton>
  );

  const prevTimeStepButton = (
    <IconButton
      disabled={!isValid || timeAnimationActive}
      onClick={handlePrevTimeStepButtonClick}
      size="small"
      sx={styles.iconButton}
    >
      <Tooltip arrow title={i18n.get("Previous time step")}>
        <ChevronLeftIcon />
      </Tooltip>
    </IconButton>
  );
  const nextTimeStepButton = (
    <IconButton
      disabled={!isValid || timeAnimationActive}
      onClick={handleNextTimeStepButtonClick}
      size="small"
      sx={styles.iconButton}
    >
      <Tooltip arrow title={i18n.get("Next time step")}>
        <ChevronRightIcon />
      </Tooltip>
    </IconButton>
  );
  const lastTimeStepButton = (
    <IconButton
      disabled={!isValid || timeAnimationActive}
      onClick={handleLastTimeStepButtonClick}
      size="small"
      sx={styles.iconButton}
    >
      <Tooltip arrow title={i18n.get("Last time step")}>
        <LastPageIcon />
      </Tooltip>
    </IconButton>
  );

  return (
    <FormControl sx={styles.formControl} variant="standard">
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

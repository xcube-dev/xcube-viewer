/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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
import { DimensionAnimationInterval } from "@/states/controlState";
import { makeStyles } from "@/util/styles";
import { Variable } from "@/model/variable";
import { Dimension } from "@/model/dataset";

// noinspection JSUnusedLocalSymbols
const styles = makeStyles({
  formControl: {
    marginLeft: 1,
    marginRight: 1,
    marginTop: 2,
  },
  iconButton: {
    padding: "2px",
  },
});

interface DepthPlayerProps extends WithLocale {
  selectedVariable: Variable | null;
  selectedDepthDimension: Dimension | null;
  selectedDepth: number | string | null;
  selectDepth: (selectedDepth: number | string | null) => void;
  depthAnimationActive: boolean;
  dimensionAnimationInterval: DimensionAnimationInterval;
  incSelectedDepth: (increment: -1 | 1) => void;
  updateDepthAnimation: (
    active: boolean,
    interval: DimensionAnimationInterval,
  ) => void;
}

export default function DepthPlayer({
  selectedVariable,
  selectedDepthDimension,
  selectedDepth,
  selectDepth,
  incSelectedDepth,
  depthAnimationActive,
  dimensionAnimationInterval,
  updateDepthAnimation,
}: DepthPlayerProps) {
  const intervalId = useRef<number | null>(null);

  useEffect(() => {
    playOrNot();
    return uninstallTimer;
  });

  const playOrNot = () => {
    if (depthAnimationActive) {
      installTimer();
    } else {
      uninstallTimer();
    }
  };

  const installTimer = () => {
    uninstallTimer();
    intervalId.current = window.setInterval(
      handlePlayEvent,
      dimensionAnimationInterval,
    );
  };

  const uninstallTimer = () => {
    if (intervalId.current !== null) {
      window.clearInterval(intervalId.current!);
      intervalId.current = null;
    }
  };

  // only show DepthSelect if selectedVariables has depth dim
  // and selectedDepth
  if (
    !selectedDepthDimension ||
    !selectedVariable?.dims?.includes(selectedDepthDimension.name) ||
    !selectedDepth
  )
    return null;

  const selectedDepthCoordinates = selectedDepthDimension.coordinates;

  const handlePlayEvent = () => {
    incSelectedDepth(1);
  };

  const handlePlayButtonClick = () => {
    updateDepthAnimation(!depthAnimationActive, dimensionAnimationInterval);
  };

  const handleNextTimeStepButtonClick = () => {
    incSelectedDepth(1);
  };

  const handlePrevTimeStepButtonClick = () => {
    incSelectedDepth(-1);
  };

  const handleFirstTimeStepButtonClick = () => {
    selectDepth(selectedDepthCoordinates ? selectedDepthCoordinates[0] : null);
  };

  const handleLastTimeStepButtonClick = () => {
    selectDepth(
      selectedDepthCoordinates
        ? selectedDepthCoordinates[selectedDepthCoordinates.length - 1]
        : null,
    );
  };

  const isValid = typeof selectedDepth === "number";

  const playIcon = depthAnimationActive ? (
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
      <Tooltip
        arrow
        title={i18n.get("Auto-step through depths in the dataset")}
      >
        {playIcon}
      </Tooltip>
    </IconButton>
  );

  const firstTimeStepButton = (
    <IconButton
      disabled={!isValid || depthAnimationActive}
      onClick={handleFirstTimeStepButtonClick}
      size="small"
      sx={styles.iconButton}
    >
      <Tooltip arrow title={i18n.get("First depth step")}>
        <FirstPageIcon />
      </Tooltip>
    </IconButton>
  );

  const prevTimeStepButton = (
    <IconButton
      disabled={!isValid || depthAnimationActive}
      onClick={handlePrevTimeStepButtonClick}
      size="small"
      sx={styles.iconButton}
    >
      <Tooltip arrow title={i18n.get("Previous depth step")}>
        <ChevronLeftIcon />
      </Tooltip>
    </IconButton>
  );
  const nextTimeStepButton = (
    <IconButton
      disabled={!isValid || depthAnimationActive}
      onClick={handleNextTimeStepButtonClick}
      size="small"
      sx={styles.iconButton}
    >
      <Tooltip arrow title={i18n.get("Next depth step")}>
        <ChevronRightIcon />
      </Tooltip>
    </IconButton>
  );
  const lastTimeStepButton = (
    <IconButton
      disabled={!isValid || depthAnimationActive}
      onClick={handleLastTimeStepButtonClick}
      size="small"
      sx={styles.iconButton}
    >
      <Tooltip arrow title={i18n.get("Last depth step")}>
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

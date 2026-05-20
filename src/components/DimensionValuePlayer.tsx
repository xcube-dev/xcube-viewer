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
import {
  DimensionAnimationInterval,
  DimensionValues,
} from "@/states/controlState";
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

interface DimensionValuePlayerProps extends WithLocale {
  selectedVariable: Variable | null;
  selectedDimensionLabel: string | null;
  selectedDimension: Dimension | null;
  selectedDimensionValue: number | string | null;
  selectDimensionValues: (selectedValues: DimensionValues) => void;
  dimensionAnimationActive: boolean;
  dimensionAnimationInterval: DimensionAnimationInterval;
  incSelectedDimension: (increment: -1 | 1) => void;
  updateDimensionAnimation: (
    active: boolean,
    interval: DimensionAnimationInterval,
  ) => void;
}

export default function DimensionValuePlayer({
  selectedVariable,
  selectedDimensionLabel,
  selectedDimension,
  selectedDimensionValue,
  selectDimensionValues,
  incSelectedDimension,
  dimensionAnimationActive,
  dimensionAnimationInterval,
  updateDimensionAnimation,
}: DimensionValuePlayerProps) {
  const intervalId = useRef<number | null>(null);

  useEffect(() => {
    playOrNot();
    return uninstallTimer;
  });

  const playOrNot = () => {
    if (dimensionAnimationActive) {
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
  // and selectedDimensionValue
  if (
    !selectedDimension ||
    !selectedDimensionLabel ||
    !selectedVariable?.dims?.includes(selectedDimension.name) ||
    !selectedDimensionValue
  )
    return null;

  const selectedCoordinates = selectedDimension.coordinates;
  console.log("selectedCoordinates", selectedCoordinates);

  const handlePlayEvent = () => {
    incSelectedDimension(1);
  };

  const handlePlayButtonClick = () => {
    updateDimensionAnimation(
      !dimensionAnimationActive,
      dimensionAnimationInterval,
    );
  };

  const handleNextStepButtonClick = () => {
    incSelectedDimension(1);
  };

  const handlePrevStepButtonClick = () => {
    incSelectedDimension(-1);
  };

  const handleFirstStepButtonClick = () => {
    selectDimensionValues({
      [selectedDimensionLabel]: selectedCoordinates
        ? selectedCoordinates[0]
        : null,
    });
  };

  const handleLastStepButtonClick = () => {
    selectDimensionValues({
      [selectedDimensionLabel]: selectedCoordinates
        ? selectedCoordinates[selectedCoordinates.length - 1]
        : null,
    });
  };

  const isValid = typeof selectedDimensionValue === "number";

  const playIcon = dimensionAnimationActive ? (
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
      <Tooltip arrow title={i18n.get("Auto-step through dimension")}>
        {playIcon}
      </Tooltip>
    </IconButton>
  );

  const firstStepButtonClick = (
    <IconButton
      disabled={!isValid || dimensionAnimationActive}
      onClick={handleFirstStepButtonClick}
      size="small"
      sx={styles.iconButton}
    >
      <Tooltip arrow title={i18n.get("First step")}>
        <FirstPageIcon />
      </Tooltip>
    </IconButton>
  );

  const prevStepButtonClick = (
    <IconButton
      disabled={!isValid || dimensionAnimationActive}
      onClick={handlePrevStepButtonClick}
      size="small"
      sx={styles.iconButton}
    >
      <Tooltip arrow title={i18n.get("Previous step")}>
        <ChevronLeftIcon />
      </Tooltip>
    </IconButton>
  );
  const nextStepButtonClick = (
    <IconButton
      disabled={!isValid || dimensionAnimationActive}
      onClick={handleNextStepButtonClick}
      size="small"
      sx={styles.iconButton}
    >
      <Tooltip arrow title={i18n.get("Next step")}>
        <ChevronRightIcon />
      </Tooltip>
    </IconButton>
  );
  const lastStepButtonClick = (
    <IconButton
      disabled={!isValid || dimensionAnimationActive}
      onClick={handleLastStepButtonClick}
      size="small"
      sx={styles.iconButton}
    >
      <Tooltip arrow title={i18n.get("Last step")}>
        <LastPageIcon />
      </Tooltip>
    </IconButton>
  );

  return (
    <FormControl sx={styles.formControl} variant="standard">
      <Box>
        {firstStepButtonClick}
        {prevStepButtonClick}
        {playButton}
        {nextStepButtonClick}
        {lastStepButtonClick}
      </Box>
    </FormControl>
  );
}

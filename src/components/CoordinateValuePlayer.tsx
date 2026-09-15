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
  CoordinateValues,
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

interface CoordinateValuePlayerProps extends WithLocale {
  selectedVariable: Variable | null;
  selectedDimensionLabel: string | null;
  selectedDimension: Dimension | null;
  selectedCoordinateValue: number | string | null;
  selectCoordinateValues: (selectedValues: CoordinateValues) => void;
  activeAnimationDimension: string | null;
  dimensionAnimationInterval: DimensionAnimationInterval;
  incSelectedDimension: (
    increment: -1 | 1,
    selectedDimensionLabel?: string | null,
  ) => void;
  updateAnimationDimension: (
    activeAnimationDimension: string | null,
    interval: DimensionAnimationInterval,
  ) => void;
}

export default function CoordinateValuePlayer({
  selectedVariable,
  selectedDimensionLabel,
  selectedDimension,
  selectedCoordinateValue,
  selectCoordinateValues,
  incSelectedDimension,
  activeAnimationDimension,
  dimensionAnimationInterval,
  updateAnimationDimension,
}: CoordinateValuePlayerProps) {
  const intervalId = useRef<number | null>(null);
  const isPlaying =
    selectedDimensionLabel !== null &&
    activeAnimationDimension === selectedDimensionLabel;
  const hasValidDimension =
    !!selectedDimension &&
    !!selectedDimensionLabel &&
    !!selectedVariable?.dims?.includes(selectedDimension.name) &&
    selectedCoordinateValue !== null &&
    selectedCoordinateValue !== undefined;

  const handlePlayEvent = () => {
    incSelectedDimension(1, selectedDimensionLabel);
  };

  useEffect(() => {
    playOrNot();
    return uninstallTimer;
  });

  const playOrNot = () => {
    if (isPlaying) {
      installTimer();
    } else {
      uninstallTimer();
    }
  };

  const installTimer = () => {
    uninstallTimer();
    if (!hasValidDimension) {
      return;
    }
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
  // and selectedCoordinateValue
  if (
    !hasValidDimension ||
    !selectedDimension ||
    !selectedDimensionLabel
  )
    return null;

  const selectedCoordinates = selectedDimension.coordinates;

  const handlePlayButtonClick = () => {
    updateAnimationDimension(
      isPlaying ? null : selectedDimensionLabel,
      dimensionAnimationInterval,
    );
  };

  const handleNextStepButtonClick = () => {
    incSelectedDimension(1, selectedDimensionLabel);
  };

  const handlePrevStepButtonClick = () => {
    incSelectedDimension(-1, selectedDimensionLabel);
  };

  const handleFirstStepButtonClick = () => {
    selectCoordinateValues({
      [selectedDimensionLabel]: selectedCoordinates
        ? selectedCoordinates[0]
        : null,
    });
  };

  const handleLastStepButtonClick = () => {
    selectCoordinateValues({
      [selectedDimensionLabel]: selectedCoordinates
        ? selectedCoordinates[selectedCoordinates.length - 1]
        : null,
    });
  };

  const isValid = typeof selectedCoordinateValue === "number";

  const playIcon = isPlaying ? (
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
      disabled={!isValid || activeAnimationDimension !== null}
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
      disabled={!isValid || activeAnimationDimension !== null}
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
      disabled={!isValid || activeAnimationDimension !== null}
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
      disabled={!isValid || activeAnimationDimension !== null}
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

/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useState } from "react";
import { Box } from "@mui/material";
import { Theme } from "@mui/system";
import { default as OlMap } from "ol/Map";

import { useTileLoadingProgress } from "@/hooks/useTileLoadingProgress";
import { MAP_OBJECTS } from "@/states/controlState";

const styles = {
  wrapper: {
    zIndex: 1000,
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "5px",
    pointerEvents: "none",
  },
};

interface ProgressBarProps {
  enabled: boolean;
  progress: number;
  visibility: "visible" | "hidden";
}

export default function ProgressBar({
  progress,
  visibility,
  enabled,
}: ProgressBarProps) {
  const map = MAP_OBJECTS["map"] as OlMap | null;

  const [currentProgress, setProgress] = useState<number>(progress);
  const [currentVisibility, setVisibility] = useState<"hidden" | "visible">(
    visibility,
  );

  // set progress value for Tile Loading Progress Bar
  useTileLoadingProgress(map, setProgress, setVisibility);

  if (!enabled) {
    return null;
  }
  return (
    <Box sx={styles.wrapper}>
      <Box
        sx={(theme: Theme) => ({
          height: "100%",
          backgroundColor: theme.palette.primary.main,
          transition: " width 300ms ease, opacity 500ms ease",
          width: `${currentProgress}%`,
          opacity: currentProgress >= 100 ? 0 : 1,
          visibility: currentVisibility,
        })}
      />
    </Box>
  );
}

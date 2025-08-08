/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import { Box } from "@mui/material";
import { Theme } from "@mui/system";

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
  progress: number;
  visibility: "visible" | "hidden";
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  visibility,
}: ProgressBarProps) => {
  return (
    <Box sx={styles.wrapper}>
      <Box
        sx={(theme: Theme) => ({
          height: "100%",
          backgroundColor: theme.palette.primary.main,
          transition: " width 300ms ease, opacity 500ms ease",
          width: `${progress}%`,
          opacity: progress >= 100 ? 0 : 1,
          visibility: visibility,
        })}
      />
    </Box>
  );
};

export default ProgressBar;

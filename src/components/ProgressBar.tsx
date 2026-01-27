/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

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
  enabled: boolean;
  progress: number;
  visibility: "visible" | "hidden";
}

export default function ProgressBar({
  progress,
  visibility,
  enabled,
}: ProgressBarProps) {
  if (!enabled) {
    return null;
  }
  return (
    <Box sx={styles.wrapper}>
      <Box
        sx={(theme: Theme) => ({
          height: "100%",
          backgroundColor: theme.palette.primary.main,
          transition: " width 300ms ease",
          width: `${progress}%`,
          visibility: visibility,
        })}
      />
    </Box>
  );
}

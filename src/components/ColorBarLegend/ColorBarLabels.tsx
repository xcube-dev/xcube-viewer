/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { getLabelsForRange } from "@/util/label";
import { makeStyles } from "@/util/styles";

const styles = makeStyles({
  container: {
    width: "100%",
    display: "flex",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    cursor: "pointer",
  },
  label: {
    fontSize: "0.7rem",
    fontWeight: "normal",
  },
});

interface ColorBarLabelsProps {
  minValue: number;
  maxValue: number;
  numTicks: number;
  logScaled?: boolean;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function ColorBarLabels({
  minValue,
  maxValue,
  numTicks,
  logScaled,
  onClick,
}: ColorBarLabelsProps) {
  const labels = useMemo(
    () => getLabelsForRange(minValue, maxValue, numTicks, logScaled),
    [minValue, maxValue, numTicks, logScaled],
  );
  return (
    <Box sx={styles.container} onClick={onClick}>
      {labels.map((label, i) => (
        <Typography sx={styles.label} key={i}>
          {label}
        </Typography>
      ))}
    </Box>
  );
}

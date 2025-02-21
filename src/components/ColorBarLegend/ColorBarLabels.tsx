/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React, { useMemo } from "react";
import Box from "@mui/material/Box";

import { getLabelsForRange } from "@/util/label";
import { makeStyles } from "@/util/styles";

const styles = makeStyles({
  container: {
    fontSize: "x-small",
    fontWeight: "bold",
    width: "100%",
    display: "flex",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    cursor: "pointer",
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
        <span key={i}>{label}</span>
      ))}
    </Box>
  );
}

/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import i18n from "@/i18n";
import { makeStyles } from "@/util/styles";
import { WithLocale } from "@/util/lang";

const styles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 6,
    gap: 2,
  },
});

interface NoTimeSeriesChartProps extends WithLocale {
  canAddTimeSeries: boolean;
  addTimeSeries: () => void;
}

export default function NoTimeSeriesChart({
  canAddTimeSeries,
  addTimeSeries,
}: NoTimeSeriesChartProps) {
  return (
    <Box sx={styles.container}>
      <Button disabled={!canAddTimeSeries} onClick={addTimeSeries}>
        {i18n.get("Add Time-Series")}
      </Button>
      <Typography fontSize="smaller">
        {i18n.get(
          "No time-series have been obtained yet. Select a variable and a place first.",
        )}
      </Typography>
    </Box>
  );
}

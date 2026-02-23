/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { LegendProps } from "recharts";
import { Payload as LegendPayload } from "recharts/types/component/DefaultLegendContent";

import { makeStyles } from "@/util/styles";
import Box from "@mui/material/Box";

const styles = makeStyles({
  legendContainer: {
    display: "flex",
    justifyContent: "center",
    columnGap: "12px",
    flexWrap: "wrap",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
  },
  legendCloseIcon: {
    marginLeft: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
});

interface CustomLegendProps {
  removeTimeSeries?: (index: number) => void;
}

export default function CustomLegend({
  payload,
  removeTimeSeries,
}: CustomLegendProps & LegendProps) {
  if (!payload || payload.length === 0) {
    return null;
  }

  return (
    <Box sx={styles.legendContainer}>
      {payload.map((pl: LegendPayload, index: number) => (
        <Box key={pl.value} sx={{ ...styles.legendItem, color: pl.color }}>
          <span>{pl.value}</span>
          {removeTimeSeries && (
            <Box
              component="span"
              sx={styles.legendCloseIcon}
              // Note, onClick() does not fire in any subcomponent
              // of <Legend/>!
              onMouseUp={() => removeTimeSeries(index)}
            >
              <RemoveCircleOutlineIcon fontSize={"small"} />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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

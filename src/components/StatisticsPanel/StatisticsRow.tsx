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

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import TransformIcon from "@mui/icons-material/Transform";

import { makeStyles } from "@/util/styles";
import { WithLocale } from "@/util/lang";
import { isAreaStatistics, StatisticsRecord } from "@/model/statistics";
import StatisticsTable from "@/components/StatisticsPanel/StatisticsTable";
import HistogramChart from "@/components/StatisticsPanel/HistogramChart";
import ToggleButton from "@mui/material/ToggleButton";
import { useState } from "react";

const styles = makeStyles({
  container: {
    padding: 1,
    width: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 0.5,
  },
  actions: {
    display: "flex",
    gap: 0.1,
  },
  body: {
    display: "flex",
  },
  table: {
    flexGrow: 0,
  },
  chart: {
    flexGrow: 1,
  },
});

interface StatisticsRowProps extends WithLocale {
  statisticsRecord: StatisticsRecord;
  onRemove: () => void;
}

export default function StatisticsRow({
  locale,
  statisticsRecord,
  onRemove,
}: StatisticsRowProps) {
  const [brush, setBrush] = useState(false);
  const { dataset, variable, time, placeInfo } = statisticsRecord.source;
  const hasHistogram = isAreaStatistics(statisticsRecord.statistics);
  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Box>
          <Typography fontSize="smaller">
            {`${dataset.title} / ${variable.name} for ${placeInfo.label} at ${time}`}
          </Typography>
        </Box>
        <Box sx={styles.actions}>
          {hasHistogram && (
            <ToggleButton
              selected={brush}
              onClick={() => setBrush(!brush)}
              value="brush"
              size="small"
            >
              <TransformIcon fontSize="inherit" />
            </ToggleButton>
          )}
          <IconButton size="small" onClick={() => onRemove()}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Box>
      <Box sx={styles.body}>
        <Box sx={styles.table}>
          <StatisticsTable
            locale={locale}
            statisticsRecord={statisticsRecord}
          />
        </Box>
        <Box sx={styles.chart}>
          <HistogramChart
            showBrush={brush}
            statisticsRecord={statisticsRecord}
          />
        </Box>
      </Box>
    </Box>
  );
}

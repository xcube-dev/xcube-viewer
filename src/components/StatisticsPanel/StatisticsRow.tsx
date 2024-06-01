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

import { makeStyles } from "@/util/styles";
import { WithLocale } from "@/util/lang";
import { StatisticsRecord } from "@/model/statistics";
import StatisticsTable from "@/components/StatisticsPanel/StatisticsTable";
import HistogramChart from "@/components/StatisticsPanel/HistogramChart";

const styles = makeStyles({
  container: {
    padding: 1,
    width: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
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
  const { dataset, variable, place } = statisticsRecord.source;
  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography fontSize="smaller">
          {`${dataset.title} / ${variable.name} (${place.name})`}
        </Typography>
        <IconButton size={"small"} onClick={() => onRemove()}>
          <CloseIcon fontSize={"inherit"} />
        </IconButton>
      </Box>
      <Box sx={styles.body}>
        <Box sx={styles.chart}>
          <StatisticsTable
            locale={locale}
            statisticsRecord={statisticsRecord}
          />
        </Box>
        <Box sx={styles.chart}>
          <HistogramChart statisticsRecord={statisticsRecord} />
        </Box>
      </Box>
    </Box>
  );
}

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

import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import IsoIcon from "@mui/icons-material/Iso";
import TransformIcon from "@mui/icons-material/Transform";

import i18n from "@/i18n";
import { makeStyles } from "@/util/styles";
import { WithLocale } from "@/util/lang";
import { isAreaStatistics, StatisticsRecord } from "@/model/statistics";
import SnapshotButton from "@/components/SnapshotButton";
import StatisticsTable from "./StatisticsTable";
import HistogramChart from "./HistogramChart";
import StatisticsRow from "./StatisticsRow";
import { MessageType } from "@/states/messageLogState";

const styles = makeStyles({
  table: {
    flexGrow: 0,
  },
  chart: {
    flexGrow: 1,
  },
});

interface StatisticsDataRowProps extends WithLocale {
  statisticsRecord: StatisticsRecord;
  rowIndex: number;
  removeStatistics: (rowIndex: number) => void;
  postMessage: (messageType: MessageType, messageText: string | Error) => void;
}

export default function StatisticsDataRow({
  locale,
  statisticsRecord,
  rowIndex,
  removeStatistics,
  postMessage,
}: StatisticsDataRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [brush, setBrush] = useState(false);
  const [details, setDetails] = useState(false);
  const { dataset, variable, time, placeInfo } = statisticsRecord.source;
  const hasHistogram = isAreaStatistics(statisticsRecord.statistics);
  const handleToggleDetails = () => {
    setDetails(!details);
  };
  const handleToggleBrush = () => {
    setBrush(!brush);
  };
  const handleRemoveStatistics = () => {
    removeStatistics(rowIndex);
  };
  return (
    <StatisticsRow
      dataset={dataset}
      variable={variable}
      time={time}
      placeInfo={placeInfo}
      containerRef={containerRef}
      actions={
        <>
          {hasHistogram && (
            <ToggleButtonGroup size="small">
              <Tooltip arrow title={i18n.get("Toggle adjustable x-range")}>
                <ToggleButton
                  selected={brush}
                  onClick={handleToggleBrush}
                  value="brush"
                  size="small"
                >
                  <TransformIcon fontSize="inherit" />
                </ToggleButton>
              </Tooltip>
              <Tooltip
                arrow
                title={i18n.get("Show standard deviation (if any)")}
              >
                <ToggleButton
                  selected={details}
                  onClick={handleToggleDetails}
                  value="details"
                  size="small"
                >
                  <IsoIcon fontSize="inherit" />
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>
          )}

          {hasHistogram && (
            <SnapshotButton
              elementRef={containerRef}
              postMessage={postMessage}
            />
          )}

          <IconButton size="small" onClick={handleRemoveStatistics}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </>
      }
      body={
        <>
          <Box sx={styles.table}>
            <StatisticsTable
              locale={locale}
              statisticsRecord={statisticsRecord}
            />
          </Box>
          <Box sx={styles.chart}>
            <HistogramChart
              showBrush={brush}
              showDetails={details}
              statisticsRecord={statisticsRecord}
            />
          </Box>
        </>
      }
    />
  );
}

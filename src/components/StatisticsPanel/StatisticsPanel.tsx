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

import { makeStyles } from "@/util/styles";
import { StatisticsRecord } from "@/model/statistics";
import { Dataset } from "@/model/dataset";
import { Variable } from "@/model/variable";
import { PlaceInfo } from "@/model/place";
import StatisticsDataRow from "./StatisticsDataRow";
import StatisticsFirstRow from "./StatisticsFirstRow";
import { MessageType } from "@/states/messageLogState";
import { useRef } from "react";

const styles = makeStyles({
  container: {
    padding: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
});

interface StatisticsPanelProps {
  selectedDataset: Dataset | null;
  selectedVariable: Variable | null;
  selectedTime: string | null;
  selectedPlaceInfo: PlaceInfo | null;
  statisticsLoading: boolean;
  statisticsRecords: StatisticsRecord[];
  addStatistics: () => void;
  removeStatistics: (index: number) => void;
  postMessage: (messageType: MessageType, messageText: string | Error) => void;
}

export default function StatisticsPanel({
  selectedDataset,
  selectedVariable,
  selectedTime,
  selectedPlaceInfo,
  statisticsLoading,
  statisticsRecords,
  addStatistics,
  removeStatistics,
  postMessage,
}: StatisticsPanelProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <Box sx={styles.container}>
      <StatisticsFirstRow
        selectedDataset={selectedDataset}
        selectedVariable={selectedVariable}
        selectedTime={selectedTime}
        selectedPlaceInfo={selectedPlaceInfo}
        addStatistics={addStatistics}
        statisticsLoading={statisticsLoading}
      />
      {statisticsRecords.map((sr, rowIndex) => (
        <StatisticsDataRow
          key={rowIndex}
          statisticsRecord={sr}
          rowIndex={rowIndex}
          removeStatistics={removeStatistics}
          chartContainerRef={chartContainerRef}
          postMessage
        />
      ))}
    </Box>
  );
}

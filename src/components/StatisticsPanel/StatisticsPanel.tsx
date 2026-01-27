/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import Box from "@mui/material/Box";

import { ExportResolution } from "@/states/controlState";
import { MessageType } from "@/states/messageLogState";
import { StatisticsRecord } from "@/model/statistics";
import { Dataset } from "@/model/dataset";
import { Variable } from "@/model/variable";
import { PlaceInfo } from "@/model/place";
import { makeStyles } from "@/util/styles";
import StatisticsDataRow from "./StatisticsDataRow";
import StatisticsFirstRow from "./StatisticsFirstRow";

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
  canAddStatistics: boolean;
  addStatistics: () => void;
  removeStatistics: (index: number) => void;
  postMessage: (messageType: MessageType, messageText: string | Error) => void;
  exportResolution: ExportResolution;
}

export default function StatisticsPanel({
  selectedDataset,
  selectedVariable,
  selectedTime,
  selectedPlaceInfo,
  statisticsLoading,
  statisticsRecords,
  canAddStatistics,
  addStatistics,
  removeStatistics,
  postMessage,
  exportResolution,
}: StatisticsPanelProps) {
  return (
    <Box sx={styles.container}>
      <StatisticsFirstRow
        selectedDataset={selectedDataset}
        selectedVariable={selectedVariable}
        selectedTime={selectedTime}
        selectedPlaceInfo={selectedPlaceInfo}
        canAddStatistics={canAddStatistics}
        addStatistics={addStatistics}
        statisticsLoading={statisticsLoading}
      />
      {statisticsRecords.map((sr, rowIndex) => (
        <StatisticsDataRow
          key={rowIndex}
          statisticsRecord={sr}
          rowIndex={rowIndex}
          removeStatistics={removeStatistics}
          postMessage={postMessage}
          exportResolution={exportResolution}
        />
      ))}
    </Box>
  );
}

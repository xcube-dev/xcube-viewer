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
import { Place } from "@/model/place";
import StatisticsRow from "./StatisticsRow";
import LastStatisticsRow from "./LastStatisticsRow";

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
  selectedPlace: Place | null;
  selectedTimeLabel: string | null;
  statisticsLoading: boolean;
  statisticsRecords: StatisticsRecord[];
  addStatistics: () => void;
  removeStatistics: (index: number) => void;
}

export default function StatisticsPanel({
  selectedDataset,
  selectedVariable,
  selectedPlace,
  selectedTimeLabel,
  statisticsLoading,
  statisticsRecords,
  addStatistics,
  removeStatistics,
}: StatisticsPanelProps) {
  const canAddStatistics =
    !statisticsLoading &&
    !!(
      selectedTimeLabel &&
      selectedPlace &&
      selectedVariable &&
      selectedDataset
    );

  return (
    <Box sx={styles.container}>
      {statisticsRecords.map((sr, index) => (
        <StatisticsRow
          key={index}
          statisticsRecord={sr}
          onRemove={() => removeStatistics(index)}
        />
      ))}
      <LastStatisticsRow
        hasStatistics={statisticsRecords.length > 0}
        canAddStatistics={canAddStatistics}
        isLoading={statisticsLoading}
        addStatistics={addStatistics}
      />
    </Box>
  );
}

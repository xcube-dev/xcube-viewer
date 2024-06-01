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
import LastStatisticsRow from "./LastStatisticsRow";
import StatisticsRow from "@/components/StatisticsPanel/StatisticsRow";
import { useState } from "react";

const styles = makeStyles({
  container: {
    padding: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
});

interface FetchResult<T> {
  loading?: boolean;
  error?: unknown; // TODO: align with server
  data?: T;
}

interface StatisticsPanelProps {
  // statisticsRecords: StatisticsRecord[];
  // canAddStatistics: boolean;
  // addStatistics: () => void;
  testMode?: boolean;
}

export default function StatisticsPanel({
  // statisticsRecords,
  // canAddStatistics,
  // addStatistics,
  testMode,
}: StatisticsPanelProps) {
  const [statisticsRecords, setStatisticsRecords] = useState<
    StatisticsRecord[]
  >([]);
  const [];

  const addStatisticsMock = () => {
    const i = statisticsRecords.length + 1;
    setStatisticsRecords([
      ...statisticsRecords,
      {
        source: {
          datasetId: `ds${i}`,
          datasetTitle: `Dataset ${i}`,
          variableName: "CHL",
          placeId: "p029840456",
          geometry: null,
        },
        minimum: i,
        maximum: i + 1,
        mean: i + 0.5,
        standardDev: 0.1 * i,
        histogram: {
          bins: Array.from({ length: 100 }, (_, index) => ({
            x1: index,
            xc: index + 0.5,
            x2: index + 1,
            count: 1000 * Math.random(),
          })),
        },
      },
    ]);
  };

  const addStatistics = () => {
    if (testMode) {
      addStatisticsMock();
    }
  };

  const removeStatistics = (index: number) => {
    setStatisticsRecords([
      ...statisticsRecords.slice(0, index),
      ...statisticsRecords.slice(index + 1),
    ]);
  };

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
        canAddStatistics={true}
        addStatistics={addStatistics}
      />
    </Box>
  );
}

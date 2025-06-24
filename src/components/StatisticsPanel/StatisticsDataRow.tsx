/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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
import HoverVisibleBox from "@/components/HoverVisibleBox";
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
  hoverVisibleBox: {
    display: "flex",
    gap: 0.1,
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
          <HoverVisibleBox sx={styles.hoverVisibleBox} initialOpacity={0.05}>
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
          </HoverVisibleBox>
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

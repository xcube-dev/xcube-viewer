/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React, { RefObject } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { makeStyles } from "@/util/styles";
import { WithLocale } from "@/util/lang";
import { Dataset } from "@/model/dataset";
import { Variable } from "@/model/variable";
import { PlaceInfo } from "@/model/place";
import i18n from "@/i18n";
import { isoDateTimeStringToLabel } from "@/util/time";

const styles = makeStyles({
  container: {
    padding: 0,
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
});

interface StatisticsRowProps extends WithLocale {
  dataset: Dataset | null;
  variable: Variable | null;
  time: string | null;
  placeInfo: PlaceInfo | null;
  actions: React.ReactNode;
  body?: React.ReactNode;
  containerRef?: RefObject<HTMLDivElement>;
}

function Missing({ phrase }: { phrase: string }) {
  return <span style={{ color: "red" }}>{`<${i18n.get(phrase)}?>`}</span>;
}

export default function StatisticsRow({
  dataset,
  variable,
  time,
  placeInfo,
  actions,
  body,
  containerRef,
}: StatisticsRowProps) {
  const datasetLabel = dataset ? dataset.title : <Missing phrase="Dataset" />;
  const variableLabel = variable ? (
    variable.name
  ) : (
    <Missing phrase="Variable" />
  );
  const isTimeDimensionAvailable = dataset?.dimensions.some(
    (data: { name: string }) => data.name == "time",
  );
  const timeLabel = time ? (
    isoDateTimeStringToLabel(time)
  ) : isTimeDimensionAvailable ? (
    <Missing phrase="Time" />
  ) : null;
  const placeLabel = placeInfo ? placeInfo.label : <Missing phrase="Place" />;
  return (
    <Box sx={styles.container} ref={containerRef}>
      <Box sx={styles.header}>
        <Typography fontSize="small">
          {datasetLabel} / {variableLabel}
          {timeLabel && `, ${timeLabel}`}, {placeLabel}
        </Typography>
        <Box sx={styles.actions}>{actions}</Box>
      </Box>
      {body && <Box sx={styles.body}>{body}</Box>}
    </Box>
  );
}

/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { getLabelForValue } from "@/util/label";
import MapPointInfo, { Payload } from "./MapPointInfo";
import Box from "@mui/material/Box";
import { makeStyles } from "@/util/styles";
import { isNumber } from "@/util/types";
import { useMemo } from "react";

const styles = makeStyles({
  container: {
    display: "grid",
    gridTemplateColumns: "auto minmax(60px, auto)",
    gap: 0,
    padding: 1,
    fontSize: "small",
  },
  labelItem: { paddingRight: 1 },
  valueItem: {
    textAlign: "right",
    fontFamily: "monospace",
  },
});

type MapPointInfoContentProps = MapPointInfo;

export default function MapPointInfoContent({
  location,
  payload,
  payload2,
}: MapPointInfoContentProps) {
  const payloadLabel = useMemo(() => {
    return payload2 ? "(R) " + formatLabel(payload) : formatLabel(payload);
  }, [payload, payload2]);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.labelItem}>{"Longitude"}</Box>
      <Box sx={styles.valueItem}>{getLabelForValue(location.lon, 4)}</Box>
      <Box sx={styles.labelItem}>{"Latitude"}</Box>
      <Box sx={styles.valueItem}>{getLabelForValue(location.lat, 4)}</Box>

      <Box sx={styles.labelItem}>{payloadLabel}</Box>
      <Box sx={styles.valueItem}>{formatValue(payload)}</Box>
      {payload2 && (
        <Box sx={styles.labelItem}>{"(L) " + formatLabel(payload2)}</Box>
      )}
      {payload2 && <Box sx={styles.valueItem}>{formatValue(payload2)}</Box>}
    </Box>
  );
}

function formatLabel(payload: Payload) {
  const variable = payload.variable;
  return variable.title || variable.name;
}

function formatValue(payload: Payload) {
  const result = payload.result;
  if (result.error) {
    return `${result.error}`;
  } else if (result.fetching) {
    return "..."; // "Loading...";
  } else if (isNumber(result.value)) {
    return getLabelForValue(result.value, 4);
  } else {
    return "---";
  }
}

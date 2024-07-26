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

import { getLabelForValue } from "@/util/label";
import MapPointInfo, { Payload } from "./MapPointInfo";
import Box from "@mui/material/Box";
import { makeStyles } from "@/util/styles";
import { isNumber } from "@/util/types";

const styles = makeStyles({
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 0,
    padding: 1,
    fontSize: "small",
  },
  labelItem: { paddingRight: 1 },
  valueItem: {},
});

interface MapPointInfoContentProps extends MapPointInfo {}

export default function MapPointInfoContent({
  location,
  payload,
  payload2,
}: MapPointInfoContentProps) {
  return (
    <Box sx={styles.container}>
      <Box sx={styles.labelItem}>{"Longitude"}</Box>
      <Box sx={styles.valueItem}>{getLabelForValue(location.lon, 4)}</Box>
      <Box sx={styles.labelItem}>{"Latitude"}</Box>
      <Box sx={styles.valueItem}>{getLabelForValue(location.lat, 4)}</Box>

      <Box sx={styles.labelItem}>{formatLabel(payload)}</Box>
      <Box sx={styles.valueItem}>{formatValue(payload)}</Box>
      {payload2 && <Box sx={styles.labelItem}>{formatLabel(payload2)}</Box>}
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

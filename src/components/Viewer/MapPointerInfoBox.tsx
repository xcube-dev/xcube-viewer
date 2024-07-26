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
import MapPointerInfo from "./MapPointerInfo";
import Box from "@mui/material/Box";
import { makeStyles } from "@/util/styles";
import { isNumber } from "@/util/types";

const styles = makeStyles({
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 0.2,
    fontSize: "small",
  },
  item: { padding: 0.2 },
});

interface MapPointerInfoBoxProps extends MapPointerInfo {}

export default function MapPointerInfoBox({
  lon,
  lat,
  valueState,
}: MapPointerInfoBoxProps) {
  let valueLabel: string;
  if (valueState.error) {
    valueLabel = `${valueState.error}`;
  } else if (valueState.fetching) {
    valueLabel = "..."; // "Loading...";
  } else if (isNumber(valueState.value)) {
    valueLabel = getLabelForValue(valueState.value, 4);
  } else {
    valueLabel = "---";
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.item}>{"Longitude"}</Box>
      <Box sx={styles.item}>{getLabelForValue(lon, 4)}</Box>
      <Box sx={styles.item}>{"Latitude"}</Box>
      <Box sx={styles.item}>{getLabelForValue(lat, 4)}</Box>

      <Box sx={styles.item}>{"Value"}</Box>
      <Box sx={styles.item}>{valueLabel}</Box>
    </Box>
  );
}

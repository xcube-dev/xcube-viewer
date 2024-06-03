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

import React from "react";
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
    padding: 1,
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
}: StatisticsRowProps) {
  const datasetLabel = dataset ? dataset.title : <Missing phrase="Dataset" />;
  const variableLabel = variable ? (
    variable.name
  ) : (
    <Missing phrase="Variable" />
  );
  const timeLabel = time ? (
    isoDateTimeStringToLabel(time)
  ) : (
    <Missing phrase="Time" />
  );
  const placeLabel = placeInfo ? placeInfo.label : <Missing phrase="Place" />;
  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography fontSize="small">
          {datasetLabel} / {variableLabel}, {timeLabel}, {placeLabel}
        </Typography>
        <Box sx={styles.actions}>{actions}</Box>
      </Box>
      {body && <Box sx={styles.body}>{body}</Box>}
    </Box>
  );
}

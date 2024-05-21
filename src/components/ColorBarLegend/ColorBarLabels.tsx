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

import React, { useMemo } from "react";
import makeStyles from "@mui/styles/makeStyles";

import { getLabelsForRange } from "@/util/label";

const useStyles = makeStyles(() => ({
  label: {
    fontSize: "x-small",
    fontWeight: "bold",
    width: "100%",
    display: "flex",
    flexWrap: "nowrap",
    justifyContent: "space-between",
  },
}));

interface ColorBarLabelsProps {
  minValue: number;
  maxValue: number;
  numTicks: number;
  logScaled?: boolean;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function ColorBarLabels({
  minValue,
  maxValue,
  numTicks,
  logScaled,
  onClick,
}: ColorBarLabelsProps) {
  const classes = useStyles();
  const labels = useMemo(
    () => getLabelsForRange(minValue, maxValue, numTicks, logScaled),
    [minValue, maxValue, numTicks, logScaled],
  );
  return (
    <div className={classes.label} onClick={onClick}>
      {labels.map((label, i) => (
        <span key={i}>{label}</span>
      ))}
    </div>
  );
}

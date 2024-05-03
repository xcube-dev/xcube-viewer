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

import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "@mui/material/styles";
import { TooltipProps } from "recharts";
import { Payload as TooltipPayload } from "recharts/types/component/DefaultTooltipContent";

import { utcTimeToIsoDateTimeString } from "@/util/time";
import { isNumber } from "@/util/types";

const useStyles = makeStyles((theme: Theme) => ({
  toolTipContainer: {
    backgroundColor: "black",
    opacity: 0.8,
    color: "white",
    border: "2px solid black",
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1.5),
  },

  toolTipValue: {
    fontWeight: "bold",
  },
  toolTipLabel: {
    fontWeight: "bold",
    paddingBottom: theme.spacing(1),
  },
}));

const INVISIBLE_LINE_COLOR = "#00000000";
const SUBSTITUTE_LABEL_COLOR = "#FAFFDD";

interface CustomTooltipProps extends TooltipProps<number, string> {}

export default function CustomTooltip({
  active,
  label,
  payload,
}: CustomTooltipProps) {
  const classes = useStyles();
  if (!active) {
    return null;
  }
  if (!isNumber(label)) {
    return null;
  }
  if (!payload || payload.length === 0) {
    return null;
  }
  const items = payload.map(
    (p: TooltipPayload<number, string>, index: number) => {
      const { name, value, unit, dataKey } = p;
      let color = p.color;
      if (!isNumber(value)) {
        return null;
      }
      // let valueText;
      // if (typeof p.std === 'number') {
      //     valueText = `${value.toFixed(2)} ±${p.std.toFixed(2)} (std)`;
      // } else {
      //     valueText = value.toFixed(3);
      // }
      const nameText = name || "?";
      const valueText = value.toFixed(3);
      if (color === INVISIBLE_LINE_COLOR) {
        color = SUBSTITUTE_LABEL_COLOR;
      }
      const isPoint = nameText.indexOf(":") !== -1;
      let suffixText = isPoint ? "" : ` (${dataKey})`;
      if (typeof unit === "string") {
        if (suffixText !== "") {
          suffixText = `${unit} ${suffixText}`;
        } else {
          suffixText = unit;
        }
      }
      return (
        <div key={index}>
          <span>{nameText}:&nbsp;</span>
          <span className={classes.toolTipValue} style={{ color }}>
            {valueText}
          </span>
          <span>&nbsp;{suffixText}</span>
        </div>
      );
    },
  );

  if (!items) {
    return null;
  }

  return (
    <div className={classes.toolTipContainer}>
      <span
        className={classes.toolTipLabel}
      >{`${utcTimeToIsoDateTimeString(label)} UTC`}</span>
      {items}
    </div>
  );
}

/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { TooltipProps } from "recharts";
import { Payload as TooltipPayload } from "recharts/types/component/DefaultTooltipContent";

import { utcTimeToIsoDateTimeString } from "@/util/time";
import { isNumber } from "@/util/types";
import { makeStyles } from "@/util/styles";
import Box from "@mui/material/Box";

const styles = makeStyles({
  toolTipContainer: (theme) => ({
    backgroundColor: "black",
    opacity: 0.8,
    color: "white",
    border: "2px solid black",
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1.5),
  }),
  toolTipValue: {
    fontWeight: "bold",
  },
  toolTipLabel: (theme) => ({
    fontWeight: "bold",
    paddingBottom: theme.spacing(1),
  }),
});

const INVISIBLE_LINE_COLOR = "#00000000";
const SUBSTITUTE_LABEL_COLOR = "#FAFFDD";

type CustomTooltipProps = TooltipProps<number, string>;

export default function CustomTooltip({
  active,
  label,
  payload,
}: CustomTooltipProps) {
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
          <Box component="span" sx={styles.toolTipValue} style={{ color }}>
            {valueText}
          </Box>
          <span>&nbsp;{suffixText}</span>
        </div>
      );
    },
  );

  if (!items) {
    return null;
  }

  return (
    <Box sx={styles.toolTipContainer}>
      <Box
        component="span"
        sx={styles.toolTipLabel}
      >{`${utcTimeToIsoDateTimeString(label)} UTC`}</Box>
      {items}
    </Box>
  );
}

/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React, { ChangeEvent, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CompressIcon from "@mui/icons-material/Compress";

import i18n from "@/i18n";
import { ColorBarNorm } from "@/model/variable";
import { makeStyles } from "@/util/styles";
import ColorBarRangeSlider from "./ColorBarRangeSlider";
import { ColorBar } from "@/model/colorBar";
import ToolButton from "@/components/ToolButton";

const HOR_SLIDER_MARGIN = 5;

const styles = makeStyles({
  container: (theme) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    gap: 1,
  }),
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { paddingLeft: 2, fontWeight: "bold" },
  sliderBox: (theme) => ({
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(HOR_SLIDER_MARGIN),
    marginRight: theme.spacing(HOR_SLIDER_MARGIN),
    minWidth: 320,
    width: `calc(100% - ${theme.spacing(2 * (HOR_SLIDER_MARGIN + 1))}px)`,
  }),
  logLabel: { margin: 0, paddingRight: 2, fontWeight: "bold" },
  minMaxBox: {
    display: "flex",
    justifyContent: "center",
  },
  minTextField: {
    maxWidth: "8em",
    marginRight: 2,
  },
  maxTextField: {
    maxWidth: "8em",
    marginLeft: 2,
  },
});

interface ColorBarRangeEditorProps {
  variableColorBar: ColorBar;
  variableColorBarName: string;
  variableColorBarMinMax: [number, number];
  variableColorBarNorm: ColorBarNorm;
  variableOpacity: number;
  updateVariableColorBar: (
    colorBarName: string,
    colorBarMinMax: [number, number],
    colorBarNorm: ColorBarNorm,
    opacity: number,
  ) => void;
}

export default function ColorBarRangeEditor({
  variableColorBar,
  variableColorBarName,
  variableColorBarMinMax,
  variableColorBarNorm,
  variableOpacity,
  updateVariableColorBar,
}: ColorBarRangeEditorProps) {
  const [currentMinMax, setCurrentMinMax] = useState<[number, number]>(
    variableColorBarMinMax,
  );
  const [originalMinMax, setOriginalMinMax] = useState<[number, number]>(
    variableColorBarMinMax,
  );
  const [enteredMinMax, setEnteredMinMax] = useState<[string, string]>(
    minMaxToText(variableColorBarMinMax),
  );
  const [enteredMinMaxError, setEnteredMinMaxError] = useState<
    [boolean, boolean]
  >([false, false]);

  useEffect(() => {
    setEnteredMinMax(minMaxToText(variableColorBarMinMax));
  }, [variableColorBarMinMax]);

  const handleEnteredMinChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const enteredValue = event.target.value;
    setEnteredMinMax([enteredValue, enteredMinMax[1]]);
    const minValue = Number.parseFloat(enteredValue);
    let error = false;
    if (!Number.isNaN(minValue) && minValue < currentMinMax[1]) {
      if (minValue !== currentMinMax[0]) {
        const newMinMax: [number, number] = [minValue, currentMinMax[1]];
        setCurrentMinMax(newMinMax);
        setOriginalMinMax(newMinMax);
        updateVariableColorBar(
          variableColorBarName,
          newMinMax,
          variableColorBarNorm,
          variableOpacity,
        );
      }
    } else {
      error = true;
    }
    setEnteredMinMaxError([error, enteredMinMaxError[1]]);
  };

  const handleEnteredMaxChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const enteredValue = event.target.value;
    setEnteredMinMax([enteredMinMax[0], enteredValue]);
    const maxValue = Number.parseFloat(enteredValue);
    let error = false;
    if (!Number.isNaN(maxValue) && maxValue > currentMinMax[0]) {
      if (maxValue !== currentMinMax[1]) {
        const newMinMax: [number, number] = [currentMinMax[0], maxValue];
        setCurrentMinMax(newMinMax);
        setOriginalMinMax(newMinMax);
        updateVariableColorBar(
          variableColorBarName,
          newMinMax,
          variableColorBarNorm,
          variableOpacity,
        );
      }
    } else {
      error = true;
    }
    setEnteredMinMaxError([enteredMinMaxError[0], error]);
  };

  const handleFromColorRecords = () => {
    const colorRecords = variableColorBar.colorRecords!;
    const vMin = colorRecords[0].value;
    const vMax = colorRecords[colorRecords.length - 1].value;
    const newMinMax: [number, number] = [vMin, vMax];
    setCurrentMinMax(newMinMax);
    setOriginalMinMax(newMinMax);
    updateVariableColorBar(
      variableColorBarName,
      newMinMax,
      variableColorBarNorm,
      variableOpacity,
    );
    setEnteredMinMaxError([false, false]);
  };

  const handleColorBarNorm = (
    _event: ChangeEvent<HTMLInputElement>,
    value: boolean,
  ) => {
    updateVariableColorBar(
      variableColorBarName,
      variableColorBarMinMax,
      value ? "log" : "lin",
      variableOpacity,
    );
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography sx={styles.title}>{i18n.get("Value Range")}</Typography>
        <span style={{ flexGrow: 1 }} />
        {variableColorBar.colorRecords && (
          <ToolButton
            sx={{ marginRight: 1 }}
            icon={<CompressIcon />}
            onClick={handleFromColorRecords}
            tooltipText={i18n.get("Set min/max from color mapping values")}
          />
        )}
        <FormControlLabel
          sx={styles.logLabel}
          control={
            <Tooltip title={i18n.get("Logarithmic scaling")}>
              <Switch
                checked={variableColorBarNorm === "log"}
                onChange={handleColorBarNorm}
                size="small"
              />
            </Tooltip>
          }
          label={
            <Typography variant="body2">{i18n.get("Log-scaled")}</Typography>
          }
          labelPlacement="start"
        />
      </Box>
      <Box sx={styles.sliderBox}>
        <ColorBarRangeSlider
          variableColorBarName={variableColorBarName}
          variableColorBarMinMax={variableColorBarMinMax}
          variableColorBarNorm={variableColorBarNorm}
          updateVariableColorBar={updateVariableColorBar}
          originalColorBarMinMax={originalMinMax}
          variableOpacity={variableOpacity}
        />
      </Box>
      <Box component="form" sx={styles.minMaxBox}>
        <TextField
          sx={styles.minTextField}
          label="Minimum"
          variant="filled"
          size="small"
          value={enteredMinMax[0]}
          error={enteredMinMaxError[0]}
          onChange={(evt) => handleEnteredMinChange(evt)}
        />
        <TextField
          sx={styles.maxTextField}
          label="Maximum"
          variant="filled"
          size="small"
          value={enteredMinMax[1]}
          error={enteredMinMaxError[1]}
          onChange={(evt) => handleEnteredMaxChange(evt)}
        />
      </Box>
    </Box>
  );
}

function minMaxToText(minMaxValue: [number, number]): [string, string] {
  return [minMaxValue[0] + "", minMaxValue[1] + ""];
}

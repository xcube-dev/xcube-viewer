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

import React, { ChangeEvent, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";

import i18n from "@/i18n";
import { ColorBarNorm } from "@/model/variable";
import { makeStyles } from "@/util/styles";
import ColorBarRangeSlider from "./ColorBarRangeSlider";
import { FormControlLabel } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

const HOR_SLIDER_MARGIN = 5;

const styles = makeStyles({
  colorBarMinMaxEditor: (theme) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }),
  header: {
    display: "flex",
    justifyContent: "space-between",
  },
  sliderBox: (theme) => ({
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(HOR_SLIDER_MARGIN),
    marginRight: theme.spacing(HOR_SLIDER_MARGIN),
    minWidth: 320,
    width: `calc(100% - ${theme.spacing(2 * (HOR_SLIDER_MARGIN + 1))}px)`,
  }),
  minMaxBox: {
    display: "flex",
    justifyContent: "center",
  },
  minTextField: {
    maxWidth: "8em",
    paddingRight: 2,
  },
  maxTextField: {
    maxWidth: "8em",
    paddingLeft: 2,
  },
});

interface ColorBarRangeEditorProps {
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
    <Box sx={styles.colorBarMinMaxEditor}>
      <Box sx={styles.header}>
        <Typography style={{ paddingLeft: 14, fontWeight: "bold" }}>
          {i18n.get("Scale value-range")}
        </Typography>
        <span style={{ flexGrow: 1 }} />
        <FormControlLabel
          sx={{ margin: 0 }}
          control={
            <Tooltip title={i18n.get("Logarithmic scaling")}>
              <Switch
                value={variableColorBarNorm === "log"}
                onChange={handleColorBarNorm}
                size="small"
              />
            </Tooltip>
          }
          label={i18n.get("Log")}
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

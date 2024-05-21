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

import React, { useEffect, useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import { ColorBarNorm } from "@/model/variable";
import ColorBarRangeSlider from "./ColorBarRangeSlider";

const HOR_SLIDER_MARGIN = 5;

const useStyles = makeStyles((theme: Theme) => ({
  colorBarMinMaxEditor: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  sliderBox: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(HOR_SLIDER_MARGIN),
    marginRight: theme.spacing(HOR_SLIDER_MARGIN),
    minWidth: 320,
    width: `calc(100% - ${theme.spacing(2 * (HOR_SLIDER_MARGIN + 1))}px)`,
  },
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
}));

interface ColorBarRangeEditorProps {
  variableTitle: string;
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
  variableTitle,
  variableColorBarName,
  variableColorBarMinMax,
  variableColorBarNorm,
  variableOpacity,
  updateVariableColorBar,
}: ColorBarRangeEditorProps) {
  const classes = useStyles();

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

  return (
    <div className={classes.colorBarMinMaxEditor}>
      <span style={{ paddingLeft: 14 }}>{variableTitle}</span>
      <Box className={classes.sliderBox}>
        <ColorBarRangeSlider
          variableColorBarName={variableColorBarName}
          variableColorBarMinMax={variableColorBarMinMax}
          variableColorBarNorm={variableColorBarNorm}
          updateVariableColorBar={updateVariableColorBar}
          originalColorBarMinMax={originalMinMax}
          variableOpacity={variableOpacity}
        />
      </Box>
      <Box component="form" className={classes.minMaxBox}>
        <TextField
          className={classes.minTextField}
          label="Minimum"
          variant="filled"
          size="small"
          value={enteredMinMax[0]}
          error={enteredMinMaxError[0]}
          onChange={(evt) => handleEnteredMinChange(evt)}
        />
        <TextField
          className={classes.maxTextField}
          label="Maximum"
          variant="filled"
          size="small"
          value={enteredMinMax[1]}
          error={enteredMinMaxError[1]}
          onChange={(evt) => handleEnteredMaxChange(evt)}
        />
      </Box>
    </div>
  );
}

function minMaxToText(minMaxValue: [number, number]): [string, string] {
  return [minMaxValue[0] + "", minMaxValue[1] + ""];
}

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

import React, { useEffect, useState, SyntheticEvent } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Mark } from "@mui/base/useSlider";

import { getLabelsFromArray } from "@/util/label";

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
  variableColorBarMinMax: [number, number];
  variableColorBarName: string;
  variableOpacity: number;
  updateVariableColorBar: (
    colorBarMinMax: [number, number],
    colorBarName: string,
    opacity: number,
  ) => void;
}

export default function ColorBarRangeEditor({
  variableTitle,
  variableColorBarMinMax,
  variableColorBarName,
  variableOpacity,
  updateVariableColorBar,
}: ColorBarRangeEditorProps) {
  const classes = useStyles();

  const [currentColorBarMinMax, setCurrentColorBarMinMax] = useState<
    [number, number]
  >(variableColorBarMinMax);
  const [originalColorBarMinMax, setOriginalColorBarMinMax] = useState<
    [number, number]
  >(variableColorBarMinMax);
  const [enteredColorBarMinMax, setEnteredColorBarMinMax] = useState<
    [string, string]
  >(minMaxToText(variableColorBarMinMax));
  const [enteredColorBarMinMaxError, setEnteredColorBarMinMaxError] = useState<
    [boolean, boolean]
  >([false, false]);

  useEffect(() => {
    setEnteredColorBarMinMax(minMaxToText(variableColorBarMinMax));
  }, [variableColorBarMinMax]);

  const handleColorBarMinMaxChange = (
    _event: Event,
    value: number | number[],
  ) => {
    if (Array.isArray(value)) {
      setCurrentColorBarMinMax([value[0], value[1]]);
    }
  };

  const handleColorBarMinMaxChangeCommitted = (
    _event: Event | SyntheticEvent,
    value: number | number[],
  ) => {
    if (Array.isArray(value)) {
      updateVariableColorBar(
        [value[0], value[1]],
        variableColorBarName,
        variableOpacity,
      );
    }
  };

  const handleEnteredColorBarMinChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const enteredValue = event.target.value;
    setEnteredColorBarMinMax([enteredValue, enteredColorBarMinMax[1]]);
    const minValue = Number.parseFloat(enteredValue);
    let error = false;
    if (!Number.isNaN(minValue) && minValue < currentColorBarMinMax[1]) {
      if (minValue !== currentColorBarMinMax[0]) {
        const newMinMax: [number, number] = [
          minValue,
          currentColorBarMinMax[1],
        ];
        setCurrentColorBarMinMax(newMinMax);
        setOriginalColorBarMinMax(newMinMax);
        updateVariableColorBar(
          newMinMax,
          variableColorBarName,
          variableOpacity,
        );
      }
    } else {
      error = true;
    }
    setEnteredColorBarMinMaxError([error, enteredColorBarMinMaxError[1]]);
  };

  const handleEnteredColorBarMaxChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const enteredValue = event.target.value;
    setEnteredColorBarMinMax([enteredColorBarMinMax[0], enteredValue]);
    const maxValue = Number.parseFloat(enteredValue);
    let error = false;
    if (!Number.isNaN(maxValue) && maxValue > currentColorBarMinMax[0]) {
      if (maxValue !== currentColorBarMinMax[1]) {
        const newMinMax: [number, number] = [
          currentColorBarMinMax[0],
          maxValue,
        ];
        setCurrentColorBarMinMax(newMinMax);
        setOriginalColorBarMinMax(newMinMax);
        updateVariableColorBar(
          newMinMax,
          variableColorBarName,
          variableOpacity,
        );
      }
    } else {
      error = true;
    }
    setEnteredColorBarMinMaxError([enteredColorBarMinMaxError[0], error]);
  };

  const [original1, original2] = originalColorBarMinMax;
  const dist = original1 < original2 ? original2 - original1 : 1;
  const distExp = Math.floor(Math.log10(dist));
  const distNorm = dist * Math.pow(10, -distExp);

  let numStepsInner = null;
  for (const delta of [0.25, 0.2, 0.15, 0.125, 0.1]) {
    const numStepsFloat = distNorm / delta;
    const numStepsInt = Math.floor(numStepsFloat);
    if (Math.abs(numStepsInt - numStepsFloat) < 1e-10) {
      numStepsInner = numStepsInt;
      break;
    }
  }

  let numStepsOuter;
  if (numStepsInner !== null && numStepsInner >= 2) {
    numStepsOuter = Math.max(2, Math.round(numStepsInner / 2));
  } else {
    numStepsOuter = 4;
    numStepsInner = 8;
  }

  const delta = original1 < original2 ? dist / numStepsInner : 0.5;
  const numSteps = numStepsInner + 2 * numStepsOuter;
  const total1 = original1 - numStepsOuter * delta;
  const total2 = original2 + numStepsOuter * delta;
  const step = (total2 - total1) / numSteps;

  const values = [total1, original1, original2, total2];

  const marks: Mark[] = getLabelsFromArray(values).map((label, i) => {
    return { value: values[i], label };
  });

  return (
    <div className={classes.colorBarMinMaxEditor}>
      <span style={{ paddingLeft: 14 }}>{variableTitle}</span>
      <Box className={classes.sliderBox}>
        <Slider
          min={total1}
          max={total2}
          value={currentColorBarMinMax}
          marks={marks}
          step={step}
          onChange={handleColorBarMinMaxChange}
          onChangeCommitted={handleColorBarMinMaxChangeCommitted}
          valueLabelDisplay="auto"
          size="small"
        />
      </Box>
      <Box component="form" className={classes.minMaxBox}>
        <TextField
          className={classes.minTextField}
          label="Minimum"
          variant="filled"
          size="small"
          value={enteredColorBarMinMax[0]}
          error={enteredColorBarMinMaxError[0]}
          onChange={(evt) => handleEnteredColorBarMinChange(evt)}
        />
        <TextField
          className={classes.maxTextField}
          label="Maximum"
          variant="filled"
          size="small"
          value={enteredColorBarMinMax[1]}
          error={enteredColorBarMinMaxError[1]}
          onChange={(evt) => handleEnteredColorBarMaxChange(evt)}
        />
      </Box>
    </div>
  );
}

function minMaxToText(minMaxValue: [number, number]): [string, string] {
  return [minMaxValue[0] + "", minMaxValue[1] + ""];
}

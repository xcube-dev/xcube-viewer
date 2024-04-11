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

import * as React from "react";
import { SyntheticEvent } from "react";
import makeStyles from "@mui/styles/makeStyles";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Popover from "@mui/material/Popover";
import Slider from "@mui/material/Slider";
import { Mark } from "@mui/base/useSlider";
import Tooltip from "@mui/material/Tooltip";

import i18n from "../i18n";
import { ColorBar, ColorBars, formatColorBar } from "../model/colorBar";
import { getLabelsFromArray, getLabelsFromRange } from "../util/label";
import { ColorBarCanvas } from "./ColorBarCanvas";
import { Theme } from "@mui/material";

const HOR_SLIDER_MARGIN = 5;
const COLOR_BAR_BOX_MARGIN = 1;
const COLOR_BAR_ITEM_BOX_MARGIN = 0.2;

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontSize: "x-small",
    fontWeight: "bold",
    width: "100%",
    display: "flex",
    flexWrap: "nowrap",
    justifyContent: "center",
    paddingBottom: theme.spacing(0.5),
  },
  label: {
    fontSize: "x-small",
    fontWeight: "bold",
    width: "100%",
    display: "flex",
    flexWrap: "nowrap",
    justifyContent: "space-between",
  },
  container: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    paddingBottom: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
    color: "black",
  },
  sliderBox: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(HOR_SLIDER_MARGIN),
    marginRight: theme.spacing(HOR_SLIDER_MARGIN),
    minWidth: 320,
    width: `calc(100% - ${theme.spacing(2 * (HOR_SLIDER_MARGIN + 1))}px)`,
  },
  colorBarBox: {
    marginTop: theme.spacing(
      COLOR_BAR_BOX_MARGIN - 2 * COLOR_BAR_ITEM_BOX_MARGIN,
    ),
    marginLeft: theme.spacing(COLOR_BAR_BOX_MARGIN),
    marginRight: theme.spacing(COLOR_BAR_BOX_MARGIN),
    marginBottom: theme.spacing(COLOR_BAR_BOX_MARGIN),
  },
  colorBarGroupTitle: {
    marginTop: theme.spacing(2 * COLOR_BAR_ITEM_BOX_MARGIN),
    color: theme.palette.grey[400],
  },
  colorBarGroupItemBox: {
    marginTop: theme.spacing(COLOR_BAR_ITEM_BOX_MARGIN),
  },
  colorBarMinMaxEditor: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
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

interface ColorBarLegendProps {
  variableName: string | null;
  variableUnits: string;
  variableColorBarMinMax: [number, number];
  variableColorBarName: string;
  variableColorBar: ColorBar;
  variableOpacity: number;
  updateVariableColorBar: (
    colorBarMinMax: [number, number],
    colorBarName: string,
    opacity: number,
  ) => void;
  colorBars: ColorBars | null;
  width?: number | string;
  height?: number | string;
  numTicks?: number;
}

export default function ColorBarLegend({
  variableName,
  variableUnits,
  variableColorBarMinMax,
  variableColorBarName,
  variableColorBar,
  variableOpacity,
  updateVariableColorBar,
  colorBars,
  width,
  height,
  numTicks,
}: ColorBarLegendProps) {
  const classes = useStyles();
  const [colorBarMinMaxAnchorEl, setColorBarMinMaxAnchorEl] =
    React.useState<HTMLDivElement | null>(null);
  const [colorBarNameAnchorEl, setColorBarNameAnchorEl] =
    React.useState<HTMLCanvasElement | null>(null);
  const [currentColorBarMinMax, setCurrentColorBarMinMax] = React.useState<
    [number, number]
  >(variableColorBarMinMax);
  const [originalColorBarMinMax, setOriginalColorBarMinMax] = React.useState<
    [number, number]
  >(variableColorBarMinMax);
  const [enteredColorBarMinMax, setEnteredColorBarMinMax] = React.useState<
    [string, string]
  >(minMaxToText(variableColorBarMinMax));
  const [enteredColorBarMinMaxError, setEnteredColorBarMinMaxError] =
    React.useState<[boolean, boolean]>([false, false]);

  React.useEffect(() => {
    setEnteredColorBarMinMax(minMaxToText(variableColorBarMinMax));
  }, [variableColorBarMinMax]);

  const colorBarMinMaxEditorOpen = Boolean(colorBarMinMaxAnchorEl);
  const colorBarNameEditorOpen = Boolean(colorBarNameAnchorEl);

  if (!variableName || !colorBars) {
    return null;
  }

  const handleOpenColorBarMinMaxEditor = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    setColorBarMinMaxAnchorEl(event.currentTarget);
    setCurrentColorBarMinMax(variableColorBarMinMax);
    setOriginalColorBarMinMax(variableColorBarMinMax);
  };

  const handleCloseColorBarMinMaxEditor = () => {
    setColorBarMinMaxAnchorEl(null);
  };

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

  const handleOpenColorBarNameEditor = (
    event: React.MouseEvent<HTMLCanvasElement>,
  ) => {
    setColorBarNameAnchorEl(event.currentTarget);
  };

  const handleCloseColorBarNameEditor = () => {
    setColorBarNameAnchorEl(null);
  };

  const handleColorBarNameChange = (baseName: string) => {
    variableColorBarName = formatColorBar({ ...variableColorBar, baseName });
    updateVariableColorBar(
      variableColorBarMinMax,
      variableColorBarName,
      variableOpacity,
    );
  };

  const handleColorBarAlpha = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isAlpha = event.currentTarget.checked;
    variableColorBarName = formatColorBar({ ...variableColorBar, isAlpha });
    updateVariableColorBar(
      variableColorBarMinMax,
      variableColorBarName,
      variableOpacity,
    );
  };

  const handleColorBarReversed = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const isReversed = event.currentTarget.checked;
    variableColorBarName = formatColorBar({ ...variableColorBar, isReversed });
    updateVariableColorBar(
      variableColorBarMinMax,
      variableColorBarName,
      variableOpacity,
    );
  };

  const handleVariableOpacity = (_event: Event, value: number | number[]) => {
    updateVariableColorBar(
      variableColorBarMinMax,
      variableColorBarName,
      value as number,
    );
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

  const title = `${variableName} (${variableUnits || "-"})`;

  let colorBarMinMaxEditor;
  if (colorBarMinMaxEditorOpen) {
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

    colorBarMinMaxEditor = (
      <div className={classes.colorBarMinMaxEditor}>
        <span style={{ paddingLeft: 14 }}>{title}</span>
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

  let colorBarNameEditor;
  if (colorBarNameEditorOpen) {
    let key = 0;
    const entries = [];
    for (const cbg of colorBars.groups) {
      if (!cbg.names || cbg.names.length === 0) {
        continue;
      }
      entries.push(
        <Tooltip arrow key={key++} title={cbg.description} placement="left">
          <Box className={classes.colorBarGroupTitle}>{cbg.title}</Box>
        </Tooltip>,
      );
      for (const name of cbg.names) {
        entries.push(
          <Box
            key={key++}
            className={classes.colorBarGroupItemBox}
            border={1}
            borderColor={
              name === variableColorBar.baseName ? "orange" : "black"
            }
            width={240}
            height={20}
          >
            <Tooltip arrow title={name} placement="left">
              <img
                src={`data:image/png;base64,${colorBars.images[name]}`}
                alt={"Color Bar"}
                width={"100%"}
                height={"100%"}
                onClick={() => {
                  handleColorBarNameChange(name);
                }}
              />
            </Tooltip>
          </Box>,
        );
      }
    }
    colorBarNameEditor = (
      <Box className={classes.colorBarBox}>
        <Box component="span">
          <Checkbox
            color="primary"
            checked={variableColorBar.isAlpha}
            onChange={handleColorBarAlpha}
            size="small"
            style={{
              paddingLeft: 0,
              paddingRight: 2,
              paddingTop: 4,
              paddingBottom: 4,
            }}
          />
          <Box component="span">{i18n.get("Hide small values")}</Box>
          <Checkbox
            color="primary"
            checked={variableColorBar.isReversed}
            onChange={handleColorBarReversed}
            size="small"
            style={{
              paddingLeft: 10,
              paddingRight: 2,
              paddingTop: 4,
              paddingBottom: 4,
            }}
          />
          <Box component="span">{i18n.get("Reverse")}</Box>
        </Box>
        <Box component="div" style={{ display: "flex", alignItems: "center" }}>
          <span>{i18n.get("Opacity")}</span>
          <Slider
            min={0}
            max={1}
            value={variableOpacity}
            step={0.01}
            style={{ flexGrow: 1, marginLeft: 10, marginRight: 10 }}
            onChange={handleVariableOpacity}
            size="small"
          />
        </Box>
        {entries}
      </Box>
    );
  }

  return (
    <div className={"ol-control " + classes.container}>
      <div className={classes.title}>
        <span>{title}</span>
      </div>
      <ColorBarCanvas
        colorBar={variableColorBar}
        opacity={variableOpacity}
        width={width}
        height={height}
        onOpenEditor={handleOpenColorBarNameEditor}
      />
      <div className={classes.label} onClick={handleOpenColorBarMinMaxEditor}>
        <Labels
          minValue={variableColorBarMinMax[0]}
          maxValue={variableColorBarMinMax[1]}
          count={numTicks || 5}
        />
      </div>
      <Popover
        anchorEl={colorBarMinMaxAnchorEl}
        open={colorBarMinMaxEditorOpen}
        onClose={handleCloseColorBarMinMaxEditor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {colorBarMinMaxEditor}
      </Popover>
      <Popover
        anchorEl={colorBarNameAnchorEl}
        open={colorBarNameEditorOpen}
        onClose={handleCloseColorBarNameEditor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {colorBarNameEditor}
      </Popover>
    </div>
  );
}

interface LabelsProps {
  minValue: number;
  maxValue: number;
  count: number;
}

function Labels({ minValue, maxValue, count }: LabelsProps) {
  return (
    <React.Fragment>
      {getLabelsFromRange(minValue, maxValue, count).map((label, i) => (
        <span key={i}>{label}</span>
      ))}
    </React.Fragment>
  );
}

function minMaxToText(minMaxValue: [number, number]): [string, string] {
  return [minMaxValue[0] + "", minMaxValue[1] + ""];
}

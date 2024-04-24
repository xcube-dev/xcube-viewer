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
import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Slider from "@mui/material/Slider";
import Tooltip from "@mui/material/Tooltip";

import i18n from "@/i18n";
import { ColorBar, ColorBars, formatColorBar } from "@/model/colorBar";

const COLOR_BAR_BOX_MARGIN = 1;
const COLOR_BAR_ITEM_BOX_MARGIN = 0.2;

const useStyles = makeStyles((theme: Theme) => ({
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
}));

interface ColorBarSelectProps {
  variableColorBarMinMax: [number, number];
  variableColorBarName: string;
  variableColorBar: ColorBar;
  variableOpacity: number;
  updateVariableColorBar: (
    colorBarMinMax: [number, number],
    colorBarName: string,
    opacity: number,
  ) => void;
  colorBars: ColorBars;
}

export default function ColorBarSelect({
  variableColorBarMinMax,
  variableColorBarName,
  variableColorBar,
  variableOpacity,
  updateVariableColorBar,
  colorBars,
}: ColorBarSelectProps) {
  const classes = useStyles();

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
          borderColor={name === variableColorBar.baseName ? "orange" : "black"}
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
  return (
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

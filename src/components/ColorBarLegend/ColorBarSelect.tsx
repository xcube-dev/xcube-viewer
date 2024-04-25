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
import { Theme } from "@mui/material";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

import { ColorBar, ColorBars, formatColorBar } from "@/model/colorBar";

const COLOR_BAR_ITEM_BOX_MARGIN = 0.2;

const useStyles = makeStyles((theme: Theme) => ({
  colorBarGroupTitle: {
    marginTop: theme.spacing(2 * COLOR_BAR_ITEM_BOX_MARGIN),
    color: theme.palette.grey[400],
  },
  colorBarGroupItem: {
    marginTop: theme.spacing(COLOR_BAR_ITEM_BOX_MARGIN),
    width: 240,
    height: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.mode === "dark" ? "white" : "black",
  },
  colorBarGroupItemSelected: {
    marginTop: theme.spacing(COLOR_BAR_ITEM_BOX_MARGIN),
    width: 240,
    height: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "orange",
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
          className={
            name === variableColorBar.baseName
              ? classes.colorBarGroupItemSelected
              : classes.colorBarGroupItem
          }
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

  return <>{entries}</>;
}

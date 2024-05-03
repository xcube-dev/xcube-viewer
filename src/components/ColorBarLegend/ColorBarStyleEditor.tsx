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
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Slider from "@mui/material/Slider";

import i18n from "@/i18n";
import { ColorBar, formatColorBar } from "@/model/colorBar";

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
}

export default function ColorBarStyleEditor({
  variableColorBarMinMax,
  variableColorBarName,
  variableColorBar,
  variableOpacity,
  updateVariableColorBar,
}: ColorBarSelectProps) {
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

  return (
    <>
      <Box component="span">
        <Checkbox
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
      <Box component="div" sx={{ display: "flex", alignItems: "center" }}>
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
    </>
  );
}

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

import React, { useState } from "react";
import Popover from "@mui/material/Popover";

import ColorBarCanvas from "./ColorBarCanvas";
import ColorBarColorEditor from "./ColorBarColorEditor";
import ColorBarRangeEditor from "./ColorBarRangeEditor";
import ColorBarLabels from "./ColorBarLabels";
import { useColorBarLegendStyles, ColorBarLegendProps } from "./common";

export default function ColorBarLegendCategorical({
  variableName,
  variableUnits,
  variableColorBarMinMax,
  variableColorBarName,
  variableColorBar,
  variableOpacity,
  updateVariableColorBar,
  colorBars,
  userColorBars,
  addUserColorBar,
  removeUserColorBar,
  updateUserColorBar,
  updateUserColorBars,
  width,
  height,
  numTicks,
}: ColorBarLegendProps) {
  const classes = useColorBarLegendStyles();

  const [colorBarRangeEditorAnchor, setColorBarRangeEditorAnchor] =
    useState<HTMLDivElement | null>(null);
  const [colorBarSelectAnchor, setColorBarSelectAnchor] =
    useState<HTMLCanvasElement | null>(null);

  console.log("ColorBarLegendCategorical: ", variableColorBar);

  if (!variableName) {
    return null;
  }

  const handleOpenColorBarRangeEditor = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    setColorBarRangeEditorAnchor(event.currentTarget);
  };

  const handleCloseColorBarRangeEditor = () => {
    setColorBarRangeEditorAnchor(null);
  };

  const handleOpenColorBarSelect = (
    event: React.MouseEvent<HTMLCanvasElement>,
  ) => {
    setColorBarSelectAnchor(event.currentTarget);
  };

  const handleCloseColorBarSelect = () => {
    setColorBarSelectAnchor(null);
  };

  const variableTitle = `${variableName} (${variableUnits || "-"})`;

  return (
    <div className={"ol-control " + classes.container}>
      <div className={classes.title}>
        <span>{variableTitle}</span>
      </div>
      <ColorBarCanvas
        colorBar={variableColorBar}
        opacity={variableOpacity}
        width={width}
        height={height}
        onClick={handleOpenColorBarSelect}
      />
      <ColorBarLabels
        minValue={variableColorBarMinMax[0]}
        maxValue={variableColorBarMinMax[1]}
        numTicks={numTicks || 5}
        onClick={handleOpenColorBarRangeEditor}
      />
      <Popover
        anchorEl={colorBarRangeEditorAnchor}
        open={Boolean(colorBarRangeEditorAnchor)}
        onClose={handleCloseColorBarRangeEditor}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <ColorBarRangeEditor
          variableTitle={variableTitle}
          variableColorBarMinMax={variableColorBarMinMax}
          variableColorBarName={variableColorBarName}
          variableOpacity={variableOpacity}
          updateVariableColorBar={updateVariableColorBar}
        />
      </Popover>
      <Popover
        anchorEl={colorBarSelectAnchor}
        open={Boolean(colorBarSelectAnchor)}
        onClose={handleCloseColorBarSelect}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <ColorBarColorEditor
          variableColorBarMinMax={variableColorBarMinMax}
          variableColorBarName={variableColorBarName}
          variableColorBar={variableColorBar}
          variableOpacity={variableOpacity}
          updateVariableColorBar={updateVariableColorBar}
          colorBars={colorBars}
          userColorBars={userColorBars}
          addUserColorBar={addUserColorBar}
          removeUserColorBar={removeUserColorBar}
          updateUserColorBar={updateUserColorBar}
          updateUserColorBars={updateUserColorBars}
        />
      </Popover>
    </div>
  );
}

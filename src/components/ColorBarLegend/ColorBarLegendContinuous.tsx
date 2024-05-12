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

import { MouseEvent, useState } from "react";
import Popover from "@mui/material/Popover";

import ColorBarCanvas from "./ColorBarCanvas";
import ColorBarRangeEditor from "./ColorBarRangeEditor";
import ColorBarLabels from "./ColorBarLabels";
import { ColorBar } from "@/model/colorBar";
import { ColorBarNorm } from "@/model/variable";

export interface ColorBarLegendContinuousProps {
  variableTitle: string;
  variableColorBarName: string;
  variableColorBarMinMax: [number, number];
  variableColorBarNorm: ColorBarNorm;
  variableColorBar: ColorBar;
  variableOpacity: number;
  updateVariableColorBar: (
    colorBarName: string,
    colorBarMinMax: [number, number],
    colorBarNorm: ColorBarNorm,
    opacity: number,
  ) => void;
  onOpenColorBarEditor: () => void;
}

export default function ColorBarLegendContinuous({
  variableTitle,
  variableColorBarName,
  variableColorBarMinMax,
  variableColorBarNorm,
  variableColorBar,
  variableOpacity,
  updateVariableColorBar,
  onOpenColorBarEditor,
}: ColorBarLegendContinuousProps) {
  const [colorBarRangeEditorAnchorEl, setColorBarRangeEditorAnchorEl] =
    useState<HTMLDivElement | null>(null);

  const handleOpenColorBarRangeEditor = (event: MouseEvent<HTMLDivElement>) => {
    setColorBarRangeEditorAnchorEl(event.currentTarget);
  };

  const handleCloseColorBarRangeEditor = () => {
    setColorBarRangeEditorAnchorEl(null);
  };

  return (
    <>
      <ColorBarCanvas
        colorBar={variableColorBar}
        opacity={variableOpacity}
        onClick={onOpenColorBarEditor}
      />
      <ColorBarLabels
        minValue={variableColorBarMinMax[0]}
        maxValue={variableColorBarMinMax[1]}
        numTicks={5}
        onClick={handleOpenColorBarRangeEditor}
      />
      <Popover
        anchorEl={colorBarRangeEditorAnchorEl}
        open={Boolean(colorBarRangeEditorAnchorEl)}
        onClose={handleCloseColorBarRangeEditor}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <ColorBarRangeEditor
          variableTitle={variableTitle}
          variableColorBarName={variableColorBarName}
          variableColorBarMinMax={variableColorBarMinMax}
          variableColorBarNorm={variableColorBarNorm}
          variableOpacity={variableOpacity}
          updateVariableColorBar={updateVariableColorBar}
        />
      </Popover>
    </>
  );
}

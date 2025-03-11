/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { MouseEvent, useState } from "react";
import Popover from "@mui/material/Popover";

import { ColorBar } from "@/model/colorBar";
import { ColorBarNorm } from "@/model/variable";
import ColorBarCanvas from "./ColorBarCanvas";
import ColorBarLabels from "./ColorBarLabels";
import ColorBarRangeEditor from "./ColorBarRangeEditor";

export interface ColorBarLegendScalableProps {
  variableColorBar: ColorBar;
  variableColorBarName: string;
  variableColorBarMinMax: [number, number];
  variableColorBarNorm: ColorBarNorm; // will be "lin" or "log"
  variableOpacity: number;
  updateVariableColorBar: (
    colorBarName: string,
    colorBarMinMax: [number, number],
    colorBarNorm: ColorBarNorm,
    opacity: number,
  ) => void;
  onOpenColorBarEditor: () => void;
}

export default function ColorBarLegendScalable({
  variableColorBar,
  variableColorBarName,
  variableColorBarMinMax,
  variableColorBarNorm,
  variableOpacity,
  updateVariableColorBar,
  onOpenColorBarEditor,
}: ColorBarLegendScalableProps) {
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
        logScaled={variableColorBarNorm === "log"}
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
          variableColorBar={variableColorBar}
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

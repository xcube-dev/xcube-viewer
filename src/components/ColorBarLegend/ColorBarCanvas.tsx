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

import { useEffect, useRef, MouseEvent } from "react";

import i18n from "@/i18n";
import { ColorBar, renderColorBar } from "@/model/colorBar";
import Tooltip from "@mui/material/Tooltip";
import {
  COLOR_BAR_ITEM_HEIGHT,
  COLOR_BAR_ITEM_WIDTH,
} from "@/components/ColorBarLegend/constants";

interface ColorBarCanvasProps {
  colorBar: ColorBar;
  opacity: number;
  width: number | string | undefined;
  height: number | string | undefined;
  onClick: (event: MouseEvent<HTMLCanvasElement>) => void;
}

export default function ColorBarCanvas({
  colorBar,
  opacity,
  width,
  height,
  onClick,
}: ColorBarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas !== null) {
      renderColorBar(colorBar, opacity, canvas);
    }
  }, [colorBar, opacity]);

  const { baseName, imageData } = colorBar;
  const tooltipTitle = imageData
    ? baseName
    : i18n.get("Unknown color bar") + `: ${baseName}`;

  return (
    <Tooltip title={tooltipTitle}>
      <canvas
        ref={canvasRef}
        width={width || COLOR_BAR_ITEM_WIDTH}
        height={height || COLOR_BAR_ITEM_HEIGHT + 4}
        onClick={onClick}
        style={!imageData ? { border: "0.5px solid red" } : undefined}
      />
    </Tooltip>
  );
}

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
import { useEffect, useRef } from "react";

import i18n from "../i18n";
import { ColorBar, renderColorBar } from "../model/colorBar";

interface ColorBarCanvasProps {
  colorBar: ColorBar;
  opacity: number;
  width: number | string | undefined;
  height: number | string | undefined;
  onOpenEditor: (event: React.MouseEvent<HTMLCanvasElement>) => void;
}

export const ColorBarCanvas: React.FC<ColorBarCanvasProps> = ({
  colorBar,
  opacity,
  width,
  height,
  onOpenEditor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas !== null) {
      renderColorBar(colorBar, opacity, canvas);
    }
  }, [colorBar, opacity]);

  return (
    <>
      {colorBar.imageData ? (
        <canvas
          ref={canvasRef}
          width={width || 240}
          height={height || 24}
          onClick={onOpenEditor}
        />
      ) : (
        <div>{i18n.get("Unknown color bar") + `: ${colorBar.baseName}`}</div>
      )}
    </>
  );
};

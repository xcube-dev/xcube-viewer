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

import { useCallback, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { ColorRecord, renderUserColorBar } from "@/model/colorBar";

interface UserColorBarCanvasProps {
  colorRecords?: ColorRecord[];
  errorMessage?: string;
  width?: number | string;
  height?: number | string;
  onSelect?: () => void;
}

export default function UserColorBarCanvas({
  colorRecords,
  errorMessage,
  width,
  height,
  onSelect,
}: UserColorBarCanvasProps) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const div = divRef.current;
    if (canvas && div) {
      canvas.width = div.clientWidth;
      canvas.height = div.clientHeight;
      if (colorRecords) {
        renderUserColorBar(colorRecords, canvas);
      }
    }
  }, [colorRecords]);

  useEffect(() => {
    const div = divRef.current;
    if (div) {
      resizeCanvas();
      div.addEventListener("resize", resizeCanvas);
      return () => {
        div.removeEventListener("resize", resizeCanvas);
      };
    }
  }, [resizeCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas !== null && colorRecords) {
      renderUserColorBar(colorRecords, canvas);
    }
  }, [colorRecords]);

  width = width || "100%";
  height = height || 24;

  return (
    <Box ref={divRef} width={width} height={height}>
      {colorRecords && <canvas ref={canvasRef} onClick={onSelect} />}
      {errorMessage && (
        <Typography variant="subtitle2" color="red">
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
}

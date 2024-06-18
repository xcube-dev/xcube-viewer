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

import { toPng } from "html-to-image";
import { RefObject } from "react";

export async function _exportPNG(
  exportSize: number,
  elementRef: RefObject<HTMLDivElement | null>,
  showAlert: () => void,
): Promise<void> {
  if (elementRef.current) {
    const chartElement = elementRef.current;
    if (chartElement) {
      try {
        const dataUrl = await toPng(chartElement, {
          backgroundColor: "#ffffff",
          canvasWidth: exportSize,
          canvasHeight:
            (exportSize * chartElement.clientHeight) / chartElement.clientWidth,
        });
        const response = await fetch(dataUrl);
        const blob = await response.blob();

        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              "image/png": blob,
            }),
          ]);
          showAlert(); // Show success alert after successful clipboard write
        } catch (error) {
          console.error("Clipboard write failed:", error);
          // Inform user or handle the situation where clipboard write fails
          // Fallback to download if clipboard write fails
          //saveAs(blob, 'chart.png');
        }
      } catch (error) {
        console.error("Failed to export:", error);
      }
    }
  }
}

export function exportPNG(
  exportSize: number,
  elementRef: RefObject<HTMLDivElement | null>,
  showAlert: () => void,
): void {
  _exportPNG(exportSize, elementRef, showAlert).catch((error) => {
    console.error("Failed to export :", error);
  });
}

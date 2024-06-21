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

/**
 * Exports a HTML element as image.
 * It uses package `html-to-image` for that purpose.
 *
 * @param element The HTML element to export.
 * @param options Specifies image export options. 
 *     Default image format is PNG.
 * @returns The image copied into the clipboard.
 */
export function exportElement(
  element: HTMLElement,
  options?: ExportOptions,
): void {
  _exportElement(element, options).catch((error) => {
    console.error("Failed to export:", error);
    if (options?.handleError) {
      options.handleError("Failed to export", error);
    } else {
      throw error;
    }
  });
}

export async function _exportElement(
  element: HTMLElement,
  options: ExportOptions = {},
): Promise<void> {
  if (element) {
    const chartElement = element;
    try {
      if (options.format !== "png") {
        const errorMessage = `Format '${options.format}' is not supported.`;
        throw new Error(errorMessage);
      }
      const dataUrl = await toPng(chartElement, {
        backgroundColor: "#ffffff",
        canvasWidth: options.width || chartElement.clientWidth,
        canvasHeight:
          ((options.width || chartElement.clientWidth) *
            chartElement.clientHeight) /
            chartElement.clientWidth || options.height,
      });
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
        console.log("image written");
        if (options.handleSuccess) {
          options.handleSuccess("Image copied to clipboard.");
        }
      } catch (error) {
        console.error("Clipboard write failed", error);
        if (options.handleError) {
          options.handleError("Clipboard write failed", error);
        }
      }
    } catch (error) {
      console.error("Failed to export:", error);
      if (options.handleError) {
        options.handleError("Failed to export", error);
      }
    }
  }
}

export type ExportFormat = "png" | "jpeg" | "svg";

export interface ExportOptions {
  format?: ExportFormat;
  width?: number;
  height?: number;
  handleSuccess?: (message: string) => void;
  handleError?: (message: string, error: unknown) => void;
}

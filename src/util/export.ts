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

import { toJpeg, toPng } from "html-to-image";

const converters = {
  png: toPng,
  jpeg: toJpeg,
};

export type ExportFormat = keyof typeof converters;

export interface ExportOptions {
  format?: ExportFormat;
  width?: number;
  height?: number;
  handleSuccess?: () => void;
  handleError?: (error: unknown) => void;
  pixelratio?: number;
}

/**
 * Exports a HTML element as image.
 * It uses package `html-to-image` for that purpose.
 *
 * @param element The HTML element to export.
 * @param options Specifies image export options.
 *     Default image format is `"png"`.
 * @returns The image copied into the clipboard.
 */
export function exportElement(
  element: HTMLElement,
  options?: ExportOptions,
): void {
  _exportElement(element, options)
    .then(() => {
      if (options?.handleSuccess) {
        options.handleSuccess();
      }
    })
    .catch((error) => {
      if (options?.handleError) {
        options.handleError(error);
      } else {
        throw error;
      }
    });
}

async function _exportElement(
  element: HTMLElement,
  options: ExportOptions = {},
): Promise<void> {
  const chartElement = element;
  const format = options.format || "png";
  if (!(format in converters)) {
    throw new Error(`Image format '${format}' is unknown or not supported.`);
  }
  const dataUrl = await converters[format](chartElement, {
    backgroundColor: "#00000000",
    canvasWidth:
      options.width ||
      ((options.height || chartElement.clientHeight) *
        chartElement.clientWidth) /
        chartElement.clientHeight,
    canvasHeight:
      options.height ||
      ((options.width || chartElement.clientWidth) *
        chartElement.clientHeight) /
        chartElement.clientWidth,
    pixelRatio: options.pixelratio,
  });
  let image = new Image();
  image.crossOrigin = "anonymous";
  image.src = dataUrl;

  // Wait for the image to load before proceeding
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = (error) => reject(error);
  });
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  await navigator.clipboard.write([
    new ClipboardItem({
      "image/png": blob,
    }),
  ]);
}

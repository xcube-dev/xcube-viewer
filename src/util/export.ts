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
  handleSuccess?: () => void;
  handleError?: (error: unknown) => void;
  width?: number;
  height?: number;
  controlDiv?: HTMLElement | null;
  zoomDiv?: HTMLElement | null;
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
  try {
    const format = options.format || "png";
    if (!(format in converters)) {
      throw new Error(`Image format '${format}' is unknown or not supported.`);
    }
    const scaledWidth = options.width || element.clientWidth;
    const scaledHeight = options.height || element.clientHeight;
    const controlDiv = options.controlDiv;
    const zoomDiv = options.zoomDiv;
    if (controlDiv) controlDiv.style.display = "none";
    if (zoomDiv) zoomDiv.hidden = true;
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = scaledWidth;
    offScreenCanvas.height = scaledHeight;
    const context = offScreenCanvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to get canvas context.");
    }

    const dataUrl = await converters[format](element, {
      backgroundColor: "#ffffff",
      width: scaledWidth,
      height: scaledHeight,
    });
    const image = new Image();
    image.src = dataUrl;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = (error) => reject(error);
    });
    context.drawImage(image, 0, 0, scaledWidth, scaledHeight);
    const blob = await new Promise<Blob>((resolve, reject) => {
      offScreenCanvas.toBlob((blob) => {
        if (blob === null) {
          reject(new Error("Failed to create a blob from the canvas."));
        } else {
          resolve(blob);
        }
      }, `image/${format}`);
    });

    await navigator.clipboard.write([
      new ClipboardItem({
        [`image/${format}`]: blob,
      }),
    ]);

    if (controlDiv) controlDiv.style.display = "block";
    if (zoomDiv) zoomDiv.hidden = false;
  } catch (error) {
    console.error("Error during export:", error);
    throw error;
  }
}

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

    const originalWidth = element.clientWidth;
    const originalHeight = element.clientHeight;
    const originalTransform = element.style.transform;

    const controlDiv = options.controlDiv;
    const zoomDiv = options.zoomDiv;

    if (controlDiv) controlDiv.style.display = "none";
    if (zoomDiv) zoomDiv.hidden = true;

    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = options.width || element.clientWidth;
    offScreenCanvas.height = options.height || element.clientHeight;

    const context = offScreenCanvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to get canvas context.");
    }

    // Export the element to data URL
    const dataUrl = await converters[format](element, {
      backgroundColor: "#ffffff", // Solid white background for testing
      width: element.clientWidth,
      height: element.clientHeight,
    });

    console.log("Data URL received");

    // Create a new image to draw on the canvas
    const image = new Image();
    image.src = dataUrl;
    image.width = element.clientWidth;
    image.height = element.clientHeight;

    // Ensure the image is loaded before drawing
    await new Promise<void>((resolve, reject) => {
      image.onload = () => {
        console.log("Image loaded successfully");
        resolve();
      };
      image.onerror = (error) => {
        console.error("Error loading image:", error);
        reject(error);
      };
    });

    // Draw the image on the off-screen canvas
    context.drawImage(image, 0, 0, element.clientWidth, element.clientHeight);

    console.log("Image drawn on canvas");

    // Convert the canvas to a Blob for export
    const blob = await new Promise<Blob>((resolve, reject) => {
      offScreenCanvas.toBlob((blob) => {
        if (blob === null) {
          reject(new Error("Failed to create a blob from the canvas."));
        } else {
          resolve(blob);
        }
      }, `image/${format}`);
    });

    console.log("Blob created successfully");

    // Write the image to the clipboard
    await navigator.clipboard.write([
      new ClipboardItem({
        [`image/${format}`]: blob,
      }),
    ]);

    console.log("Image copied to clipboard");

    element.style.transform = originalTransform;
    element.style.width = `${originalWidth}px`;
    element.style.height = `${originalHeight}px`;
    if (controlDiv) controlDiv.style.display = "block";
    if (zoomDiv) zoomDiv.hidden = false;
  } catch (error) {
    console.error("Error during export:", error);
    throw error;
  }
}

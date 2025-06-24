/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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
  pixelRatio?: number;
  hiddenElements?: HTMLElement[]; // Array of elements to hide
}

/**
 * Exports a HTML element as an image.
 * It uses the `html-to-image` package for that purpose.
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
  const format = options.format || "png";
  if (!(format in converters)) {
    throw new Error(`Image format '${format}' is unknown or not supported.`);
  }

  const canvasWidth =
    options.width ||
    ((options.height || element.clientHeight) * element.clientWidth) /
      element.clientHeight;
  const canvasHeight =
    options.height ||
    ((options.width || element.clientWidth) * element.clientHeight) /
      element.clientWidth;

  const hiddenElements = options.hiddenElements || [];
  hiddenElements.forEach((el) => {
    el.style.visibility = "hidden";
  });

  const offScreenCanvas = document.createElement("canvas");
  offScreenCanvas.width = canvasWidth;
  offScreenCanvas.height = canvasHeight;
  const context = offScreenCanvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to get canvas context.");
  }

  const dataUrl = await converters[format](element, {
    backgroundColor: "#00000000",
    canvasWidth,
    canvasHeight,
    pixelRatio: options.pixelRatio,
  });

  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = dataUrl;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = (error) => reject(error);
  });

  context.drawImage(image, 0, 0);

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

  hiddenElements.forEach((el) => {
    el.style.visibility = "visible";
  });
}

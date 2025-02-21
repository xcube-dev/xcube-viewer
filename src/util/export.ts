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
  });
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  await navigator.clipboard.write([
    new ClipboardItem({
      "image/png": blob,
    }),
  ]);
}

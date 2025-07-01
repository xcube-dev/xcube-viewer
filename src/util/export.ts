/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { toJpeg, toPng, toCanvas } from "html-to-image";
import { ExportResolution } from "@/states/controlState";

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
  hiddenElements?: HTMLElement[] | ((root: HTMLElement) => HTMLElement[]);
  exportResolution: ExportResolution;
}

/**
 * Exports an HTML element as an image.
 * It uses the `html-to-image` package for that purpose.
 *
 * @param element The HTML element to export.
 * @param options Specifies image export options.
 *     Default image format is `"png"`.
 * @returns The image copied into the clipboard.
 */
export function exportElement(
  element: HTMLElement,
  options: ExportOptions,
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
  options: ExportOptions,
): Promise<void> {
  const format = "jpeg"; //options.format || "png";

  if (!(format in converters)) {
    throw new Error(`Image format '${format}' is unknown or not supported.`);
  }

  let hiddenElements = options.hiddenElements;
  if (typeof hiddenElements === "function") {
    hiddenElements = hiddenElements(element);
  } else if (!Array.isArray(hiddenElements)) {
    hiddenElements = [];
  }

  hiddenElements.forEach((el) => {
    el.style.visibility = "hidden";
  });

  const dpi = options.exportResolution;
  const referenceDPI = 96;
  const scaleFactor = dpi / referenceDPI;

  const width = element.clientWidth;
  const height = element.clientHeight;

  const canvas = await toCanvas(element, {
    width: width * scaleFactor,
    height: height * scaleFactor,
    style: {
      transform: `scale(${scaleFactor})`,
      transformOrigin: "top left",
      width: `${width}px`,
      height: `${height}px`,
    },
    pixelRatio: 1,
    canvasWidth: width * scaleFactor,
    canvasHeight: height * scaleFactor,
    backgroundColor: "#ffffff",
    skipFonts: true, // workaround for html-to-image bug
  });

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob === null) {
        reject(new Error("Failed to create a blob from the canvas."));
      } else {
        resolve(blob);
      }
    }, `image/${format}`);
  });

  await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);

  hiddenElements.forEach((el) => {
    el.style.visibility = "visible";
  });
}

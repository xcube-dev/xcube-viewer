/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { toCanvas } from "html-to-image";
import { ExportResolution } from "@/states/controlState";

export type ExportFormat = "png" | "jpeg";

export interface ExportOptions {
  format?: ExportFormat;
  width?: number;
  height?: number;
  handleSuccess?: () => void;
  handleError?: (error: unknown) => void;
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
  const format = options.format || "png";

  let hiddenElements = options.hiddenElements;
  if (typeof hiddenElements === "function") {
    hiddenElements = hiddenElements(element);
  } else if (!Array.isArray(hiddenElements)) {
    hiddenElements = [];
  }

  hiddenElements.forEach((el) => {
    el.style.opacity = "0";
  });

  const dpi = options.exportResolution;
  const referenceDPI = 96;
  const scaleFactor = dpi / referenceDPI;

  const width = options.width || element.clientWidth;
  const height = options.height || element.clientHeight;

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
    backgroundColor: "#00000000",
    // workaround for html-to-image bug
    // see https://github.com/bubkoo/html-to-image/issues/508
    skipFonts: true,
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
    el.style.opacity = "1";
  });
}

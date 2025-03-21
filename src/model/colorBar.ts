/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import bgImageData from "./bg.png";
import { RGBA } from "@/util/color";

const BG_IMAGE = new Image();
BG_IMAGE.src = bgImageData;

export interface ColorRecord {
  value: number;
  color: RGBA;
  label?: string;
}

export type CssColorRecord = Omit<ColorRecord, "color"> & { color: string };

export type ColorMapType = "continuous" | "stepwise" | "categorical";

export interface CustomColorMap {
  name: string;
  type: ColorMapType;
  colorRecords: CssColorRecord[];
}

export interface ColorBars {
  groups: ColorBarGroup[];
  // base64 encoded color bar image
  images: Record<string, string>;
  // Predefined, but custom color bars (new in xcube 1.7)
  customColorMaps: Record<string, CustomColorMap>;
}

export interface ColorBarGroup {
  title: string;
  description: string;
  names: string[];
}

export const CB_ALPHA_SUFFIX = "_alpha";
export const CB_REVERSE_SUFFIX = "_r";

/**
 * A color bar
 */
export interface ColorBar {
  /**
   * Color bar base name, such as "viridis".
   */
  baseName: string;
  /**
   * If current (variable) color bar name has an alpha gradient.
   * Color bar name is this case is e.g., "viridis_alpha"
   */
  isAlpha: boolean;
  /**
   * If current (variable) color bar name has an alpha gradient.
   * Color bar name is this case is e.g., "viridis_r"
   */
  isReversed: boolean;
  /**
   * base64-encoded image/png either from server or rendered by
   * renderUserColorBarAsBase64() from user color bar code.
   */
  imageData?: string;
  /**
   * Color map type. Defined, if this color bar is a
   * custom color bar
   */
  type?: ColorMapType;
  /**
   * Color records. Defined, if this color bar is a
   * custom color bar.
   */
  colorRecords?: CssColorRecord[];
}

export function parseColorBarName(name: string): ColorBar {
  let baseName = name;

  const isAlpha = baseName.endsWith(CB_ALPHA_SUFFIX);
  if (isAlpha) {
    baseName = baseName.slice(0, baseName.length - CB_ALPHA_SUFFIX.length);
  }

  const isReversed = baseName.endsWith(CB_REVERSE_SUFFIX);
  if (isReversed) {
    baseName = baseName.slice(0, baseName.length - CB_REVERSE_SUFFIX.length);
  }

  return { baseName, isAlpha, isReversed };
}

export function formatColorBarName(colorBar: ColorBar): string {
  let name = colorBar.baseName;
  if (colorBar.isReversed) {
    name += CB_REVERSE_SUFFIX;
  }
  if (colorBar.isAlpha) {
    name += CB_ALPHA_SUFFIX;
  }
  return name;
}

export function renderColorBar(
  colorBar: ColorBar,
  opacity: number,
  canvas: HTMLCanvasElement,
) {
  loadColorBarImageData(colorBar, opacity).then((imageData) => {
    // We must resolve in case ImageBitmap is already resolved
    Promise.resolve(createImageBitmap(imageData)).then((imageBitmap) => {
      const ctx = canvas.getContext("2d");
      if (ctx !== null) {
        const pattern = ctx.createPattern(BG_IMAGE, "repeat");
        if (pattern !== null) {
          ctx.fillStyle = pattern;
        } else {
          ctx.fillStyle = "#ffffff";
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
      }
    });
  });
}

export function loadColorBarImage(
  colorBar: ColorBar,
  image?: HTMLImageElement,
): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>(
    (
      resolve: (
        value: HTMLImageElement | PromiseLike<HTMLImageElement>,
      ) => void,
      reject: (reason?: unknown) => void,
    ) => {
      const im = image || new Image();
      const imageData = colorBar.imageData;
      if (!imageData) {
        resolve(im);
        return;
      }
      im.onload = () => {
        resolve(im);
      };
      im.onerror = (
        _event: Event | string,
        _source?: string,
        _lineno?: number,
        _colno?: number,
        error?: Error,
      ) => {
        reject(error);
      };
      im.src = `data:image/png;base64,${imageData}`;
    },
  );
}

export function loadColorBarImageData(
  colorBar: ColorBar,
  opacity: number,
): Promise<ImageData> {
  return loadColorBarImage(colorBar).then((image) => {
    const imageData = getColorBarImageData(colorBar, opacity, image);
    if (imageData !== null) {
      return imageData;
    } else {
      throw new Error("failed to retrieve 2d context");
    }
  });
}

function getColorBarImageData(
  colorBar: ColorBar,
  opacity: number,
  image: HTMLImageElement,
): ImageData | null {
  const offscreenCanvas = document.createElement("canvas");
  offscreenCanvas.width = image.width || 1;
  offscreenCanvas.height = image.height || 1;
  const ctx = offscreenCanvas.getContext("2d");
  if (ctx === null) {
    return null;
  }
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(
    0,
    0,
    offscreenCanvas.width,
    offscreenCanvas.height,
  );

  let rgbaArray = imageData.data;

  if (colorBar.isReversed) {
    const reversedRgbaArray = new Uint8ClampedArray(rgbaArray.length);
    for (let i = 0; i < rgbaArray.length; i += 4) {
      const j = rgbaArray.length - i - 4;
      reversedRgbaArray[j] = rgbaArray[i];
      reversedRgbaArray[j + 1] = rgbaArray[i + 1];
      reversedRgbaArray[j + 2] = rgbaArray[i + 2];
      reversedRgbaArray[j + 3] = rgbaArray[i + 3];
    }
    rgbaArray = reversedRgbaArray;
  }

  if (colorBar.isAlpha) {
    const factor = (256 * 2) / rgbaArray.length;
    for (let i = 0; i < rgbaArray.length / 2; i += 4) {
      rgbaArray[i + 3] = factor * i;
    }
  }

  if (opacity < 1.0) {
    for (let i = 0; i < rgbaArray.length; i += 4) {
      rgbaArray[i + 3] *= opacity;
    }
  }

  return new ImageData(rgbaArray, rgbaArray.length / 4, 1);
}

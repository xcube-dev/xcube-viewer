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

import bgImageData from "./bg.png";

export interface ColorBars {
  groups: ColorBarGroup[];
  images: { [name: string]: string };
}

export interface ColorBarGroup {
  title: string;
  description: string;
  names: string[];
}

export const CB_ALPHA_SUFFIX = "_alpha";
export const CB_REVERSE_SUFFIX = "_r";

const BG_IMAGE = new Image();
BG_IMAGE.src = bgImageData;

export interface ColorBar {
  baseName: string;
  isAlpha: boolean;
  isReversed: boolean;
  // https://stackoverflow.com/questions/13416800/how-to-generate-an-image-from-imagedata-in-javascript
  imageData: string | null;
}

export function parseColorBar(
  name: string,
  colorBars: ColorBars | null,
): ColorBar {
  let baseName = name;

  const isAlpha = baseName.endsWith(CB_ALPHA_SUFFIX);
  if (isAlpha) {
    baseName = baseName.slice(0, baseName.length - CB_ALPHA_SUFFIX.length);
  }

  const isReversed = baseName.endsWith(CB_REVERSE_SUFFIX);
  if (isReversed) {
    baseName = baseName.slice(0, baseName.length - CB_REVERSE_SUFFIX.length);
  }

  const imageData = (colorBars && colorBars.images[baseName]) || null;

  return { baseName, isAlpha, isReversed, imageData };
}

export function formatColorBar(colorBar: ColorBar): string {
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
      reject: (reason?: any) => void,
    ) => {
      const im = image || new Image();
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
      im.src = `data:image/png;base64,${colorBar.imageData}`;
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
  offscreenCanvas.width = image.width;
  offscreenCanvas.height = image.height;
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

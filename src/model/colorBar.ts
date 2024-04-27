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
import { parseColor, RGB } from "@/util/color";

export const USER_COLOR_BAR_GROUP_TITLE = "User";

export interface ColorBars {
  groups: ColorBarGroup[];
  images: Record<string, string>;
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

export interface UserColorBar {
  id: string;
  /**
   * Format of the code value:
   *
   * code   := record {"\n" record}
   * record := value ":" color
   * color  := color-name | hex-color | red "," green "," blue
   */
  code: string;
  /**
   * Rendered by renderUserColorBarAsBase64() from code
   */
  imageData?: string;
  /**
   * If imageData is undefined, errorMessage should say why.
   */
  errorMessage?: string;
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
      reject: (reason?: unknown) => void,
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

export const USER_COLOR_BAR_CODE_EXAMPLE =
  "0.0: #23FF52\n" + // tie point 1
  "0.5: red\n" + // tie point 2
  "1.0: 120,30,255"; // tie point 3

export type ColorRecord = [number, RGB];

export function getUserColorBarRgbaArray(records: ColorRecord[], size: number) {
  const n = records.length;
  const min = records[0][0];
  const max = records[n - 1][0];
  const values = records.map((record) => (record[0] - min) / (max - min));
  const rgbaArray = new Uint8ClampedArray(4 * size);
  let recordIndex = 0;
  let v1 = values[0];
  let v2 = values[1];
  for (let i = 0, j = 0; i < size; i++, j += 4) {
    const v = i / (size - 1);
    if (v > v2) {
      recordIndex++;
      v1 = values[recordIndex];
      v2 = values[recordIndex + 1];
    }
    const w = (v - v1) / (v2 - v1);
    const [r1, g1, b1] = records[recordIndex][1];
    const [r2, g2, b2] = records[recordIndex + 1][1];
    rgbaArray[j] = r1 + w * (r2 - r1);
    rgbaArray[j + 1] = g1 + w * (g2 - g1);
    rgbaArray[j + 2] = b1 + w * (b2 - b1);
    rgbaArray[j + 3] = 255;
  }
  return rgbaArray;
}

export function renderUserColorBar(
  records: ColorRecord[],
  canvas: HTMLCanvasElement,
): Promise<void> {
  const data = getUserColorBarRgbaArray(records, canvas.width);
  const imageData = new ImageData(data, data.length / 4, 1);
  return createImageBitmap(imageData).then((bitMap) => {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(bitMap, 0, 0, canvas.width, canvas.height);
    }
  });
}

export function renderUserColorBarAsBase64(
  colorBar: UserColorBar,
): Promise<{ imageData?: string; errorMessage?: string }> {
  const { colorRecords, errorMessage } = getUserColorBarCode(colorBar.code);
  if (!colorRecords) {
    return Promise.resolve({ errorMessage });
  }
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 1;
  return renderUserColorBar(colorRecords, canvas).then(() => {
    const dataURL = canvas.toDataURL("image/png");
    return { imageData: dataURL.split(",")[1] };
  });
}

export function getUserColorBarCode(code: string) {
  try {
    const colorRecords = parseUserColorBarCode(code);
    return { colorRecords };
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      return { errorMessage: `${error.message}` };
    }
    throw error;
  }
}

/**
 * Parses the given color records in text form and returns
 * an array of color records.
 *
 * @param code The color records as text
 * @returns The parse color records
 * @throws SyntaxError
 */
export function parseUserColorBarCode(code: string): ColorRecord[] {
  const points: ColorRecord[] = [];
  code
    .split("\n")
    .map((line) =>
      line
        .trim()
        .split(":")
        .map((comp) => comp.trim()),
    )
    .forEach((recordParts, index) => {
      if (recordParts.length == 2) {
        const [valueText, rgbText] = recordParts;
        const value = parseFloat(valueText);
        const rgb = parseColor(rgbText);
        if (!Number.isFinite(value)) {
          throw new SyntaxError(
            `Line ${index + 1}: invalid value: ${valueText}`,
          );
        }
        if (!rgb) {
          throw new SyntaxError(`Line ${index + 1}: invalid color: ${rgbText}`);
        }
        points.push([value, rgb]);
      } else if (recordParts.length === 1) {
        if (recordParts[0] !== "") {
          throw new SyntaxError(
            `Line ${index + 1}: invalid color record: ${recordParts[0]}`,
          );
        }
      }
    });
  const n = points.length;
  if (n < 2) {
    throw new SyntaxError(`At least two color records must be given`);
  }
  points.sort((r1: ColorRecord, r2: ColorRecord) => r1[0] - r2[0]);
  const v1 = points[0][0];
  const v2 = points[n - 1][0];
  if (v1 === v2) {
    throw new SyntaxError(`Values must form a range`);
  }
  return points;
}

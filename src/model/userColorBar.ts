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

import { parseColor, rgbToHex } from "@/util/color";
import { ColorRecord, HexColorRecord } from "@/model/colorBar";

export const USER_COLOR_BAR_GROUP_TITLE = "User";
export const USER_COLOR_BAR_CODE_EXAMPLE =
  "0.0: #23FF52\n" + // tie point 1
  "0.5: red\n" + // tie point 2
  "1.0: 120,30,255"; // tie point 3

export type ColorMapType = "index" | "bound" | "node";

export interface UserColorBar {
  /**
   * Unique ID.
   */
  id: string;
  /**
   * Format of the `code` value:
   *
   * code   := record {"\n" record}
   * record := value ":" (rgb | rgba) [":" label]
   * rgb    := name | (r "," g "," b) | "#"hex3 | "#"hex6
   * rgba   := rgb ["," a] | "#"hex8
   *
   * r, g, b in range 0 to 255, a in range 0 to 1
   */
  code: string;
  /**
   * Type of color mapping, discrete (= index or bounds) or continuous (=node).
   */
  type: ColorMapType;
  /**
   * base64-encoded `image/png`
   * rendered by renderUserColorBarAsBase64() from `code`.
   */
  imageData?: string;
  /**
   * If `imageData` is undefined, errorMessage should say why.
   */
  errorMessage?: string;
}

export function getUserColorBarRgbaArray(
  records: ColorRecord[],
  type: ColorMapType,
  size: number,
): Uint8ClampedArray {
  const rgbaArray = new Uint8ClampedArray(4 * size);
  const n = records.length;
  if (type === "index" || type === "bound") {
    const m = type === "index" ? n : n - 1;
    for (let i = 0, j = 0; i < size; i++, j += 4) {
      const recordIndex = Math.floor((m * i) / size);
      const [r, g, b, a] = records[recordIndex].color;
      rgbaArray[j] = r;
      rgbaArray[j + 1] = g;
      rgbaArray[j + 2] = b;
      rgbaArray[j + 3] = a;
    }
  } else {
    const min = records[0].value;
    const max = records[n - 1].value;
    const values = records.map((record) => (record.value - min) / (max - min));
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
      const [r1, g1, b1, a1] = records[recordIndex].color;
      const [r2, g2, b2, a2] = records[recordIndex + 1].color;
      rgbaArray[j] = r1 + w * (r2 - r1);
      rgbaArray[j + 1] = g1 + w * (g2 - g1);
      rgbaArray[j + 2] = b1 + w * (b2 - b1);
      rgbaArray[j + 3] = a1 + w * (a2 - a1);
    }
  }
  return rgbaArray;
}

export function renderUserColorBar(
  records: ColorRecord[],
  type: ColorMapType,
  canvas: HTMLCanvasElement,
): Promise<void> {
  const data = getUserColorBarRgbaArray(records, type, canvas.width);
  const imageData = new ImageData(data, data.length / 4, 1);
  return createImageBitmap(imageData).then((bitMap) => {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(bitMap, 0, 0, canvas.width, canvas.height);
    }
  });
}

export function renderUserColorBarAsBase64(
  userColorBar: UserColorBar,
): Promise<{ imageData?: string; errorMessage?: string }> {
  const { colorRecords, errorMessage } = getUserColorBarColorRecords(
    userColorBar.code,
  );
  if (!colorRecords) {
    return Promise.resolve({ errorMessage });
  }
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 1;
  return renderUserColorBar(colorRecords, userColorBar.type, canvas).then(
    () => {
      const dataURL = canvas.toDataURL("image/png");
      return { imageData: dataURL.split(",")[1] };
    },
  );
}

export function getUserColorBarHexRecords(
  code: string,
): HexColorRecord[] | undefined {
  const { colorRecords } = getUserColorBarColorRecords(code);
  if (colorRecords) {
    return colorRecords.map((r) => ({ ...r, color: rgbToHex(r.color) }));
  }
}

export function getUserColorBarColorRecords(code: string) {
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
      if (recordParts.length == 2 || recordParts.length == 3) {
        const [valueText, rgbText] = recordParts;
        const value = parseFloat(valueText);
        const color = parseColor(rgbText);
        if (!Number.isFinite(value)) {
          throw new SyntaxError(
            `Line ${index + 1}: invalid value: ${valueText}`,
          );
        }
        if (!color) {
          throw new SyntaxError(`Line ${index + 1}: invalid color: ${rgbText}`);
        }
        if (recordParts.length == 3) {
          points.push({ value, color, label: recordParts[2] });
        } else {
          points.push({ value, color });
        }
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
  points.sort((r1: ColorRecord, r2: ColorRecord) => r1.value - r2.value);
  const v1 = points[0].value;
  const v2 = points[n - 1].value;
  if (v1 === v2) {
    throw new SyntaxError(`Values must form a range`);
  }
  return points;
}

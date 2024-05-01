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

import { DotProps } from "recharts";
import { isNumber } from "@/util/types";

interface CustomDotProps extends DotProps {
  radius: number;
  stroke: string;
  strokeWidth: number;
  fill: string;
  symbol: "diamond" | "circle";
}

export default function CustomDot({
  cx,
  cy,
  radius,
  stroke,
  fill,
  strokeWidth,
  symbol,
}: CustomDotProps) {
  const vpSize = 1024;
  const totalRadius = radius + 0.5 * strokeWidth;
  const totalDiameter = 2 * totalRadius;

  const sw = Math.floor((100 * strokeWidth) / totalDiameter + 0.5) + "%";

  let shape;
  if (symbol === "diamond") {
    const c = vpSize / 2;
    const cx = c,
      cy = c;
    const r = vpSize * (radius / totalDiameter);
    shape = (
      <polygon
        points={`${cx - r},${cy} ${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r}`}
        strokeWidth={sw}
        stroke={stroke}
        fill={fill}
      />
    );
  } else {
    const r = Math.floor((100 * radius) / totalDiameter + 0.5) + "%";
    shape = (
      <circle
        cx="50%"
        cy="50%"
        r={r}
        strokeWidth={sw}
        stroke={stroke}
        fill={fill}
      />
    );
  }

  // noinspection SuspiciousTypeOfGuard
  if (isNumber(cx) && isNumber(cy)) {
    return (
      <svg
        x={cx - totalRadius}
        y={cy - totalRadius}
        width={totalDiameter}
        height={totalDiameter}
        viewBox={`0 0 ${vpSize} ${vpSize}`}
      >
        {shape}
      </svg>
    );
  }

  return null;
}

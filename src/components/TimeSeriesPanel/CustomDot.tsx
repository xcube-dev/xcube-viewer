/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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

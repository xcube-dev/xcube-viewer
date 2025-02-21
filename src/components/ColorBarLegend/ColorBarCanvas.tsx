/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useEffect, useRef, MouseEvent, CSSProperties } from "react";

import i18n from "@/i18n";
import { ColorBar, renderColorBar } from "@/model/colorBar";
import Tooltip from "@mui/material/Tooltip";
import {
  COLOR_BAR_ITEM_HEIGHT,
  COLOR_BAR_ITEM_WIDTH,
} from "@/components/ColorBarLegend/constants";

const styles: Record<string, CSSProperties> = {
  nominal: { cursor: "pointer" },
  error: { cursor: "pointer", border: "0.5px solid red" },
};

interface ColorBarCanvasProps {
  colorBar: ColorBar;
  opacity: number;
  width?: number | string | undefined;
  height?: number | string | undefined;
  onClick: (event: MouseEvent<HTMLCanvasElement>) => void;
}

export default function ColorBarCanvas({
  colorBar,
  opacity,
  width,
  height,
  onClick,
}: ColorBarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas !== null) {
      renderColorBar(colorBar, opacity, canvas);
    }
  }, [colorBar, opacity]);

  const { baseName, imageData } = colorBar;
  const tooltipTitle = imageData
    ? baseName
    : i18n.get("Unknown color bar") + `: ${baseName}`;

  return (
    <Tooltip title={tooltipTitle}>
      <canvas
        ref={canvasRef}
        width={width || COLOR_BAR_ITEM_WIDTH}
        height={height || COLOR_BAR_ITEM_HEIGHT + 4}
        onClick={onClick}
        style={!imageData ? styles.error : styles.nominal}
      />
    </Tooltip>
  );
}

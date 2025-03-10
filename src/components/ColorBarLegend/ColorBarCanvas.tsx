/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useEffect, useRef, MouseEvent } from "react";
import { styled, Theme } from "@mui/system";
import Tooltip from "@mui/material/Tooltip";

import i18n from "@/i18n";
import { makeCssStyles } from "@/util/styles";
import { ColorBar, renderColorBar } from "@/model/colorBar";
import { COLOR_BAR_ITEM_HEIGHT, COLOR_BAR_ITEM_WIDTH } from "./constants";
import { getBorderStyle } from "./style";

const StyledCanvas = styled("canvas")(({ theme }: { theme: Theme }) => ({
  border: getBorderStyle(theme),
  cursor: "pointer",
}));

const styles = makeCssStyles({
  nominal: {},
  error: { border: "1px solid red" },
});

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
      <StyledCanvas
        ref={canvasRef}
        width={width || COLOR_BAR_ITEM_WIDTH - 4}
        height={height || COLOR_BAR_ITEM_HEIGHT + 4}
        onClick={onClick}
        style={!imageData ? styles.error : styles.nominal}
      />
    </Tooltip>
  );
}

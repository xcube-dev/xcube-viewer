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

import IconButton from "@mui/material/IconButton";
import { CSSProperties, MouseEvent, ReactElement, ReactNode } from "react";
import Tooltip from "@mui/material/Tooltip";

const BUTTON_STYLE: CSSProperties = {
  // Same sizes as for OpenLayers
  width: "1.375em",
  height: "1.375em",
};

const SELECTED_BUTTON_STYLE: CSSProperties = {
  ...BUTTON_STYLE,
  backgroundColor: "rgba(0,80,180,0.9)",
};

const TOOLTIP_COMPONENT_PROPS = {
  tooltip: {
    // Makes tooltip style  similar to OpenLayers
    sx: {
      backgroundColor: "#4A4A4A",
      border: "1px solid white",
      borderRadius: 0,
    },
  },
};

interface MapButtonProps {
  icon: ReactElement;
  tooltipTitle?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  selected?: boolean;
  onSelect?: (event: MouseEvent<HTMLButtonElement>, selected: boolean) => void;
}

export default function MapButton({
  icon,
  tooltipTitle,
  onClick,
  selected,
  onSelect,
}: MapButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (onSelect) {
      onSelect(event, !selected!);
    }
    if (onClick) {
      onClick(event);
    }
  };

  if (tooltipTitle) {
    icon = (
      <Tooltip title={tooltipTitle} componentsProps={TOOLTIP_COMPONENT_PROPS}>
        {icon}
      </Tooltip>
    );
  }

  return (
    <IconButton
      onClick={handleClick}
      style={selected ? SELECTED_BUTTON_STYLE : BUTTON_STYLE}
    >
      {icon}
    </IconButton>
  );
}

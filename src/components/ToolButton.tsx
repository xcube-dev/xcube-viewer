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

import * as React from "react";
import { MouseEvent } from "react";
import { SxProps } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";
import Tooltip from "@mui/material/Tooltip";

interface ToolButtonProps {
  sx?: SxProps;
  className?: string;
  icon: React.ReactElement;
  onClick: (
    event: MouseEvent<HTMLButtonElement | HTMLElement>,
    value?: string,
  ) => void;
  disabled?: boolean;
  tooltipText?: string;
  toggle?: boolean;
  value?: string; // required for toggle buttons
  selected?: boolean;
}

const ToolButton: React.FC<ToolButtonProps> = ({
  sx,
  className,
  disabled,
  onClick,
  icon,
  tooltipText,
  toggle,
  value,
  selected,
}) => {
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (toggle) {
      onClick(event, value);
    } else {
      onClick(event);
    }
  };

  const iconComp = tooltipText ? (
    <Tooltip arrow title={tooltipText}>
      {icon}
    </Tooltip>
  ) : (
    icon
  );

  if (toggle) {
    return (
      <ToggleButton
        sx={{ padding: 0.3, ...sx }}
        className={className}
        disabled={disabled}
        size="small"
        onClick={handleClick}
        value={value || ""}
        selected={selected}
      >
        {iconComp}
      </ToggleButton>
    );
  } else {
    return (
      <IconButton
        sx={sx}
        className={className}
        disabled={disabled}
        size="small"
        onClick={handleClick}
      >
        {iconComp}
      </IconButton>
    );
  }
};

export default ToolButton;

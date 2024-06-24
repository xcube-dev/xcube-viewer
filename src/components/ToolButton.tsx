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
import { MouseEvent, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

interface ToolButtonProps {
  icon: React.ReactElement;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  tooltipText?: string;
  className?: string;
  toggle?: boolean;
  customSx?: boolean;
}

const ToolButton: React.FC<ToolButtonProps> = ({
  className,
  disabled,
  onClick,
  icon,
  tooltipText,
  toggle = false,
}) => {
  const [isToggled, setIsToggled] = useState(false);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (toggle) {
      setIsToggled(!isToggled);
    }
    onClick(event);
  };

  const iconComp = tooltipText ? (
    <Tooltip arrow title={tooltipText}>
      {icon}
    </Tooltip>
  ) : (
    icon
  );

  return (
    <IconButton
      className={className}
      disabled={disabled}
      onClick={handleClick}
      size="small"
      sx={{
        ...(toggle && {
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderRadius: "4px",
          padding: "2.4px",
          color: isToggled ? "rgba(0, 0, 0, 0.87)" : "rgba(0, 0, 0, 0.54)",
          backgroundColor: isToggled ? "rgba(0, 0, 0, 0.08)" : "transparent",
        }),
      }}
    >
      {iconComp}
    </IconButton>
  );
};

export default ToolButton;

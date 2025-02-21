/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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

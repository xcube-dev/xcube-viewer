/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { CSSProperties, FC, MouseEvent, ReactElement } from "react";
import type { SxProps } from "@mui/material";
import { useTheme } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

const MATERIAL_ICON_STYLE: CSSProperties = {
  fontFamily: "Material Icons",
};
const MATERIAL_ICON_INVERTED_STYLE: CSSProperties = {
  ...MATERIAL_ICON_STYLE,
  filter: "invert(1)",
};

const useIsDarkMode = () => {
  const theme = useTheme();
  return theme.palette.mode === "dark";
};

interface ToolButtonProps {
  sx?: SxProps;
  className?: string;
  icon: ReactElement | string;
  size?: "small" | "medium" | "large";
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

const ToolButton: FC<ToolButtonProps> = ({
  sx,
  className,
  size,
  disabled,
  onClick,
  icon,
  tooltipText,
  toggle,
  value,
  selected,
}) => {
  const isDarkMode = useIsDarkMode();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (toggle) {
      onClick(event, value);
    } else {
      onClick(event);
    }
  };

  const iconElement =
    !icon || typeof icon === "string" ? (
      <Icon
        sx={isDarkMode ? MATERIAL_ICON_INVERTED_STYLE : MATERIAL_ICON_STYLE}
      >
        {icon || "star"}
      </Icon>
    ) : (
      icon
    );

  const iconWithTooltip = tooltipText ? (
    <Tooltip arrow title={tooltipText}>
      {iconElement}
    </Tooltip>
  ) : (
    iconElement
  );

  if (toggle) {
    return (
      <ToggleButton
        sx={{ padding: 0.3, ...sx }}
        className={className}
        disabled={disabled}
        size={size || "small"}
        onClick={handleClick}
        value={value || ""}
        selected={selected}
      >
        {iconWithTooltip}
      </ToggleButton>
    );
  } else {
    return (
      <IconButton
        sx={sx}
        className={className}
        disabled={disabled}
        size={size || "small"}
        onClick={handleClick}
      >
        {iconWithTooltip}
      </IconButton>
    );
  }
};

export default ToolButton;

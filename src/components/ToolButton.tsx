/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { FC, MouseEvent, ReactElement } from "react";
import type { SxProps, Theme } from "@mui/system";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";
import Tooltip, { type TooltipProps } from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

import { makeStyles } from "@/util/styles";

const styles = makeStyles({
  materialIcon: {
    fontFamily: "Material Icons",
  },
});

interface ToolButtonProps {
  sx?: SxProps<Theme>;
  className?: string;
  icon?: ReactElement | string;
  size?: "small" | "medium" | "large";
  onClick: (
    event: MouseEvent<HTMLButtonElement | HTMLElement>,
    value?: string,
  ) => void;
  disabled?: boolean;
  tooltipText?: string;
  tooltipPlacement?: TooltipProps["placement"];
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
  tooltipPlacement,
  toggle,
  value,
  selected,
}) => {
  // const isDarkMode = useIsDarkMode();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (toggle) {
      onClick(event, value);
    } else {
      onClick(event);
    }
  };

  const iconElement =
    !icon || typeof icon === "string" ? (
      <Icon sx={styles.materialIcon}>{icon || "star"}</Icon>
    ) : (
      icon
    );

  const iconWithTooltip = tooltipText ? (
    <Tooltip
      arrow
      title={tooltipText}
      enterDelay={600}
      leaveDelay={100}
      placement={tooltipPlacement}
    >
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

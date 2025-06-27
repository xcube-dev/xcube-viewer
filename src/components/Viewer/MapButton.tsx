/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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
    icon = <Tooltip title={tooltipTitle}>{icon}</Tooltip>;
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

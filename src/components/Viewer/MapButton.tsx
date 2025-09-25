/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import IconButton from "@mui/material/IconButton";
import { MouseEvent, ReactElement, ReactNode } from "react";
import Tooltip from "@mui/material/Tooltip";

interface MapButtonProps {
  icon: ReactElement;
  tooltipTitle?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  selected?: boolean;
  onSelect?: (event: MouseEvent<HTMLButtonElement>, selected: boolean) => void;
  className?: string;
}

export default function MapButton({
  icon,
  tooltipTitle,
  onClick,
  selected,
  onSelect,
  className,
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
      className={className}
      onClick={handleClick}
      // create attribute to change styling in Map.css
      data-selected={selected}
    >
      {icon}
    </IconButton>
  );
}

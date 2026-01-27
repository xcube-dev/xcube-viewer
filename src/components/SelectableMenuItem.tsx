/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { ReactNode } from "react";
import Check from "@mui/icons-material/Check";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

interface SelectableMenuItemProps {
  title: string;
  subtitle?: string;
  disabled?: boolean;
  dense?: boolean;
  selected: boolean;
  secondaryIcon?: ReactNode;
  onClick: () => void;
}

export default function SelectableMenuItem({
  title,
  subtitle,
  disabled,
  dense,
  selected,
  secondaryIcon,
  onClick,
}: SelectableMenuItemProps) {
  return selected ? (
    <MenuItem onClick={onClick} disabled={disabled} dense={dense}>
      <ListItemIcon>
        <Check />
      </ListItemIcon>
      <ListItemText primary={title} secondary={subtitle} />
      {secondaryIcon}
    </MenuItem>
  ) : (
    <MenuItem onClick={onClick} disabled={disabled} dense={dense}>
      <ListItemText inset primary={title} secondary={subtitle} />
      {secondaryIcon}
    </MenuItem>
  );
}

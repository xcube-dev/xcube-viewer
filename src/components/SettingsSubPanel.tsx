/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import { ListItemButton } from "@mui/material";

interface SettingsSubPanelProps {
  label: string;
  value?: string | number;
  onClick?: (event: React.MouseEvent) => void;
  children?: React.ReactNode;
}

const SettingsSubPanel: React.FC<SettingsSubPanelProps> = ({
  label,
  value,
  onClick,
  children,
}) => {
  let listItemStyle;
  if (!value) {
    listItemStyle = { marginBottom: 10 };
  }

  const listItemText = <ListItemText primary={label} secondary={value} />;

  let listItemSecondaryAction;
  if (children) {
    listItemSecondaryAction = (
      <ListItemSecondaryAction>{children}</ListItemSecondaryAction>
    );
  }

  if (onClick) {
    return (
      <ListItemButton style={listItemStyle} onClick={onClick}>
        {listItemText}
        {listItemSecondaryAction}
      </ListItemButton>
    );
  }

  return (
    <ListItem style={listItemStyle}>
      {listItemText}
      {listItemSecondaryAction}
    </ListItem>
  );
};

export default SettingsSubPanel;

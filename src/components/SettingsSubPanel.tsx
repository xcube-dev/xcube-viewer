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

/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import Typography from "@mui/material/Typography";
import { darken, lighten } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { makeStyles } from "@/util/styles";

const styles = makeStyles({
  settingsPanelTitle: (theme) => ({
    marginBottom: theme.spacing(1),
  }),
  settingsPanelPaper: (theme) => ({
    backgroundColor: (theme.palette.mode === "dark" ? lighten : darken)(
      theme.palette.background.paper,
      0.1,
    ),
    marginBottom: theme.spacing(2),
  }),
  settingsPanelList: {
    margin: 0,
  },
});

interface SettingsPanelProps {
  title?: string;
  children?: React.ReactNode;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  title,
  children,
}) => {
  const childCount = React.Children.count(children);

  const listItems: React.ReactNode[] = [];
  React.Children.forEach(children, (child: React.ReactNode, index: number) => {
    listItems.push(child);
    if (index < childCount - 1) {
      listItems.push(
        <Divider key={childCount + index} variant="fullWidth" component="li" />,
      );
    }
  });

  return (
    <Box>
      {title && title !== "" && (
        <Typography variant="body1" sx={styles.settingsPanelTitle}>
          {title}
        </Typography>
      )}
      <Paper elevation={4} sx={styles.settingsPanelPaper}>
        <List component="nav" dense={true} sx={styles.settingsPanelList}>
          {listItems}
        </List>
      </Paper>
    </Box>
  );
};

export default SettingsPanel;

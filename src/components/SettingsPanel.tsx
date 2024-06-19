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

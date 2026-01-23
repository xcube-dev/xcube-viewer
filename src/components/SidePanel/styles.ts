/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type { Theme } from "@mui/system";

import { makeStyles } from "@/util/styles";

const sidePanelThemeDark = {
  sidebarColor: "#181818",
  backgroundColor: "#1F1F1F",
  borderColor: "#2B2B2B",
};

const sidePanelThemeLight = {
  sidebarColor: "#F8F8F8",
  backgroundColor: "#FFFFFF",
  borderColor: "#E5E5E5",
};

const getSidebarColor = (theme: Theme) =>
  (theme.palette.mode === "dark" ? sidePanelThemeDark : sidePanelThemeLight)
    .sidebarColor;
const getBackgroundColor = (theme: Theme) =>
  (theme.palette.mode === "dark" ? sidePanelThemeDark : sidePanelThemeLight)
    .backgroundColor;
const getBorderColor = (theme: Theme) =>
  (theme.palette.mode === "dark" ? sidePanelThemeDark : sidePanelThemeLight)
    .borderColor;

const styles = makeStyles({
  mainContainer: (theme) => ({
    display: "flex",
    flexDirection: "row",
    backgroundColor: getBackgroundColor(theme),
    width: "100%",
    height: "100%",
    overflow: "hidden",
  }),
  panelContainer: {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 auto",
    overflow: "hidden",
  },
  panelHeader: (theme: Theme) => ({
    padding: 1,
    borderTop: `1px solid ${getBorderColor(theme)}`,
    borderRight: `1px solid ${getBorderColor(theme)}`,
    borderBottom: `1px solid ${getBorderColor(theme)}`,
    flex: "0 0 auto",
  }),
  panelContent: (theme: Theme) => ({
    padding: 1,
    borderRight: `1px solid ${getBorderColor(theme)}`,
    flex: "1 1 auto",
    overflow: "auto",
  }),
  sidebarContainer: (theme: Theme) => ({
    display: "flex",
    flexDirection: "column",
    gap: 1,
    padding: 1,
    borderTop: `1px solid ${getBorderColor(theme)}`,
    backgroundColor: getSidebarColor(theme),
    flex: "0 0 auto",
  }),
  sidebarButton: (theme) => ({
    color: theme.palette.text.secondary,
  }),
  sidebarButtonSelected: (theme: Theme) => ({
    background: theme.palette.action.selected,
  }),
});

export default styles;

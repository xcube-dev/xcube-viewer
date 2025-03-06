/*
 * Copyright (c) 2019-2025 by xcube team and contributors
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

const sidebarContainer = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
  padding: 1,
  borderTop: "1px solid",
};

const styles = makeStyles({
  mainContainer: (theme) => ({
    display: "flex",
    flexDirection: "row",
    backgroundColor: getBackgroundColor(theme),
  }),
  panelContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  panelHeader: (theme: Theme) => ({
    padding: 1,
    borderBottom: "1px solid",
    borderBottomColor: getBorderColor(theme),
    borderTop: "1px solid",
    borderTopColor: getBorderColor(theme),
  }),
  panelContent: {
    padding: 1,
    overflow: "auto",
  },
  sidebarContainerSelected: (theme: Theme) => ({
    ...sidebarContainer,
    borderTopColor: getBorderColor(theme),
    borderLeft: "1px solid",
    borderLeftColor: getBorderColor(theme),
    backgroundColor: getSidebarColor(theme),
  }),
  sidebarContainer: (theme: Theme) => ({
    ...sidebarContainer,
    borderTopColor: getBorderColor(theme),
    backgroundColor: getSidebarColor(theme),
  }),
  sidebarButton: (theme) => ({
    color: theme.palette.text.secondary,
  }),
  sidebarButtonSelected: (theme: Theme) => {
    return {
      background: theme.palette.action.selected,
      color: theme.palette.primary.main,
    };
  },
});

export default styles;

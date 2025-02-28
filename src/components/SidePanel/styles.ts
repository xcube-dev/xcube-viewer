/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type { Theme } from "@mui/system";
import { makeStyles } from "@/util/styles";

const styles = makeStyles({
  mainContainer: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
  },
  panelContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  panelContent: {
    paddingTop: 0.5,
    paddingRight: 0.5,
  },
  panelHeader: (theme: Theme) => ({
    paddingTop: 0.5,
    paddingBottom: 0.5,
    borderBottom: "1px solid",
    borderBottomColor: theme.palette.divider,
  }),
  sidebarContainer: (theme: Theme) => ({
    display: "flex",
    flexDirection: "column",
    gap: 0.5,
    padding: 0.5,
    borderLeft: "1px solid",
    borderLeftColor: theme.palette.divider,
  }),
  sidebarButton: (theme: Theme) => {
    return {
      color: theme.palette.text.primary,
    };
  },
  sidebarButtonSelected: (theme: Theme) => {
    return {
      background: theme.palette.action.selected,
    };
  },
});

export default styles;

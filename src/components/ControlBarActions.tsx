/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { Theme, styled } from "@mui/system";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ToggleButton from "@mui/material/ToggleButton";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import ShareIcon from "@mui/icons-material/Share";
import SettingsIcon from "@mui/icons-material/Settings";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";

import i18n from "@/i18n";
import { Config } from "@/config";
import { WithLocale } from "@/util/lang";
import { commonStyles } from "@/components/common-styles";

// noinspection JSUnusedLocalSymbols
const StyledFormControl = styled(FormControl)(
  ({ theme }: { theme: Theme }) => ({
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(0.5),
    marginLeft: "auto",
  }),
);

interface ControlBarActionsProps extends WithLocale {
  visible: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (sideBarOpen: boolean) => void;
  openDialog: (dialogId: string) => void;
  allowRefresh?: boolean;
  updateResources: () => void;
  allowSharing?: boolean;
  shareStatePermalink: () => void;
  compact: boolean;
}

export default function ControlBarActions({
  visible,
  sidebarOpen,
  setSidebarOpen,
  openDialog,
  allowRefresh,
  updateResources,
  allowSharing,
  shareStatePermalink,
  compact,
}: ControlBarActionsProps) {
  if (!visible) {
    return null;
  }

  const sidebarButton = (
    <ToggleButton
      value={"sidebar"}
      selected={sidebarOpen}
      onClick={() => setSidebarOpen(!sidebarOpen)}
      size="small"
      sx={commonStyles.toggleButton}
    >
      <Tooltip arrow title={i18n.get("Show or hide sidebar")}>
        {<ViewSidebarIcon />}
      </Tooltip>
    </ToggleButton>
  );

  let refreshButton;
  let shareButton;
  let downloadButton;
  let settingsButton;

  if (compact) {
    refreshButton = allowRefresh && (
      <IconButton onClick={updateResources} size="small">
        <Tooltip arrow title={i18n.get("Refresh")}>
          <RefreshIcon />
        </Tooltip>
      </IconButton>
    );

    shareButton = allowSharing && (
      <IconButton onClick={shareStatePermalink} size="small">
        <Tooltip arrow title={i18n.get("Share")}>
          <ShareIcon />
        </Tooltip>
      </IconButton>
    );

    downloadButton = Config.instance.branding.allowDownloads && (
      <IconButton onClick={() => openDialog("export")} size="small">
        <Tooltip arrow title={i18n.get("Export data")}>
          {<CloudDownloadIcon />}
        </Tooltip>
      </IconButton>
    );

    settingsButton = (
      <IconButton onClick={() => openDialog("settings")} size="small">
        <Tooltip arrow title={i18n.get("Settings")}>
          <SettingsIcon />
        </Tooltip>
      </IconButton>
    );
  }

  return (
    <StyledFormControl variant="standard">
      <Box>
        {refreshButton}
        {shareButton}
        {downloadButton}
        {settingsButton}
        {sidebarButton}
      </Box>
    </StyledFormControl>
  );
}

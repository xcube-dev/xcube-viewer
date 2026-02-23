/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import i18n from "@/i18n";
import type { WithLocale } from "@/util/lang";

import * as React from "react";
import { SxProps, Theme } from "@mui/material";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RefreshIcon from "@mui/icons-material/Refresh";
import SettingsIcon from "@mui/icons-material/Settings";
import ShareIcon from "@mui/icons-material/Share";
import PolicyIcon from "@mui/icons-material/Policy";

import ImprintPage from "@/components/ImprintPage";
import DevRefPage from "@/components/DevRefPage";
import { Config } from "@/config";

interface AppBarMenuProps extends WithLocale {
  appName: string;
  allowRefresh?: boolean;
  allowSharing?: boolean;
  allowDownloads?: boolean;
  compact?: boolean;
  style?: SxProps<Theme>;
  openDialog: (dialogId: string) => void;
  updateResources: () => void;
  shareStatePermalink: () => void;
}

export default function AppBarMenu({
  appName,
  allowRefresh,
  allowSharing,
  allowDownloads,
  compact,
  style,
  openDialog,
  updateResources,
  shareStatePermalink,
}: AppBarMenuProps) {
  const [imprintOpen, setImprintOpen] = React.useState(false);
  const [devRefOpen, setDevRefOpen] = React.useState(false);

  const [moreMenuOpen, setMoreMenuOpen] = React.useState(false);
  const moreButtonEl = React.useRef<HTMLButtonElement | null>(null);

  const handleOpenMoreMenu = () => {
    setMoreMenuOpen(true);
  };

  const handleCloseMoreMenu = () => {
    setMoreMenuOpen(false);
  };

  const handleSettingsButtonClicked = () => {
    handleCloseMoreMenu();
    openDialog("settings");
  };

  const handleOpenAbout = () => {
    handleCloseMoreMenu();
    openDialog("about");
  };

  const handleOpenManual = () => {
    handleCloseMoreMenu();
    window.open("https://xcube-dev.github.io/xcube-viewer/", "Manual");
  };

  const handleOpenDevRef = () => {
    handleCloseMoreMenu();
    setDevRefOpen(true);
  };

  const handleCloseDevRef = () => {
    setDevRefOpen(false);
  };

  const handleOpenImprint = () => {
    handleCloseMoreMenu();
    setImprintOpen(true);
  };

  const handleCloseImprint = () => {
    setImprintOpen(false);
  };

  const handleUpdateResources = () => {
    handleCloseMoreMenu();
    updateResources();
  };

  const handleSharing = () => {
    handleCloseMoreMenu();
    shareStatePermalink();
  };

  const handleDownloads = () => {
    handleCloseMoreMenu();
    openDialog("export");
  };

  return (
    <React.Fragment>
      <Tooltip arrow title={i18n.get("More")}>
        <IconButton
          onClick={handleOpenMoreMenu}
          size="small"
          sx={style}
          ref={moreButtonEl}
        >
          {compact ? <MenuIcon /> : <MoreVertIcon />}
        </IconButton>
      </Tooltip>
      <ImprintPage open={imprintOpen} onClose={handleCloseImprint} />
      <DevRefPage open={devRefOpen} onClose={handleCloseDevRef} />
      <Menu
        anchorEl={moreButtonEl.current}
        open={moreMenuOpen}
        onClose={handleCloseMoreMenu}
      >
        {compact && (
          <>
            {allowRefresh && (
              <MenuItem onClick={handleUpdateResources}>
                <ListItemIcon>
                  <RefreshIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{i18n.get("Refresh")}</ListItemText>
              </MenuItem>
            )}
            {allowSharing && (
              <MenuItem onClick={handleSharing}>
                <ListItemIcon>
                  <ShareIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{i18n.get("Share")}</ListItemText>
              </MenuItem>
            )}
            {allowDownloads && (
              <MenuItem onClick={handleDownloads}>
                <ListItemIcon>
                  <CloudDownloadIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{i18n.get("Export data")}</ListItemText>
              </MenuItem>
            )}
            <Divider />
          </>
        )}
        <MenuItem onClick={handleSettingsButtonClicked}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{i18n.get("Settings")}</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleOpenManual}>
          <ListItemIcon>
            <HelpOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{i18n.get("Documentation")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleOpenDevRef}>
          <ListItemIcon>
            <CodeOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{i18n.get("Developer Reference")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleOpenImprint}>
          <ListItemIcon>
            <PolicyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{i18n.get("Imprint")}</ListItemText>
        </MenuItem>
        {Config.instance.branding.allowAboutPage && (
          <>
            <Divider />
            <MenuItem onClick={handleOpenAbout}>
              <ListItemIcon>
                <InfoOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                {i18n.get("About ${appName}", { appName })}
              </ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
    </React.Fragment>
  );
}

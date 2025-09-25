/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import i18n from "@/i18n";
import type { WithLocale } from "@/util/lang";

import * as React from "react";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import SettingsIcon from "@mui/icons-material/Settings";
import ShareIcon from "@mui/icons-material/Share";
import PolicyIcon from "@mui/icons-material/Policy";

import ImprintPage from "@/components/ImprintPage";
import DevRefPage from "@/components/DevRefPage";
import { Config } from "@/config";

interface AppBarMenuProps extends WithLocale {
  anchorEl: HTMLElement | null;
  allowRefresh: boolean;
  allowSharing: boolean;
  allowDownloads: boolean;
  compact: boolean;
  open: boolean;
  onClose: () => void;
  openDialog: (dialogId: string) => unknown;
  updateResources: () => unknown;
  shareStatePermalink: () => unknown;
}

const AppBarMenu: React.FC<AppBarMenuProps> = ({
  anchorEl,
  allowRefresh,
  allowSharing,
  allowDownloads,
  compact,
  open,
  onClose,
  openDialog,
  updateResources,
  shareStatePermalink,
}) => {
  const appName = Config.instance.branding.appBarTitle;
  const [imprintOpen, setImprintOpen] = React.useState(false);
  const [devRefOpen, setDevRefOpen] = React.useState(false);

  const handleSettingsButtonClicked = () => {
    onClose();
    openDialog("settings");
  };

  const handleOpenAbout = () => {
    onClose();
    openDialog("about");
  };

  const handleOpenManual = () => {
    onClose();
    window.open("https://xcube-dev.github.io/xcube-viewer/", "Manual");
  };

  const handleOpenDevRef = () => {
    onClose();
    setDevRefOpen(true);
  };

  const handleCloseDevRef = () => {
    setDevRefOpen(false);
  };

  const handleOpenImprint = () => {
    onClose();
    setImprintOpen(true);
  };

  const handleCloseImprint = () => {
    setImprintOpen(false);
  };

  const handleUpdateResources = () => {
    onClose();
    updateResources();
  };

  const handleSharing = () => {
    onClose();
    shareStatePermalink();
  };

  const handleDownloads = () => {
    onClose();
    openDialog("export");
  };

  return (
    <>
      <ImprintPage open={imprintOpen} onClose={handleCloseImprint} />
      <DevRefPage open={devRefOpen} onClose={handleCloseDevRef} />
      <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
        {compact && (
          <div>
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
          </div>
        )}
        {Config.instance.branding.allowAboutPage && (
          <>
            <MenuItem onClick={handleOpenAbout}>
              <ListItemIcon>
                <InfoOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                {i18n.get("About ${appName}", { appName })}
              </ListItemText>
            </MenuItem>
            <Divider />
          </>
        )}
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
        <Divider />
        <MenuItem onClick={handleSettingsButtonClicked}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{i18n.get("Settings")}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default AppBarMenu;

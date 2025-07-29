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
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import PolicyIcon from "@mui/icons-material/Policy";

import ImprintPage from "@/components/ImprintPage";
import DevRefPage from "@/components/DevRefPage";
import { Config } from "@/config";

interface AppBarMenuProps extends WithLocale {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  openDialog: (dialogId: string) => void;
}

const AppBarMenu: React.FC<AppBarMenuProps> = ({
  anchorEl,
  open,
  onClose,
  openDialog,
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

  return (
    <>
      <ImprintPage open={imprintOpen} onClose={handleCloseImprint} />
      <DevRefPage open={devRefOpen} onClose={handleCloseDevRef} />
      <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
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

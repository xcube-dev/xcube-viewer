/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";
import { connect } from "react-redux";
import { SxProps, Theme, styled } from "@mui/material";
import AppBarComponent from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import RefreshIcon from "@mui/icons-material/Refresh";
import ShareIcon from "@mui/icons-material/Share";
import PolicyIcon from "@mui/icons-material/Policy";
import { deepOrange } from "@mui/material/colors";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

import i18n from "@/i18n";
import { makeStyles } from "@/util/styles";
import { Config } from "@/config";
import { AppState } from "@/states/appState";
import { WithLocale } from "@/util/lang";
import { openDialog } from "@/actions/controlActions";
import { shareStatePermalink, updateResources } from "@/actions/dataActions";
import DevRefPage from "@/components/DevRefPage";
import ImprintPage from "@/components/ImprintPage";
import UserControl from "./UserControl";

interface AppBarImplProps extends WithLocale {
  appName: string;
  openDialog: (dialogId: string) => unknown;
  allowRefresh?: boolean;
  allowSharing?: boolean;
  updateResources: () => unknown;
  shareStatePermalink: () => unknown;
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    appName: Config.instance.branding.appBarTitle,
    allowRefresh: Config.instance.branding.allowRefresh,
    allowSharing: Config.instance.branding.allowSharing,
  };
};

// noinspection JSUnusedGlobalSymbols
const mapDispatchToProps = {
  openDialog,
  updateResources,
  shareStatePermalink,
};

const appBarStyle: Record<string, SxProps<Theme>> = {
  appBar: (theme: Theme) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  }),
};

const StyledAnchorTag = styled("a")(() => ({
  display: "flex",
  alignItems: "center",
}));
const StyledImg = styled("img")(({ theme }: { theme: Theme }) => ({
  marginLeft: theme.spacing(1),
}));

const styles = makeStyles({
  toolbar: (theme) => ({
    backgroundColor: Config.instance.branding.headerBackgroundColor,
    paddingRight: theme.spacing(1),
  }),
  title: (theme) => ({
    flexGrow: 1,
    marginLeft: theme.spacing(1),
    ...Config.instance.branding.headerTitleStyle,
  }),
  imageAvatar: {
    width: 24,
    height: 24,
    color: "#fff",
    backgroundColor: deepOrange[300],
  },
  letterAvatar: {
    width: 24,
    height: 24,
    color: "#fff",
    backgroundColor: deepOrange[300],
  },
  signInProgress: {
    color: deepOrange[300],
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: 1,
    marginTop: "-12px",
    marginLeft: "-12px",
  },
  iconButton: (theme) => ({
    marginLeft: theme.spacing(2),
    ...Config.instance.branding.headerIconStyle,
  }),
});

const AppBarImpl: React.FC<AppBarImplProps> = ({
  appName,
  openDialog,
  allowRefresh,
  updateResources,
  allowSharing,
  shareStatePermalink,
}: AppBarImplProps) => {
  const [imprintOpen, setImprintOpen] = React.useState(false);
  const [helpMenuOpen, setHelpMenuOpen] = React.useState(false);
  const [devRefOpen, setDevRefOpen] = React.useState(false);
  const helpButtonEl = React.useRef<HTMLButtonElement | null>(null);

  const handleSettingsButtonClicked = () => {
    openDialog("settings");
  };

  const handleOpenHelpMenu = () => {
    setHelpMenuOpen(true);
  };

  const handleCloseHelpMenu = () => {
    setHelpMenuOpen(false);
  };

  const handleOpenManual = () => {
    setHelpMenuOpen(false);
    window.open("https://xcube-dev.github.io/xcube-viewer/", "Manual");
  };

  const handleOpenDevRef = () => {
    setDevRefOpen(true);
  };

  const handleCloseDevRef = () => {
    setDevRefOpen(false);
  };

  const handleOpenImprint = () => {
    setImprintOpen(true);
  };

  const handleCloseImprint = () => {
    setImprintOpen(false);
  };

  return (
    <AppBarComponent position="absolute" sx={appBarStyle.appBar} elevation={0}>
      <Toolbar disableGutters sx={styles.toolbar} variant="dense">
        <StyledAnchorTag
          href={Config.instance.branding.organisationUrl || ""}
          target="_blank"
          rel="noreferrer"
        >
          <StyledImg
            src={Config.instance.branding.logoImage}
            width={Config.instance.branding.logoWidth}
            alt={"xcube logo"}
          />
        </StyledAnchorTag>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={styles.title}
        >
          {appName}
        </Typography>
        <UserControl />
        {allowRefresh && (
          <Tooltip arrow title={i18n.get("Refresh")}>
            <IconButton
              onClick={updateResources}
              size="small"
              sx={styles.iconButton}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
        {allowSharing && (
          <Tooltip arrow title={i18n.get("Share")}>
            <IconButton
              onClick={shareStatePermalink}
              size="small"
              sx={styles.iconButton}
            >
              <ShareIcon />
            </IconButton>
          </Tooltip>
        )}
        {Config.instance.branding.allowDownloads && (
          <Tooltip arrow title={i18n.get("Export data")}>
            <IconButton
              onClick={() => openDialog("export")}
              size="small"
              sx={styles.iconButton}
            >
              {<CloudDownloadIcon />}
            </IconButton>
          </Tooltip>
        )}
        <Tooltip arrow title={i18n.get("Help")}>
          <IconButton
            onClick={handleOpenHelpMenu}
            size="small"
            sx={styles.iconButton}
            ref={helpButtonEl}
          >
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
        {Config.instance.branding.allowAboutPage && (
          <Tooltip arrow title={i18n.get("About")}>
            <IconButton
              onClick={() => openDialog("about")}
              size="small"
              sx={styles.iconButton}
            >
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip arrow title={i18n.get("Imprint")}>
          <IconButton
            onClick={handleOpenImprint}
            size="small"
            sx={styles.iconButton}
          >
            <PolicyIcon />
          </IconButton>
        </Tooltip>
        <Tooltip arrow title={i18n.get("Settings")}>
          <IconButton
            onClick={handleSettingsButtonClicked}
            size="small"
            sx={styles.iconButton}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
      <ImprintPage open={imprintOpen} onClose={handleCloseImprint} />
      <DevRefPage open={devRefOpen} onClose={handleCloseDevRef} />
      <Menu
        anchorEl={helpButtonEl.current}
        open={helpMenuOpen}
        onClose={handleCloseHelpMenu}
      >
        <MenuItem onClick={handleOpenManual}>
          {i18n.get("Documentation")}
        </MenuItem>
        <MenuItem onClick={handleOpenDevRef}>
          {i18n.get("Developer Reference")}
        </MenuItem>
      </Menu>
    </AppBarComponent>
  );
};

const AppBar = connect(mapStateToProps, mapDispatchToProps)(AppBarImpl);
export default AppBar;

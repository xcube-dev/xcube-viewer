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
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RefreshIcon from "@mui/icons-material/Refresh";
import ShareIcon from "@mui/icons-material/Share";
import { deepOrange } from "@mui/material/colors";

import i18n from "@/i18n";
import { makeStyles } from "@/util/styles";
import { Config } from "@/config";
import { AppState } from "@/states/appState";
import { WithLocale } from "@/util/lang";
import { openDialog } from "@/actions/controlActions";
import { shareStatePermalink, updateResources } from "@/actions/dataActions";
import AppBarMenu from "@/components/AppBarMenu";
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
  const [moreMenuOpen, setMoreMenuOpen] = React.useState(false);
  const moreButtonEl = React.useRef<HTMLButtonElement | null>(null);

  const handleOpenMoreMenu = () => {
    setMoreMenuOpen(true);
  };

  const handleCloseMoreMenu = () => {
    setMoreMenuOpen(false);
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
        <IconButton
          onClick={handleOpenMoreMenu}
          size="small"
          sx={styles.iconButton}
          ref={moreButtonEl}
        >
          <MoreVertIcon />
        </IconButton>
      </Toolbar>
      <AppBarMenu
        anchorEl={moreButtonEl.current}
        open={moreMenuOpen}
        onClose={handleCloseMoreMenu}
        openDialog={openDialog}
      />
    </AppBarComponent>
  );
};

const AppBar = connect(mapStateToProps, mapDispatchToProps)(AppBarImpl);
export default AppBar;

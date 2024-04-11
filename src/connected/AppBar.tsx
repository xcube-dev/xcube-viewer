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

import * as React from "react";
import { connect } from "react-redux";
import { WithStyles } from "@mui/styles";
import { Theme } from "@mui/material";
import AppBarComponent from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import RefreshIcon from "@mui/icons-material/Refresh";
import PolicyIcon from "@mui/icons-material/Policy";
import { deepOrange } from "@mui/material/colors";
import classNames from "classnames";

import { Config } from "../config";
import i18n from "../i18n";
import { AppState } from "../states/appState";
import { WithLocale } from "../util/lang";
import UserControl from "./UserControl";
import { openDialog } from "../actions/controlActions";
import { updateResources } from "../actions/dataActions";
import MarkdownPage from "../components/MarkdownPage";

interface AppBarProps extends WithStyles<typeof styles>, WithLocale {
  appName: string;
  openDialog: (dialogId: string) => any;
  allowRefresh?: boolean;
  updateResources: () => any;
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    appName: Config.instance.branding.appBarTitle,
    allowRefresh: Config.instance.branding.allowRefresh,
  };
};

const mapDispatchToProps = {
  openDialog,
  updateResources,
};

const styles = (theme: Theme) =>
  createStyles({
    toolbar: {
      backgroundColor: Config.instance.branding.headerBackgroundColor,
      paddingRight: theme.spacing(1),
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    logoAnchor: {
      display: "flex",
      alignItems: "center",
    },
    logo: {
      marginLeft: theme.spacing(1),
    },
    title: {
      flexGrow: 1,
      marginLeft: theme.spacing(1),
      ...Config.instance.branding.headerTitleStyle,
    },
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
    signInWrapper: {
      margin: theme.spacing(1),
      position: "relative",
    },
    signInProgress: {
      color: deepOrange[300],
      position: "absolute",
      top: "50%",
      left: "50%",
      zIndex: 1,
      marginTop: -12,
      marginLeft: -12,
    },
    iconButton: {
      marginLeft: theme.spacing(2),
      ...Config.instance.branding.headerIconStyle,
    },
  });

const _AppBar: React.FC<AppBarProps> = ({
  classes,
  appName,
  openDialog,
  allowRefresh,
  updateResources,
}: AppBarProps) => {
  const [imprintOpen, setImprintOpen] = React.useState(false);

  const handleSettingsButtonClicked = () => {
    openDialog("settings");
  };

  const handleOpenManual = () => {
    window.open("https://xcube.readthedocs.io/en/latest/viewer.html", "Manual");
  };

  const handleOpenImprint = () => {
    setImprintOpen(true);
  };

  const handleCloseImprint = () => {
    setImprintOpen(false);
  };

  return (
    <AppBarComponent position="absolute" className={classNames(classes.appBar)}>
      <Toolbar disableGutters className={classes.toolbar} variant="dense">
        <a
          href={Config.instance.branding.organisationUrl || ""}
          target="_blank"
          rel="noreferrer"
          className={classes.logoAnchor}
        >
          <img
            src={Config.instance.branding.logoImage}
            width={Config.instance.branding.logoWidth}
            alt={"xcube logo"}
            className={classes.logo}
          />
        </a>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          className={classes.title}
        >
          {appName}
        </Typography>
        <UserControl />
        {allowRefresh && (
          <Tooltip arrow title={i18n.get("Refresh")}>
            <IconButton
              onClick={updateResources}
              size="small"
              className={classes.iconButton}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip arrow title={i18n.get("Help")}>
          <IconButton
            onClick={handleOpenManual}
            size="small"
            className={classes.iconButton}
          >
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
        <Tooltip arrow title={i18n.get("Imprint")}>
          <IconButton
            onClick={handleOpenImprint}
            size="small"
            className={classes.iconButton}
          >
            <PolicyIcon />
          </IconButton>
        </Tooltip>
        <Tooltip arrow title={i18n.get("Settings")}>
          <IconButton
            onClick={handleSettingsButtonClicked}
            size="small"
            className={classes.iconButton}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
      <MarkdownPage
        title={i18n.get("Imprint")}
        href="imprint.md"
        open={imprintOpen}
        onClose={handleCloseImprint}
      />
    </AppBarComponent>
  );
};

const AppBar = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(_AppBar));
export default AppBar;

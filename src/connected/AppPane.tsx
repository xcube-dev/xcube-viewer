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
import { Theme, Toolbar } from "@mui/material";

import { WithStyles } from "@mui/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";

import { AppState } from "../states/appState";
import ControlBar from "./ControlBar";
import Workspace from "./Workspace";
import { Config } from "../config";

interface AppPaneProps extends WithStyles<typeof styles> {
  hasConsent: boolean;
  compact: boolean;
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    hasConsent: state.controlState.privacyNoticeAccepted,
    compact: Config.instance.branding.compact,
  };
};

const mapDispatchToProps = {};

const styles = (theme: Theme) =>
  createStyles({
    main: {
      padding: 0,
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      [theme.breakpoints.up("md")]: {
        overflow: "hidden",
      },
    },
  });

const AppPane: React.FC<AppPaneProps> = ({ classes, hasConsent, compact }) => {
  // <Toolbar/>: Empty toolbar is a spacer, see docs https://material-ui.com/components/app-bar/
  return (
    <main className={classes.main}>
      {!compact && <Toolbar variant="dense" />}
      {hasConsent && (
        <>
          <ControlBar />
          <Workspace />
        </>
      )}
    </main>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(AppPane));

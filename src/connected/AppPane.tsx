/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";
import { connect } from "react-redux";
import { Theme, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";

import { AppState } from "@/states/appState";
import { Config } from "@/config";
import ControlBar from "./ControlBar";
import Workspace from "./Workspace";
import LayerControlPanel from "./LayerControlPanel";

interface AppPaneProps {
  hasConsent: boolean;
  compact: boolean;
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    hasConsent: state.controlState.privacyNoticeAccepted,
    compact: !!Config.instance.branding.compact,
  };
};

const mapDispatchToProps = {};

const StyledMain = styled("main")(({ theme }: { theme: Theme }) => ({
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
}));

const _AppPane: React.FC<AppPaneProps> = ({ hasConsent, compact }) => {
  // <Toolbar/>: Empty toolbar is a spacer, see docs https://material-ui.com/components/app-bar/
  return (
    <StyledMain>
      {!compact && <Toolbar variant="dense" />}
      {hasConsent && (
        <>
          <ControlBar />
          <Workspace />
          <LayerControlPanel />
        </>
      )}
    </StyledMain>
  );
};

const AppPane = connect(mapStateToProps, mapDispatchToProps)(_AppPane);
export default AppPane;

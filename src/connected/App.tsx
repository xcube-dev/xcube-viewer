/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";
import { connect } from "react-redux";
import {
  type PaletteMode,
  createTheme,
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";

import { Config } from "@/config";
import { AppState } from "@/states/appState";
import { getPaletteMode, ThemeMode } from "@/states/controlState";
import AuthWrapper from "@/components/AuthWrapper";
import AppBar from "./AppBar";
import AppPane from "./AppPane";
import LegalAgreementDialog from "./LegalAgreementDialog";
import LoadingDialog from "./LoadingDialog";
import MessageLog from "./MessageLog";
import ServerDialog from "./ServerDialog";
import SettingsDialog from "./SettingsDialog";
import ExportDialog from "./ExportDialog";
import UserPlacesDialog from "./UserPlacesDialog";
import UserLayersDialog from "./UserLayersDialog";
import UserVariablesDialog from "./UserVariablesDialog";

interface AppProps {
  compact: boolean;
  themeMode: ThemeMode;
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
  return {
    compact: Config.instance.branding.compact,
    themeMode: state.controlState.themeMode,
  };
};

const mapDispatchToProps = {};

const _App: React.FC<AppProps> = ({ compact, themeMode }) => {
  const systemThemeMode = useMediaQuery("(prefers-color-scheme: dark)")
    ? "dark"
    : "light";

  const theme = React.useMemo(() => {
    const mode: PaletteMode = getPaletteMode(themeMode, systemThemeMode);

    return createTheme({
      typography: {
        fontSize: 12,
        htmlFontSize: 14,
      },
      palette: {
        mode,
        primary: Config.instance.branding.primaryColor,
        secondary: Config.instance.branding.secondaryColor,
      },
    });
  }, [themeMode, systemThemeMode]);

  return (
    <AuthWrapper>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {!compact && <AppBar />}
          <AppPane />
          <LoadingDialog />
          <ServerDialog />
          <SettingsDialog />
          <UserLayersDialog key="userOverlays" dialogId="userOverlays" />
          <UserLayersDialog key="userBaseMaps" dialogId="userBaseMaps" />
          <UserVariablesDialog />
          <UserPlacesDialog />
          <ExportDialog />
          <LegalAgreementDialog />
          <MessageLog />
        </ThemeProvider>
      </StyledEngineProvider>
    </AuthWrapper>
  );
};

const App = connect(mapStateToProps, mapDispatchToProps)(_App);
export default App;

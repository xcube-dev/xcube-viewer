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
import { PaletteColor } from "@mui/material/styles/createPalette";

import { Config } from "@/config";
import { lightTheme, darkTheme } from "@/theme";
import { type AppState } from "@/states/appState";
import { getPaletteMode, type ThemeMode } from "@/states/controlState";
import AboutDialog from "./AboutDialog";
import AuthWrapper from "@/components/AuthWrapper";
import ScrollbarStyles from "@/components/ScrollbarStyles";
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

interface AppImplProps {
  compact: boolean;
  themeMode: ThemeMode;
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
  return {
    compact: !!Config.instance.branding.compact,
    themeMode: state.controlState.themeMode,
  };
};

const mapDispatchToProps = {};

const AppImpl: React.FC<AppImplProps> = ({ compact, themeMode }) => {
  const systemThemeMode = useMediaQuery("(prefers-color-scheme: dark)")
    ? "dark"
    : "light";

  const theme = React.useMemo(() => {
    const mode: PaletteMode = getPaletteMode(themeMode, systemThemeMode);

    let baseTheme = mode === "dark" ? darkTheme : lightTheme;

    const primaryColor = Config.instance.branding.primaryColor;
    const secondaryColor = Config.instance.branding.secondaryColor;
    if (primaryColor) {
      baseTheme = {
        ...baseTheme,
        palette: {
          ...baseTheme.palette,
          primary: { ...primaryColor } as PaletteColor,
        },
      };
    }
    if (secondaryColor) {
      baseTheme = {
        ...baseTheme,
        palette: {
          ...baseTheme.palette,
          secondary: { ...secondaryColor } as PaletteColor,
        },
      };
    }

    return createTheme({ ...baseTheme });
  }, [themeMode, systemThemeMode]);

  return (
    <AuthWrapper>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ScrollbarStyles />
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
          <AboutDialog />
          <LegalAgreementDialog />
          <MessageLog />
        </ThemeProvider>
      </StyledEngineProvider>
    </AuthWrapper>
  );
};

const App = connect(mapStateToProps, mapDispatchToProps)(AppImpl);
export default App;

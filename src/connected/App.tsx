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
import {
  createTheme,
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";

import { Config } from "@/config";
import { AppState } from "@/states/appState";
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
import { configureLogging } from "@/store";

if (import.meta.env.DEV) {
  configureLogging();
}

interface AppProps {
  compact: boolean;
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (_state: AppState) => {
  return {
    compact: Config.instance.branding.compact,
  };
};

const mapDispatchToProps = {};

const newTheme = () =>
  createTheme({
    typography: {
      fontSize: 12,
      htmlFontSize: 14,
    },
    palette: {
      mode: Config.instance.branding.themeName,
      primary: Config.instance.branding.primaryColor,
      secondary: Config.instance.branding.secondaryColor,
    },
  });

const _App: React.FC<AppProps> = ({ compact }) => {
  return (
    <AuthWrapper>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={newTheme()}>
          <CssBaseline />
          {!compact && <AppBar />}
          <AppPane />
          <>
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
          </>
        </ThemeProvider>
      </StyledEngineProvider>
    </AuthWrapper>
  );
};

const App = connect(mapStateToProps, mapDispatchToProps)(_App);
export default App;

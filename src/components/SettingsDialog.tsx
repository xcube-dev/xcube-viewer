/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { SxProps } from "@mui/system";
import { Theme, useTheme } from "@mui/material";

import i18n from "@/i18n";
import { ApiServerConfig, ApiServerInfo } from "@/model/apiServer";
import {
  TIME_ANIMATION_INTERVALS,
  ControlState,
  LocateMode,
  TimeSeriesChartType,
  TimeAnimationInterval,
  THEME_LABELS,
  ThemeMode,
  ExportResolution,
} from "@/states/controlState";
import { GEOGRAPHIC_CRS, WEB_MERCATOR_CRS } from "@/model/proj";
import { LayerDefinition } from "@/model/layerDefinition";
import SettingsPanel from "./SettingsPanel";
import SettingsSubPanel from "./SettingsSubPanel";
import ToggleSetting from "./ToggleSetting";
import RadioSetting from "./RadioSetting";

const styles: Record<string, SxProps<Theme>> = {
  textField: (theme) => ({
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    fontSize: theme.typography.fontSize / 2,
  }),
  intTextField: (theme) => ({
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    fontSize: theme.typography.fontSize / 2,
    width: theme.spacing(6),
  }),
  localeAvatar: {
    margin: 10,
  },
};

const LOCATE_MODE_LABELS: [LocateMode, string][] = [
  ["doNothing", "Do nothing"],
  ["pan", "Pan"],
  ["panAndZoom", "Pan and zoom"],
];

const TS_CHART_TYPE_LABELS: [TimeSeriesChartType, string][] = [
  ["point", "Points"],
  ["line", "Lines"],
  ["bar", "Bars"],
];

const EXPORT_RESOLUTION_LABELS: [ExportResolution, string][] = [
  [96, "Screen Resolution (96 DPI)"],
  [150, "Intermediate Resolution (150 DPI)"],
  [300, "Print Resolution (300 DPI)"],
  [600, "Professional Print Resolution (600 DPI)"],
];

interface SettingsDialogProps {
  open: boolean;
  closeDialog: (dialogId: string) => void;
  settings: ControlState;
  selectedServer: ApiServerConfig;
  viewerVersion: string;
  userBaseMapLayers: LayerDefinition[];
  userOverlayLayers: LayerDefinition[];
  updateSettings: (settings: Partial<ControlState>) => void;
  changeLocale: (locale: string) => void;
  openDialog: (dialogId: string) => void;
  serverInfo: ApiServerInfo | null;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  closeDialog,
  settings,
  selectedServer,
  userBaseMapLayers,
  userOverlayLayers,
  updateSettings,
  changeLocale,
  openDialog,
  viewerVersion,
  serverInfo,
}) => {
  const [languageMenuAnchor, setLanguageMenuAnchor] =
    React.useState<Element | null>(null);
  const [timeChunkSize, setTimeChunkSize] = React.useState(
    settings.timeChunkSize + "",
  );
  const theme = useTheme();

  React.useEffect(() => {
    const newTimeChunkSize = parseInt(timeChunkSize);
    if (
      !Number.isNaN(newTimeChunkSize) &&
      newTimeChunkSize !== settings.timeChunkSize
    ) {
      updateSettings({ timeChunkSize: newTimeChunkSize });
    }
  }, [timeChunkSize, settings, updateSettings]);

  if (!open) {
    return null;
  }

  function handleCloseDialog() {
    closeDialog("settings");
  }

  function handleOpenServerDialog() {
    openDialog("server");
  }

  function handleTimeAnimationIntervalChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    updateSettings({
      timeAnimationInterval: parseInt(
        event.target.value,
      ) as TimeAnimationInterval,
    });
  }

  function handleTimeSeriesChartTypeDefaultChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    updateSettings({
      timeSeriesChartTypeDefault: event.target.value as TimeSeriesChartType,
    });
  }

  function handleDatasetLocateModeChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    updateSettings({
      datasetLocateMode: event.target.value as LocateMode,
    });
  }

  function handlePlaceLocateModeChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    updateSettings({
      placeLocateMode: event.target.value as LocateMode,
    });
  }

  function handleTimeChunkSizeChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setTimeChunkSize(event.target.value);
  }

  let localeMenuItems = null;
  if (languageMenuAnchor) {
    localeMenuItems = Object.getOwnPropertyNames(i18n.languages).map(
      (langLocale) => {
        const langName = i18n.languages[langLocale];
        return (
          <MenuItem
            key={langLocale}
            selected={langLocale === settings.locale}
            onClick={() => changeLocale(langLocale)}
          >
            <ListItemText primary={langName} />
          </MenuItem>
        );
      },
    );
  }

  function handleLanguageMenuOpen(event: React.MouseEvent) {
    setLanguageMenuAnchor(event.currentTarget);
  }

  function handleLanguageMenuClose() {
    setLanguageMenuAnchor(null);
  }

  const handleManageUserBaseMaps = (event: React.MouseEvent) => {
    event.stopPropagation();
    openDialog("userBaseMaps");
  };

  function handleImageExportSizeChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    updateSettings({
      exportResolution: parseInt(event.target.value) as ExportResolution,
    });
  }

  const handleManageUserOverlays = (event: React.MouseEvent) => {
    event.stopPropagation();
    openDialog("userOverlays");
  };

  function handleThemeModeChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    updateSettings({
      themeMode: event.target.value as ThemeMode,
    });
  }

  return (
    <div>
      <Dialog
        open={open}
        fullWidth
        maxWidth={"sm"}
        onClose={handleCloseDialog}
        scroll="body"
      >
        <DialogTitle>{i18n.get("Settings")}</DialogTitle>
        <DialogContent>
          <SettingsPanel title={i18n.get("General")}>
            <SettingsSubPanel
              label={i18n.get("Server")}
              value={selectedServer.name}
              onClick={handleOpenServerDialog}
            />
            <SettingsSubPanel
              label={i18n.get("Language")}
              value={i18n.languages[settings.locale]}
              onClick={handleLanguageMenuOpen}
            />
            <SettingsSubPanel label={i18n.get("Time interval of the player")}>
              <TextField
                variant="standard"
                select
                sx={styles.textField}
                value={settings.timeAnimationInterval}
                onChange={handleTimeAnimationIntervalChange}
                margin="normal"
              >
                {TIME_ANIMATION_INTERVALS.map((value, i) => (
                  <MenuItem key={i} value={value}>
                    {value + " ms"}
                  </MenuItem>
                ))}
              </TextField>
            </SettingsSubPanel>
            <SettingsSubPanel label={i18n.get("Export resolution in DPI")}>
              <TextField
                variant="standard"
                select
                sx={styles.textField}
                value={settings.exportResolution}
                onChange={handleImageExportSizeChange}
                margin="normal"
              >
                {EXPORT_RESOLUTION_LABELS.map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {i18n.get(label)}
                  </MenuItem>
                ))}
              </TextField>
            </SettingsSubPanel>
            <SettingsSubPanel label={i18n.get("Appearance mode")}>
              <TextField
                variant="standard"
                select
                sx={styles.textField}
                value={settings.themeMode || theme.palette.mode}
                onChange={handleThemeModeChange}
                margin="normal"
              >
                {THEME_LABELS.map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {i18n.get(label)}
                  </MenuItem>
                ))}
              </TextField>
            </SettingsSubPanel>
          </SettingsPanel>
          <SettingsPanel title={i18n.get("Time-Series")}>
            <SettingsSubPanel
              label={i18n.get("Show chart after adding a place")}
              value={getOnOff(settings.autoShowTimeSeries)}
            >
              <ToggleSetting
                propertyName={"autoShowTimeSeries"}
                settings={settings}
                updateSettings={updateSettings}
              />
            </SettingsSubPanel>
            <SettingsSubPanel label={i18n.get("Default chart type")}>
              <TextField
                variant="standard"
                select
                sx={styles.textField}
                value={settings.timeSeriesChartTypeDefault}
                onChange={handleTimeSeriesChartTypeDefaultChange}
                margin="normal"
              >
                {TS_CHART_TYPE_LABELS.map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {i18n.get(label)}
                  </MenuItem>
                ))}
              </TextField>
            </SettingsSubPanel>
            <SettingsSubPanel
              label={i18n.get("Calculate standard deviation")}
              value={getOnOff(settings.timeSeriesIncludeStdev)}
            >
              <ToggleSetting
                propertyName={"timeSeriesIncludeStdev"}
                settings={settings}
                updateSettings={updateSettings}
              />
            </SettingsSubPanel>
            <SettingsSubPanel
              label={i18n.get(
                "Calculate median instead of mean (disables standard deviation)",
              )}
              value={getOnOff(settings.timeSeriesUseMedian)}
            >
              <ToggleSetting
                propertyName={"timeSeriesUseMedian"}
                settings={settings}
                updateSettings={updateSettings}
              />
            </SettingsSubPanel>
            <SettingsSubPanel
              label={i18n.get(
                "Minimal number of data points in a time series update",
              )}
            >
              <TextField
                variant="standard"
                sx={styles.intTextField}
                value={timeChunkSize}
                onChange={handleTimeChunkSizeChange}
                margin="normal"
                size={"small"}
              />
            </SettingsSubPanel>
          </SettingsPanel>

          <SettingsPanel title={i18n.get("Map")}>
            <SettingsSubPanel
              label={i18n.get("User Base Maps") + "..."}
              value={`${userBaseMapLayers.length} ${i18n.get("defined")}`}
              onClick={handleManageUserBaseMaps}
            />
            <SettingsSubPanel
              label={i18n.get("User Overlays") + "..."}
              value={`${userOverlayLayers.length} ${i18n.get("defined")}`}
              onClick={handleManageUserOverlays}
            />
            <SettingsSubPanel label={i18n.get("Projection")}>
              <RadioSetting
                propertyName={"mapProjection"}
                settings={settings}
                updateSettings={updateSettings}
                options={[
                  [i18n.get("Geographic"), GEOGRAPHIC_CRS],
                  [i18n.get("Mercator"), WEB_MERCATOR_CRS],
                ]}
              />
            </SettingsSubPanel>
            <SettingsSubPanel
              label={i18n.get("Image smoothing")}
              value={getOnOff(settings.imageSmoothingEnabled)}
            >
              <ToggleSetting
                propertyName={"imageSmoothingEnabled"}
                settings={settings}
                updateSettings={updateSettings}
              />
            </SettingsSubPanel>
            <SettingsSubPanel label={i18n.get("On dataset selection")}>
              <TextField
                variant="standard"
                select
                sx={styles.textField}
                value={settings.datasetLocateMode}
                onChange={handleDatasetLocateModeChange}
                margin="normal"
              >
                {LOCATE_MODE_LABELS.map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {i18n.get(label)}
                  </MenuItem>
                ))}
              </TextField>
            </SettingsSubPanel>
            <SettingsSubPanel label={i18n.get("On place selection")}>
              <TextField
                variant="standard"
                select
                sx={styles.textField}
                value={settings.placeLocateMode}
                onChange={handlePlaceLocateModeChange}
                margin="normal"
              >
                {LOCATE_MODE_LABELS.map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {i18n.get(label)}
                  </MenuItem>
                ))}
              </TextField>
            </SettingsSubPanel>
          </SettingsPanel>

          <SettingsPanel title={i18n.get("Legal Agreement")}>
            <SettingsSubPanel
              label={i18n.get("Privacy notice")}
              value={settings.privacyNoticeAccepted ? i18n.get("Accepted") : ""}
            >
              <Button
                disabled={!settings.privacyNoticeAccepted}
                onClick={() => {
                  updateSettings({ privacyNoticeAccepted: false });
                  window.location.reload();
                }}
              >
                {i18n.get("Revoke consent")}
              </Button>
            </SettingsSubPanel>
          </SettingsPanel>

          <SettingsPanel title={i18n.get("System Information")}>
            <SettingsSubPanel
              label={`xcube Viewer ${i18n.get("version")}`}
              value={viewerVersion}
            />
            <SettingsSubPanel
              label={`xcube Server ${i18n.get("version")}`}
              value={
                serverInfo
                  ? serverInfo.version
                  : i18n.get("Cannot reach server")
              }
            />
          </SettingsPanel>
        </DialogContent>
      </Dialog>

      <Menu
        anchorEl={languageMenuAnchor}
        keepMounted
        open={Boolean(languageMenuAnchor)}
        onClose={handleLanguageMenuClose}
      >
        {localeMenuItems}
      </Menu>
    </div>
  );
};

export default SettingsDialog;

const getOnOff = (state: boolean): string => {
  return state ? i18n.get("On") : i18n.get("Off");
};

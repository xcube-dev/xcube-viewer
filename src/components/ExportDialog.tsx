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

import React, { ChangeEvent } from "react";
import { Theme } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import makeStyles from "@mui/styles/makeStyles";
import TextField from "@mui/material/TextField";

import i18n from "@/i18n";
import { ControlState } from "@/states/controlState";
import SettingsPanel from "./SettingsPanel";
import SettingsSubPanel from "./SettingsSubPanel";
import ToggleSetting from "./ToggleSetting";

const useStyles = makeStyles((theme: Theme) => ({
  separatorTextField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    fontSize: theme.typography.fontSize / 2,
    maxWidth: "6em",
  },
  fileNameTextField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    fontSize: theme.typography.fontSize / 2,
  },
}));

interface ExportDialogProps {
  open: boolean;
  closeDialog: (dialogId: string) => void;
  settings: ControlState;
  updateSettings: (settings: Partial<ControlState>) => void;
  downloadTimeSeries: () => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  closeDialog,
  settings,
  updateSettings,
  downloadTimeSeries,
}) => {
  const classes = useStyles();

  const handleCloseDialog = () => {
    closeDialog("export");
  };

  function handleFileNameChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    updateSettings({ exportFileName: event.target.value });
  }

  function handleSeparatorChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    updateSettings({ exportTimeSeriesSeparator: event.target.value });
  }

  const handleDoExport = () => {
    handleCloseDialog();
    downloadTimeSeries();
  };

  return (
    <div>
      <Dialog
        open={open}
        fullWidth
        maxWidth={"xs"}
        onClose={handleCloseDialog}
        scroll="body"
      >
        <DialogContent>
          <SettingsPanel title={i18n.get("Export Settings")}>
            <SettingsSubPanel
              label={i18n.get("Include time-series data") + " (*.txt)"}
              value={getOnOff(settings.exportTimeSeries)}
            >
              <ToggleSetting
                propertyName={"exportTimeSeries"}
                settings={settings}
                updateSettings={updateSettings}
              />
            </SettingsSubPanel>
            <SettingsSubPanel
              label={i18n.get("Separator for time-series data")}
            >
              <TextField
                variant="standard"
                className={classes.separatorTextField}
                value={settings.exportTimeSeriesSeparator}
                onChange={handleSeparatorChange}
                disabled={!settings.exportTimeSeries}
                margin="normal"
                size={"small"}
              />
            </SettingsSubPanel>
            <SettingsSubPanel
              label={i18n.get("Include places data") + " (*.geojson)"}
              value={getOnOff(settings.exportPlaces)}
            >
              <ToggleSetting
                propertyName={"exportPlaces"}
                settings={settings}
                updateSettings={updateSettings}
              />
            </SettingsSubPanel>
            <SettingsSubPanel
              label={i18n.get("Combine place data in one file")}
              value={getOnOff(settings.exportPlacesAsCollection)}
            >
              <ToggleSetting
                propertyName={"exportPlacesAsCollection"}
                settings={settings}
                updateSettings={updateSettings}
                disabled={!settings.exportPlaces}
              />
            </SettingsSubPanel>
            <SettingsSubPanel
              label={i18n.get("As ZIP archive")}
              value={getOnOff(settings.exportZipArchive)}
            >
              <ToggleSetting
                propertyName={"exportZipArchive"}
                settings={settings}
                updateSettings={updateSettings}
              />
            </SettingsSubPanel>
            <SettingsSubPanel label={i18n.get("File name")}>
              <TextField
                variant="standard"
                className={classes.fileNameTextField}
                value={settings.exportFileName}
                onChange={handleFileNameChange}
                margin="normal"
                size={"small"}
              />
            </SettingsSubPanel>
          </SettingsPanel>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDoExport} disabled={!canDownload(settings)}>
            {i18n.get("Download")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExportDialog;

const getOnOff = (state: boolean): string => {
  return state ? i18n.get("On") : i18n.get("Off");
};

const isValidFileName = (fileName: string) => {
  return /^[0-9a-zA-Z_-]+$/.test(fileName);
};

const isValidSeparator = (separator: string) => {
  return separator.toUpperCase() === "TAB" || separator.length === 1;
};

const canDownload = (settings: ControlState) => {
  return (
    (settings.exportTimeSeries || settings.exportPlaces) &&
    isValidFileName(settings.exportFileName) &&
    (!settings.exportTimeSeries ||
      isValidSeparator(settings.exportTimeSeriesSeparator))
  );
};

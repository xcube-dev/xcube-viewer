/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React, { ChangeEvent } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import ListItem from "@mui/material/ListItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import { SxProps } from "@mui/system";
import { Theme } from "@mui/material";

import i18n from "@/i18n";
import {
  ControlState,
  ExportDataType,
  ExportFormat,
  ExportTimeRange,
} from "@/states/controlState";
import SettingsPanel from "./SettingsPanel";
import SettingsSubPanel from "./SettingsSubPanel";

const styles: Record<string, SxProps<Theme>> = {
  separatorTextField: (theme) => ({
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    fontSize: theme.typography.fontSize / 2,
    maxWidth: "5rem",
  }),
  fileNameTextField: (theme) => ({
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    fontSize: theme.typography.fontSize / 2,
  }),
};

interface ExportDialogProps {
  open: boolean;
  closeDialog: (dialogId: string) => void;
  settings: ControlState;
  updateSettings: (settings: Partial<ControlState>) => void;
  downloadData: () => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  closeDialog,
  settings,
  updateSettings,
  downloadData,
}) => {
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

  function handleDataTypeChange(
    _event: React.ChangeEvent<HTMLInputElement>,
    value: string,
  ) {
    const exportDataType = value as ExportDataType;
    updateSettings({
      exportDataType,
      ...(exportDataType === "places" ? { exportFormat: "geojson" } : {}),
    });
  }

  function handleFormatChange(
    _event: React.ChangeEvent<HTMLInputElement>,
    value: string,
  ) {
    updateSettings({ exportFormat: value as ExportFormat });
  }

  function handleTimeRangeChange(
    _event: React.ChangeEvent<HTMLInputElement>,
    value: string,
  ) {
    updateSettings({ exportTimeRange: value as ExportTimeRange });
  }

  function handleZipArchiveChange(event: React.ChangeEvent<HTMLInputElement>) {
    updateSettings({ exportAsZipArchive: event.target.checked });
  }

  const handleDoExport = () => {
    handleCloseDialog();
    downloadData();
  };

  const isTimeSeriesExport = settings.exportDataType === "timeSeries";
  const exportFormat = isTimeSeriesExport ? settings.exportFormat : "geojson";
  const isTextExport = exportFormat === "text";
  const hasDisplayedTimeRange = settings.selectedTimeRange !== null;
  const exportTimeRange = hasDisplayedTimeRange
    ? settings.exportTimeRange
    : "full";

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
            <ExportOptionGroup label={i18n.get("Data")}>
              <RadioGroup
                value={settings.exportDataType}
                onChange={handleDataTypeChange}
              >
                <FormControlLabel
                  value="timeSeries"
                  label={i18n.get("Time-series data with place information")}
                  control={<Radio />}
                />
                <FormControlLabel
                  value="places"
                  label={i18n.get("Place geometries only")}
                  control={<Radio />}
                />
              </RadioGroup>
            </ExportOptionGroup>
            <ExportOptionGroup label={i18n.get("Export format")}>
              <RadioGroup value={exportFormat} onChange={handleFormatChange}>
                <FormControlLabel
                  value="text"
                  label={i18n.get("Text/CSV")}
                  control={<Radio />}
                  disabled={!isTimeSeriesExport}
                />
                <FormControlLabel
                  value="geojson"
                  label={i18n.get("GeoJSON")}
                  control={<Radio />}
                />
              </RadioGroup>
            </ExportOptionGroup>
            {isTimeSeriesExport && (
              <ExportOptionGroup label={i18n.get("Time range")}>
                <RadioGroup
                  value={exportTimeRange}
                  onChange={handleTimeRangeChange}
                >
                  <FormControlLabel
                    value="full"
                    label={i18n.get("Full time series")}
                    control={<Radio />}
                  />
                  <FormControlLabel
                    value="displayed"
                    label={i18n.get("Displayed time range")}
                    control={<Radio />}
                    disabled={!hasDisplayedTimeRange}
                  />
                </RadioGroup>
              </ExportOptionGroup>
            )}
            {isTextExport && (
              <SettingsSubPanel
                label={i18n.get("Separator for time-series data")}
              >
                <TextField
                  variant="standard"
                  sx={styles.separatorTextField}
                  value={settings.exportTimeSeriesSeparator}
                  onChange={handleSeparatorChange}
                  margin="normal"
                  size={"small"}
                />
              </SettingsSubPanel>
            )}
            <SettingsSubPanel label={i18n.get("Compress as ZIP")}>
              <Checkbox
                checked={settings.exportAsZipArchive}
                onChange={handleZipArchiveChange}
                inputProps={{ "aria-label": i18n.get("Compress as ZIP") }}
              />
            </SettingsSubPanel>
            <SettingsSubPanel label={i18n.get("File name")}>
              <TextField
                variant="standard"
                sx={styles.fileNameTextField}
                value={settings.exportFileName}
                onChange={handleFileNameChange}
                margin="normal"
                size={"small"}
              />
            </SettingsSubPanel>
          </SettingsPanel>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleDoExport}
            disabled={!canDownload(settings, isTextExport)}
          >
            {i18n.get("Download")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExportDialog;

const isValidFileName = (fileName: string) => {
  return /^[0-9a-zA-Z_-]+$/.test(fileName);
};

const isValidSeparator = (separator: string) => {
  return separator.toUpperCase() === "TAB" || separator.length === 1;
};

const canDownload = (settings: ControlState, isTextExport: boolean) => {
  return (
    isValidFileName(settings.exportFileName) &&
    (!isTextExport || isValidSeparator(settings.exportTimeSeriesSeparator))
  );
};

interface ExportOptionGroupProps {
  label: string;
  children: React.ReactNode;
}

function ExportOptionGroup({ label, children }: ExportOptionGroupProps) {
  return (
    <ListItem>
      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend">{label}</FormLabel>
        {children}
      </FormControl>
    </ListItem>
  );
}

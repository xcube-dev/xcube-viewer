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
import DialogTitle from "@mui/material/DialogTitle";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { SxProps } from "@mui/system";
import { Theme } from "@mui/material";

import i18n from "@/i18n";
import {
  ControlState,
  ExportDataType,
  ExportFormat,
  ExportTimeRange,
} from "@/states/controlState";
const styles: Record<string, SxProps<Theme>> = {
  content: (theme) => ({ paddingTop: theme.spacing(1) }),
  options: (theme) => ({ display: "grid", gap: theme.spacing(3) }),
  optionGroup: (theme) => ({ display: "grid", gap: theme.spacing(0.5) }),
  choices: (theme) => ({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
    columnGap: theme.spacing(2),
  }),
  fileOptions: (theme) => ({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
    gap: theme.spacing(2),
    alignItems: "start",
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
        <DialogTitle>{i18n.get("Export data")}</DialogTitle>
        <DialogContent sx={styles.content}>
          <Box sx={styles.options}>
            <ExportOptionGroup
              label={i18n.get("What would you like to export?")}
              helperText={i18n.get(
                "Time-series exports include values, place IDs, coordinates, and geometry.",
              )}
            >
              <RadioGroup
                value={settings.exportDataType}
                onChange={handleDataTypeChange}
                sx={styles.choices}
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
            {isTimeSeriesExport ? (
              <ExportOptionGroup label={i18n.get("File format")}>
                <RadioGroup
                  value={exportFormat}
                  onChange={handleFormatChange}
                  sx={styles.choices}
                >
                  <FormControlLabel
                    value="text"
                    label={i18n.get("Text/CSV")}
                    control={<Radio />}
                  />
                  <FormControlLabel
                    value="geojson"
                    label={i18n.get("GeoJSON")}
                    control={<Radio />}
                  />
                </RadioGroup>
              </ExportOptionGroup>
            ) : (
              <FormHelperText>
                {i18n.get("Place geometries are exported as GeoJSON.")}
              </FormHelperText>
            )}
            {isTimeSeriesExport && (
              <ExportOptionGroup label={i18n.get("Time range")}>
                <RadioGroup
                  value={exportTimeRange}
                  onChange={handleTimeRangeChange}
                  sx={styles.choices}
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
            <Box sx={styles.fileOptions}>
              <TextField
                fullWidth
                label={i18n.get("File name")}
                value={settings.exportFileName}
                onChange={handleFileNameChange}
                size="small"
                helperText={i18n.get(
                  "Use letters, numbers, hyphens, or underscores.",
                )}
              />
              {isTextExport && (
                <TextField
                  fullWidth
                  label={i18n.get("Text/CSV separator")}
                  value={settings.exportTimeSeriesSeparator}
                  onChange={handleSeparatorChange}
                  size="small"
                  helperText={i18n.get("Enter one character or TAB.")}
                />
              )}
              <FormControlLabel
                label={i18n.get("Compress as ZIP")}
                control={
                  <Checkbox
                    checked={settings.exportAsZipArchive}
                    onChange={handleZipArchiveChange}
                    inputProps={{ "aria-label": i18n.get("Compress as ZIP") }}
                  />
                }
              />
            </Box>
          </Box>
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
  helperText?: string;
  children: React.ReactNode;
}

function ExportOptionGroup({
  label,
  helperText,
  children,
}: ExportOptionGroupProps) {
  return (
    <FormControl component="fieldset" fullWidth sx={styles.optionGroup}>
      <FormLabel component="legend">{label}</FormLabel>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      {children}
    </FormControl>
  );
}

/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ControlState } from "@/states/controlState";
import ExportDialog from "./ExportDialog";

afterEach(cleanup);

function createSettings(settings: Partial<ControlState> = {}): ControlState {
  return {
    exportDataType: "timeSeries",
    exportFormat: "text",
    exportTimeRange: "full",
    exportAsZipArchive: false,
    exportTimeSeriesSeparator: "TAB",
    exportFileName: "export",
    ...settings,
  } as ControlState;
}

interface ExportDialogHarnessProps {
  initialSettings?: Partial<ControlState>;
  closeDialog?: (dialogId: string) => void;
  downloadData?: () => void;
}

function ExportDialogHarness({
  initialSettings,
  closeDialog = vi.fn(),
  downloadData = vi.fn(),
}: ExportDialogHarnessProps) {
  const [settings, setSettings] = useState(createSettings(initialSettings));
  return (
    <ExportDialog
      open={true}
      closeDialog={closeDialog}
      settings={settings}
      updateSettings={(updates) =>
        setSettings((currentSettings) => ({ ...currentSettings, ...updates }))
      }
      downloadData={downloadData}
    />
  );
}

describe("ExportDialog", () => {
  it("uses a single explicit text-format selection by default", () => {
    render(<ExportDialogHarness />);

    expect(screen.getByRole("radio", { name: "Text/CSV" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "GeoJSON" })).not.toBeChecked();
    expect(screen.getByDisplayValue("TAB")).toBeEnabled();
    expect(
      screen.getByRole("radio", { name: "Full time series" }),
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Compress as ZIP" }),
    ).not.toBeChecked();
  });

  it("hides text-only options for GeoJSON exports", () => {
    render(<ExportDialogHarness />);

    fireEvent.click(screen.getByRole("radio", { name: "GeoJSON" }));

    expect(screen.getByRole("radio", { name: "GeoJSON" })).toBeChecked();
    expect(screen.queryByDisplayValue("TAB")).not.toBeInTheDocument();
  });

  it("uses the full time series when no displayed range is available", () => {
    render(
      <ExportDialogHarness
        initialSettings={{
          exportTimeRange: "displayed",
          selectedTimeRange: null,
        }}
      />,
    );

    expect(
      screen.getByRole("radio", { name: "Full time series" }),
    ).toBeChecked();
    expect(
      screen.getByRole("radio", { name: "Displayed time range" }),
    ).toBeDisabled();
  });

  it("keeps places-only exports in GeoJSON and hides time-range controls", () => {
    render(<ExportDialogHarness />);

    fireEvent.click(
      screen.getByRole("radio", { name: "Place geometries only" }),
    );

    expect(screen.getByRole("radio", { name: "GeoJSON" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Text/CSV" })).toBeDisabled();
    expect(
      screen.queryByRole("radio", { name: "Full time series" }),
    ).not.toBeInTheDocument();
  });

  it("allows ZIP compression to be selected explicitly", () => {
    render(<ExportDialogHarness />);

    fireEvent.click(screen.getByRole("checkbox", { name: "Compress as ZIP" }));

    expect(
      screen.getByRole("checkbox", { name: "Compress as ZIP" }),
    ).toBeChecked();
  });

  it("downloads only when the file name and active options are valid", () => {
    const closeDialog = vi.fn();
    const downloadData = vi.fn();
    render(
      <ExportDialogHarness
        initialSettings={{ exportFileName: "invalid name" }}
        closeDialog={closeDialog}
        downloadData={downloadData}
      />,
    );

    expect(screen.getByRole("button", { name: "Download" })).toBeDisabled();

    fireEvent.change(screen.getByDisplayValue("invalid name"), {
      target: { value: "export" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Download" }));

    expect(closeDialog).toHaveBeenCalledWith("export");
    expect(downloadData).toHaveBeenCalledOnce();
  });
});

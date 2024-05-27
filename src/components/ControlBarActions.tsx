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

import { Theme, styled } from "@mui/system";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ToggleButton from "@mui/material/ToggleButton";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import SettingsIcon from "@mui/icons-material/Settings";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";

import i18n from "@/i18n";
import { Config } from "@/config";
import { WithLocale } from "@/util/lang";
import { LayerVisibilities } from "@/states/controlState";
import LayerSelect from "@/components/LayerSelect";
import { commonStyles } from "@/components/common-styles";

// noinspection JSUnusedLocalSymbols
const StyledFormControl = styled(FormControl)(
  ({ theme }: { theme: Theme }) => ({
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(0.5),
    marginLeft: "auto",
  }),
);

interface ControlBarActionsProps extends WithLocale {
  visible: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (sideBarOpen: boolean) => void;
  openDialog: (dialogId: string) => void;
  allowRefresh?: boolean;
  updateResources: () => void;
  compact: boolean;
  // TODO: the following are just for LayerSelect, combine
  layerTitles: Record<keyof LayerVisibilities, string>;
  layerSubtitles: Record<keyof LayerVisibilities, string>;
  layerDisablements: Record<keyof LayerVisibilities, boolean>;
  layerVisibilities: LayerVisibilities;
  setLayerVisibility: (
    layerId: keyof LayerVisibilities,
    visible: boolean,
  ) => void;
  variableCompareMode: boolean;
  setVariableCompareMode: (selected: boolean) => void;
}

export default function ControlBarActions({
  locale,
  visible,
  sidebarOpen,
  setSidebarOpen,
  openDialog,
  allowRefresh,
  updateResources,
  compact,
  // LayerSelect props
  layerTitles,
  layerSubtitles,
  layerDisablements,
  layerVisibilities,
  setLayerVisibility,
  variableCompareMode,
  setVariableCompareMode,
}: ControlBarActionsProps) {
  if (!visible) {
    return null;
  }

  const layerSelect = (
    <LayerSelect
      locale={locale}
      openDialog={openDialog}
      layerTitles={layerTitles}
      layerSubtitles={layerSubtitles}
      layerDisablements={layerDisablements}
      layerVisibilities={layerVisibilities}
      setLayerVisibility={setLayerVisibility}
      variableCompareMode={variableCompareMode}
      setVariableCompareMode={setVariableCompareMode}
    />
  );

  const sidebarButton = (
    <ToggleButton
      value={"sidebar"}
      selected={sidebarOpen}
      onClick={() => setSidebarOpen(!sidebarOpen)}
      size="small"
      sx={commonStyles.toggleButton}
    >
      <Tooltip arrow title={i18n.get("Show or hide sidebar")}>
        {<ViewSidebarIcon />}
      </Tooltip>
    </ToggleButton>
  );

  let refreshButton;
  let downloadButton;
  let settingsButton;

  if (compact) {
    refreshButton = allowRefresh && (
      <IconButton onClick={updateResources} size="small">
        <Tooltip arrow title={i18n.get("Refresh")}>
          <RefreshIcon />
        </Tooltip>
      </IconButton>
    );

    downloadButton = Config.instance.branding.allowDownloads && (
      <IconButton onClick={() => openDialog("export")} size="small">
        <Tooltip arrow title={i18n.get("Export data")}>
          {<CloudDownloadIcon />}
        </Tooltip>
      </IconButton>
    );

    settingsButton = (
      <IconButton onClick={() => openDialog("settings")} size="small">
        <Tooltip arrow title={i18n.get("Settings")}>
          <SettingsIcon />
        </Tooltip>
      </IconButton>
    );
  }

  return (
    <StyledFormControl variant="standard">
      <Box>
        {refreshButton}
        {downloadButton}
        {settingsButton}
        {layerSelect}
        {sidebarButton}
      </Box>
    </StyledFormControl>
  );
}

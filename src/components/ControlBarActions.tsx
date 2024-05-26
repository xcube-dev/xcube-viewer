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
import { commonStyles } from "@/components/common-styles";
import LayersIcon from "@mui/icons-material/Layers";

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
  layerMenuOpen: boolean;
  setLayerMenuOpen: (layerMenuOpen: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (sideBarOpen: boolean) => void;
  openDialog: (dialogId: string) => void;
  allowRefresh?: boolean;
  updateResources: () => void;
  compact: boolean;
}

export default function ControlBarActions({
  visible,
  layerMenuOpen,
  setLayerMenuOpen,
  sidebarOpen,
  setSidebarOpen,
  openDialog,
  allowRefresh,
  updateResources,
  compact,
}: ControlBarActionsProps) {
  if (!visible) {
    return null;
  }

  const layersButton = (
    <ToggleButton
      value="open"
      selected={layerMenuOpen}
      onClick={() => setLayerMenuOpen(!layerMenuOpen)}
      size="small"
      sx={commonStyles.toggleButton}
    >
      <Tooltip arrow title={i18n.get("Layer visibilities")}>
        <LayersIcon />
      </Tooltip>
    </ToggleButton>
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
        {layersButton}
        {sidebarButton}
      </Box>
    </StyledFormControl>
  );
}

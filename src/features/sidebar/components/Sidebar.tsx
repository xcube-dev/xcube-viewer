// noinspection JSUnusedLocalSymbols

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

import { ReactElement } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import InfoIcon from "@mui/icons-material/Info";
import FunctionsIcon from "@mui/icons-material/Functions";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";

import i18n from "@/i18n";
import { makeStyles } from "@/util/styles";
import InfoPanel from "@/connected/InfoPanel";
import StatisticsPanel from "@/connected/StatisticsPanel";
import TimeSeriesPanel from "@/connected/TimeSeriesPanel";
import VolumePanel from "@/connected/VolumePanel";
import { setSidebarPanelId } from "@/features/sidebar/actions";
import { store } from "@/store/appStore";
import { SidebarPanelId, sidebarPanelIds } from "@/features/sidebar/types";
import { registerSlice } from "@/store/registerSlices";
import {
  controlSidebar3Slice,
  controlSidebar4Slice,
  controlSidebarSlice,
  dataSidebar2Slice,
} from "@/features/sidebar/slice/sidebar";

const sidebarPanelIcons: Record<SidebarPanelId, ReactElement> = {
  info: <InfoIcon fontSize="inherit" />,
  timeSeries: <StackedLineChartIcon fontSize="inherit" />,
  stats: <FunctionsIcon fontSize="inherit" />,
  volume: <ThreeDRotationIcon fontSize="inherit" />,
};

const sidebarPanelLabels: Record<SidebarPanelId, string> = {
  info: "Info",
  timeSeries: "Time-Series",
  stats: "Statistics",
  volume: "Volume",
};

const styles = makeStyles({
  tabs: { minHeight: "34px" },
  tab: {
    padding: "5px 10px",
    textTransform: "none",
    fontWeight: "regular",
    minHeight: "32px",
  },
  tabBoxHeader: {
    borderBottom: 1,
    borderColor: "divider",
    position: "sticky",
    top: 0,
    zIndex: 1100,
    backgroundColor: "background.paper",
  },
});

registerSlice(controlSidebarSlice);
// For testing - To be removed
registerSlice(dataSidebar2Slice);
registerSlice(controlSidebar3Slice);
registerSlice(controlSidebar4Slice);

function Sidebar() {
  const sidebarPanelId = store((state) => state.controlState.sidebarPanelId);
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={styles.tabBoxHeader}>
        <Tabs
          value={sidebarPanelId}
          onChange={(_, value) => {
            setSidebarPanelId(value as SidebarPanelId);
          }}
          variant="scrollable"
          sx={styles.tabs}
        >
          {sidebarPanelIds.map((panelId) => (
            <Tab
              key={panelId}
              icon={sidebarPanelIcons[panelId]}
              iconPosition="start"
              sx={styles.tab}
              disableRipple
              value={panelId}
              label={i18n.get(sidebarPanelLabels[panelId])}
            />
          ))}
        </Tabs>
      </Box>
      {sidebarPanelId === "info" && <InfoPanel />}
      {sidebarPanelId === "stats" && <StatisticsPanel />}
      {sidebarPanelId === "timeSeries" && <TimeSeriesPanel />}
      {sidebarPanelId === "volume" && <VolumePanel />}
    </Box>
  );
}

export default Sidebar;

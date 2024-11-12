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

import { ReactElement, SyntheticEvent, useCallback, useMemo } from "react";
import { connect } from "react-redux";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import InfoIcon from "@mui/icons-material/Info";
import FunctionsIcon from "@mui/icons-material/Functions";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";
import {
  type ContributionState,
  updateContributionContainer,
  useContributionsRecord,
} from "chartlets";

import { AppState } from "@/states/appState";
import i18n from "@/i18n";
import { makeStyles } from "@/util/styles";
import { setSidebarPanelId } from "@/actions/controlActions";
import { SidebarPanelId, sidebarPanelIds } from "@/states/controlState";
import ContributedPanel from "@/components/ContributedPanel";
import InfoPanel from "./InfoPanel";
import TimeSeriesPanel from "./TimeSeriesPanel";
import StatisticsPanel from "./StatisticsPanel";
import VolumePanel from "./VolumePanel";

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

interface SidebarPanelContributionProps {
  title: string;
  visible?: boolean;
}

interface SidebarProps {
  sidebarPanelId: SidebarPanelId | string;
  setSidebarPanelId: (sidebarPanelId: SidebarPanelId | string) => void;
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
  return {
    sidebarPanelId: state.controlState.sidebarPanelId,
  };
};

const mapDispatchToProps = {
  setSidebarPanelId,
};

function _Sidebar({ sidebarPanelId, setSidebarPanelId }: SidebarProps) {
  const contributionsRecord = useContributionsRecord();
  const panelContributions = useMemo(
    () =>
      (contributionsRecord["panels"] ||
        []) as ContributionState<SidebarPanelContributionProps>[],
    [contributionsRecord],
  );

  const contributionIndexes = useMemo(
    () =>
      panelContributions.reduce((map, contribution, contribIndex) => {
        map.set(contribution.name, contribIndex);
        return map;
      }, new Map<string, number>()),
    [panelContributions],
  );

  const handleTabChange = useCallback(
    (_: SyntheticEvent, value: SidebarPanelId | string) => {
      setSidebarPanelId(value);
      const contribIndex = contributionIndexes.get(value);
      if (typeof contribIndex === "number") {
        updateContributionContainer("panels", contribIndex, {
          visible: true,
        });
      }
    },
    [contributionIndexes, setSidebarPanelId],
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={styles.tabBoxHeader}>
        <Tabs
          value={sidebarPanelId}
          onChange={handleTabChange}
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
          {panelContributions.map((contribution) => (
            <Tab
              key={contribution.name}
              sx={styles.tab}
              disableRipple
              value={contribution.name}
              label={contribution.container.title}
            />
          ))}
        </Tabs>
      </Box>
      {sidebarPanelId === "info" && <InfoPanel />}
      {sidebarPanelId === "stats" && <StatisticsPanel />}
      {sidebarPanelId === "timeSeries" && <TimeSeriesPanel />}
      {sidebarPanelId === "volume" && <VolumePanel />}
      {panelContributions.map(
        (contribution, panelIndex) =>
          sidebarPanelId === contribution.name && (
            <ContributedPanel
              key={contribution.name}
              contribution={contribution}
              panelIndex={panelIndex}
            />
          ),
      )}
    </Box>
  );
}

const Sidebar = connect(mapStateToProps, mapDispatchToProps)(_Sidebar);
export default Sidebar;

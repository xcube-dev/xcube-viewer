/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

// noinspection JSUnusedLocalSymbols

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

import { type AppState } from "@/states/appState";
import i18n from "@/i18n";
import { makeStyles } from "@/util/styles";
import { setSidebarPanelId } from "@/actions/controlActions";
import { type SidebarPanelId, sidebarPanelIds } from "@/states/controlState";
import ContributedPanel, {
  type ContributedPanelState,
} from "@/ext/components/ContributedPanel";
import InfoPanel from "./InfoPanel";
import TimeSeriesPanel from "./TimeSeriesPanel";
import StatisticsPanel from "./StatisticsPanel";
import VolumePanel from "./VolumePanel";

interface PanelInfo extends ContributedPanelState {
  id: string;
  icon?: ReactElement;
}

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
        []) as ContributionState<ContributedPanelState>[],
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

  const panelInfos = useMemo(() => {
    const map = new Map<string, PanelInfo>();
    map.set("info", <InfoPanel />);
    map.set("stats", <StatisticsPanel />);
    map.set("timeSeries", <TimeSeriesPanel />);
    map.set("volume", <VolumePanel />);
    {
      panelContributions.map(
        (contribution, panelIndex) =>
          sidebarPanelId === contribution.name && (
            <ContributedPanel
              key={contribution.name}
              contribution={contribution}
              panelIndex={panelIndex}
            />
          ),
      );
    }
    return map;
  }, []);

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

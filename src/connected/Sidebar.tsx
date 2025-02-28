/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

// noinspection JSUnusedLocalSymbols

import { useCallback, useMemo } from "react";
import { connect } from "react-redux";
import InfoIcon from "@mui/icons-material/Info";
import FunctionsIcon from "@mui/icons-material/Functions";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";
import {
  type ContributionState,
  updateContributionContainer,
  useContributionsRecord,
} from "chartlets";

import i18n from "@/i18n";
import { type AppState } from "@/states/appState";
import { setSidebarPanelId } from "@/actions/controlActions";
import ContributedPanel from "@/ext/components/ContributedPanel";
import SidePanel, { type PanelModel } from "@/components/SidePanel";
import { isNumber } from "@/util/types";
import InfoPanel from "./InfoPanel";
import TimeSeriesPanel from "./TimeSeriesPanel";
import StatisticsPanel from "./StatisticsPanel";
import VolumePanel from "./VolumePanel";

const basePanels: PanelModel[] = [
  {
    id: "info",
    title: i18n.get("Info"),
    icon: <InfoIcon />,
    content: <InfoPanel />,
    visible: true,
  },
  {
    id: "timeSeries",
    title: i18n.get("Time-Series"),
    icon: <StackedLineChartIcon />,
    content: <TimeSeriesPanel />,
    visible: true,
  },
  {
    id: "stats",
    title: i18n.get("Statistics"),
    icon: <FunctionsIcon />,
    content: <StatisticsPanel />,
    visible: true,
  },
  {
    id: "volume",
    title: i18n.get("Volume"),
    icon: <ThreeDRotationIcon />,
    content: <VolumePanel />,
    visible: true,
  },
];

interface SidebarProps {
  sidebarPanelId: string | null;
  setSidebarPanelId: (sidebarPanelId: string | null) => void;
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
      (contributionsRecord["panels"] || []) as ContributionState<PanelModel>[],
    [contributionsRecord],
  );

  const contributedPanels = useMemo((): PanelModel[] => {
    return panelContributions.map((contribution, panelIndex) => ({
      ...contribution.container,
      id: contribution.name,
      content: (
        <ContributedPanel
          key={contribution.name}
          contribution={contribution}
          panelIndex={panelIndex}
        />
      ),
    }));
  }, [panelContributions]);

  const contributedPanelsMap = useMemo(() => {
    const panelMap = new Map<string, number>();
    contributedPanels.forEach((panel: PanelModel, panelIndex) => {
      panelMap.set(panel.id, panelIndex);
    });
    return panelMap;
  }, [contributedPanels]);

  const _setSidebarPanelId = useCallback(
    (value: string | null) => {
      setSidebarPanelId(value);
      if (value !== null) {
        const contribIndex = contributedPanelsMap.get(value);
        if (isNumber(contribIndex)) {
          updateContributionContainer("panels", contribIndex, {
            visible: true,
          });
        }
      }
    },
    [contributedPanelsMap, setSidebarPanelId],
  );

  const panels = useMemo((): PanelModel[] => {
    return [...basePanels, ...contributedPanels];
  }, [contributedPanels]);

  return (
    <SidePanel
      panels={panels}
      selectedPanelId={sidebarPanelId}
      setSelectedPanelId={_setSidebarPanelId}
    />
  );
}

const Sidebar = connect(mapStateToProps, mapDispatchToProps)(_Sidebar);
export default Sidebar;

/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useEffect, useMemo } from "react";
import { connect } from "react-redux";
import DetailsIcon from "@mui/icons-material/Details";
import FunctionsIcon from "@mui/icons-material/Functions";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";
import {
  type ContributionState,
  updateContributionContainer,
  useContributionsRecord,
} from "chartlets";

import i18n from "@/i18n";
import type { WithLocale } from "@/util/lang";
import type { AppState } from "@/states/appState";
import { setSidePanelId } from "@/actions/controlActions";
import ContributedPanel from "@/ext/components/ContributedPanel";
import SidePanel, { type PanelModel } from "@/components/SidePanel";
import InfoPanel from "./InfoPanel";
import TimeSeriesPanel from "./TimeSeriesPanel";
import StatisticsPanel from "./StatisticsPanel";
import VolumePanel from "./VolumePanel";
import { Config } from "@/config";

const getBasePanels = (_locale?: string): PanelModel[] => [
  {
    id: "details",
    title: i18n.get("Details"),
    icon: <DetailsIcon />,
    content: <InfoPanel />,
  },
  {
    id: "timeSeries",
    title: i18n.get("Time-Series"),
    icon: <StackedLineChartIcon />,
    content: <TimeSeriesPanel />,
  },
  {
    id: "stats",
    title: i18n.get("Statistics"),
    icon: <FunctionsIcon />,
    content: <StatisticsPanel />,
  },
  {
    id: "volume",
    title: i18n.get("Volume"),
    icon: <ThreeDRotationIcon />,
    content: <VolumePanel />,
  },
];

interface SidePanelImplProps extends WithLocale {
  sidebarPanelId: string | null;
  setSidebarPanelId: (sidebarPanelId: string | null) => void;
  allow3D?: boolean;
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    sidebarPanelId: state.controlState.sidePanelId,
    allow3D: Config.instance.branding.allow3D,
  };
};

// noinspection JSUnusedGlobalSymbols
const mapDispatchToProps = {
  setSidebarPanelId: setSidePanelId,
};

function SidePanelImpl({
  locale,
  sidebarPanelId,
  setSidebarPanelId,
  allow3D,
}: SidePanelImplProps) {
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

  // Get a mapping from panel ID to index into the array of server-side panels.
  const contributedPanelsMap = useMemo(() => {
    const panelMap = new Map<string, number>();
    contributedPanels.forEach((panel: PanelModel, panelIndex) => {
      panelMap.set(panel.id, panelIndex);
    });
    return panelMap;
  }, [contributedPanels]);

  // Load the panel's user interface
  useEffect(() => {
    if (sidebarPanelId && contributedPanelsMap.has(sidebarPanelId)) {
      const contribIndex = contributedPanelsMap.get(sidebarPanelId)!;
      const panelModel = contributedPanels[contribIndex];
      if (!panelModel.componentRequested) {
        // This will trigger loading the server-side
        // UI component from endpoint /viewer/ext/layout
        updateContributionContainer<PanelModel>(
          "panels",
          contribIndex,
          {
            componentRequested: true,
          },
          /*requireComponent =*/ true,
        );
      }
    }
  }, [sidebarPanelId, contributedPanels, contributedPanelsMap]);

  // Get the viewer's internationalized base panels.
  const basePanels = useMemo((): PanelModel[] => {
    return getBasePanels(locale);
  }, [locale]);

  // Get the combined base panels and server-side panels.
  const panels = useMemo((): PanelModel[] => {
    return [...basePanels, ...contributedPanels];
  }, [basePanels, contributedPanels]);

  return (
    <SidePanel
      panels={panels}
      selectedPanelId={sidebarPanelId}
      setSelectedPanelId={setSidebarPanelId}
      allow3D={allow3D ?? true}
    />
  );
}

const SidePanelConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SidePanelImpl);
export default SidePanelConnected;

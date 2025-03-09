/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

// noinspection JSUnusedLocalSymbols

import { useCallback, useMemo } from "react";
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
import { isNumber } from "@/util/types";
import { WithLocale } from "@/util/lang";
import { type AppState } from "@/states/appState";
import { setSidePanelId } from "@/actions/controlActions";
import ContributedPanel from "@/ext/components/ContributedPanel";
import SidePanel, { type PanelModel } from "@/components/SidePanel";
import InfoPanel from "./InfoPanel";
import TimeSeriesPanel from "./TimeSeriesPanel";
import StatisticsPanel from "./StatisticsPanel";
import VolumePanel from "./VolumePanel";

const getBasePanels = (_locale?: string): PanelModel[] => [
  {
    id: "details",
    title: i18n.get("Details"),
    icon: <DetailsIcon />,
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

interface SidePanelImplProps extends WithLocale {
  sidebarPanelId: string | null;
  setSidebarPanelId: (sidebarPanelId: string | null) => void;
}

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    sidebarPanelId: state.controlState.sidePanelId,
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

  const basePanels = useMemo((): PanelModel[] => {
    return getBasePanels(locale);
  }, [locale]);

  const panels = useMemo((): PanelModel[] => {
    return [...basePanels, ...contributedPanels];
  }, [basePanels, contributedPanels]);

  return (
    <SidePanel
      panels={panels}
      selectedPanelId={sidebarPanelId}
      setSelectedPanelId={_setSidebarPanelId}
    />
  );
}

const SidePanelConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SidePanelImpl);
export default SidePanelConnected;

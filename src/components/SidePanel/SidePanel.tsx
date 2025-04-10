/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useMemo } from "react";
import Box from "@mui/material/Box";

import type { PanelModel } from "./panelModel";
import styles from "./styles";
import Sidebar from "./Sidebar";
import SidePanelHeader from "./SidePanelHeader";
import SidePanelContent from "./SidePanelContent";

export interface SidePanelProps {
  width?: number | string;
  height?: number | string;
  panels?: PanelModel[];
  selectedPanelId?: string | null;
  setSelectedPanelId: (panelId: string | null) => void;
  allow3D?: boolean;
}

function SidePanel({
  width,
  height,
  panels,
  selectedPanelId,
  setSelectedPanelId,
  allow3D,
}: SidePanelProps) {
  const selectedPanel = useMemo(() => {
    return panels && panels.find((p) => p.id === selectedPanelId);
  }, [panels, selectedPanelId]);
  return (
    <Box
      width={width || "100%"}
      height={height || "100%"}
      sx={styles.mainContainer}
    >
      {selectedPanelId && (
        <Box sx={styles.panelContainer}>
          <SidePanelHeader selectedPanel={selectedPanel} />
          <SidePanelContent selectedPanel={selectedPanel} />
        </Box>
      )}
      <Sidebar
        panels={panels}
        selectedPanelId={selectedPanelId}
        setSelectedPanelId={setSelectedPanelId}
        allow3D={allow3D}
      />
    </Box>
  );
}

export default SidePanel;

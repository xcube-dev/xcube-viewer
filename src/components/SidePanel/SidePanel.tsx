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
  hidden?: boolean;
  panels?: PanelModel[];
  selectedPanelId?: string | null;
  setSelectedPanelId: (panelId: string | null) => void;
}

function SidePanel({
  hidden,
  panels,
  selectedPanelId,
  setSelectedPanelId,
}: SidePanelProps) {
  const selectedPanel = useMemo(() => {
    return (panels && panels.find((p) => p.id === selectedPanelId)) || null;
  }, [panels, selectedPanelId]);
  if (hidden) {
    return null;
  }
  return (
    <Box width="100%" height="100%" sx={styles.mainContainer}>
      {selectedPanel && (
        <Box sx={styles.panelContainer}>
          <SidePanelHeader selectedPanel={selectedPanel} />
          <SidePanelContent selectedPanel={selectedPanel} />
        </Box>
      )}
      <Sidebar
        panels={panels}
        selectedPanelId={selectedPanelId}
        setSelectedPanelId={setSelectedPanelId}
      />
    </Box>
  );
}

export default SidePanel;

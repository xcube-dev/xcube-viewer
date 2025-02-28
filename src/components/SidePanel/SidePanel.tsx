/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useMemo } from "react";
import Box from "@mui/material/Box";

import type { PanelModel } from "@/components/SidePanel/panel";
import Sidebar from "./Sidebar";
import { makeStyles } from "@/util/styles";

const styles = makeStyles({
  mainContainer: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
  },
  panelContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  panelHeader: {},
  panelContent: {},
});

export interface SidePanelProps {
  hidden?: boolean;
  width?: number;
  panels?: PanelModel[];
  selectedPanelId?: string | null;
  setSelectedPanelId: (panelId: string | null) => void;
}

function SidePanel({
  hidden,
  width,
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
    <Box width={width} height="100%" sx={styles.mainContainer}>
      {selectedPanel && (
        <Box sx={styles.panelContainer}>
          <Box sx={styles.panelHeader}>{selectedPanel.title}</Box>
          <Box sx={styles.panelContainer}>{selectedPanel.content}</Box>
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

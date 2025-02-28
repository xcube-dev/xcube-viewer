/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import type { PanelModel } from "./panelModel";
import styles from "./styles";
import Sidebar from "./Sidebar";

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
          <Box sx={styles.panelHeader}>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              sx={{ fontWeight: "bold" }}
            >
              {selectedPanel.title}
            </Typography>
          </Box>
          <Box sx={styles.panelContent}>{selectedPanel.content}</Box>
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

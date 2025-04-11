/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useMemo } from "react";
import Box from "@mui/material/Box";

import ToolButton from "@/components/ToolButton";
import { type PanelModel, getEffectivePanelModels } from "./panelModel";
import styles from "./styles";

export interface SidebarProps {
  hidden?: boolean;
  panels?: PanelModel[];
  selectedPanelId?: string | null;
  setSelectedPanelId: (panelId: string | null) => void;
}

function Sidebar({
  hidden,
  panels,
  selectedPanelId,
  setSelectedPanelId,
}: SidebarProps) {
  const effectivePanels = useMemo(() => {
    return getEffectivePanelModels(panels || []);
  }, [panels]);

  if (hidden) {
    return null;
  }
  return (
    <Box sx={styles.sidebarContainer}>
      {effectivePanels.map((p) => (
        <ToolButton
          key={p.id}
          sx={
            p.id === selectedPanelId
              ? styles.sidebarButtonSelected
              : styles.sidebarButton
          }
          disabled={p.disabled}
          icon={p.icon}
          tooltipText={p.tooltip || p.title}
          tooltipPlacement={"left"}
          selected={p.id === selectedPanelId}
          onClick={() =>
            setSelectedPanelId(p.id !== selectedPanelId ? p.id : null)
          }
        />
      ))}
    </Box>
  );
}

export default Sidebar;

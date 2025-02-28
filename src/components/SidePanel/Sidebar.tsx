/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useMemo } from "react";
import type { SxProps, Theme } from "@mui/material";
import Box from "@mui/material/Box";

import ToolButton from "@/components/ToolButton";
import { comparePanelModels, PanelModel } from "./panel";

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
    return (panels || [])
      .filter((p) => p.visible && p.content)
      .sort(comparePanelModels);
  }, [panels]);

  if (hidden) {
    return null;
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.2,
        height: "100%",
      }}
    >
      {effectivePanels.map((p) => (
        <ToolButton
          key={p.id}
          sx={
            ((theme: Theme) => {
              return {
                color:
                  p.id === selectedPanelId
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                background:
                  p.id === selectedPanelId
                    ? theme.palette.action.selected
                    : undefined,
              };
            }) as SxProps
          }
          disabled={p.disabled}
          icon={p.icon}
          tooltipText={p.tooltip || p.title}
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

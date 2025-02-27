/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { type ReactElement, useMemo } from "react";
import type { SxProps, Theme } from "@mui/material";
import Box from "@mui/material/Box";

import { isNumber, isString } from "@/util/types";
import ToolButton from "@/components/ToolButton";

export interface PanelInfo {
  id: string;
  title: string;
  disabled?: boolean;
  visible?: boolean;
  icon: ReactElement | string;
  tooltip?: string;
  position?: number;
  after?: number | string;
  before?: number | string;
}

export interface SidepanelProps {
  hidden?: boolean;
  panelInfos?: PanelInfo[];
  selectedPanelId?: string | null;
  setSelectedPanelId: (panelId: string | null) => void;
}

function Sidepanel({
  hidden,
  panelInfos,
  selectedPanelId,
  setSelectedPanelId,
}: SidepanelProps) {
  const effectivePanelInfos = useMemo(() => {
    return (panelInfos || []).filter((p) => p.visible).sort(comparePanelInfos);
  }, [panelInfos]);

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
      {effectivePanelInfos.map((p) => (
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

export default Sidepanel;

function comparePanelInfos(p1: PanelInfo, p2: PanelInfo): number {
  if (isString(p1.before) && p1.before === p2.id) {
    return 1;
  }
  if (isString(p2.before) && p2.before === p1.id) {
    return -1;
  }
  if (isString(p2.after) && p2.after === p1.id) {
    return 1;
  }
  if (isString(p1.after) && p1.after === p2.id) {
    return -1;
  }
  if (isNumber(p1.position) && isNumber(p2.position)) {
    const value = p1.position - p2.position;
    if (value !== 0) {
      return value;
    }
  }
  const value = p1.title.localeCompare(p2.title);
  return value === 0 ? p1.id.localeCompare(p2.id) : value;
}

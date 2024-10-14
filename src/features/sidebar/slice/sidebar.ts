import { ControlState } from "@/states/controlState";

export type SidebarPanelId = "info" | "timeSeries" | "stats" | "volume";
export const sidebarPanelIds: SidebarPanelId[] = [
  "info",
  "timeSeries",
  "stats",
  "volume",
];

export const createSidebarSlice: Partial<ControlState> = {
  sidebarPanelId: "info",
};

export const SET_SIDEBAR_PANEL_ID = "SET_SIDEBAR_PANEL_ID";

export interface SetSidebarPanelId {
  type: typeof SET_SIDEBAR_PANEL_ID;
  sidebarPanelId: SidebarPanelId;
}

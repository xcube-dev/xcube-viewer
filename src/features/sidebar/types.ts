export type SidebarPanelId = "info" | "timeSeries" | "stats" | "volume";

export const sidebarPanelIds: SidebarPanelId[] = [
  "info",
  "timeSeries",
  "stats",
  "volume",
];

export interface SidebarState {
  sidebarPanelId: SidebarPanelId;
}

import { type SidebarPanelId, sidebarPanelIds } from "./types";
import { sidebarStore } from "./store";

export const setSidebarPanelId = (panelId: SidebarPanelId): void => {
  if (
    sidebarPanelIds.includes(panelId) &&
    sidebarStore.getState().sidebarPanelId !== panelId
  ) {
    sidebarStore.setState({ sidebarPanelId: panelId });
    sidebarStore.persistState();
  }
};

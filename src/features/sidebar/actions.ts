import { SidebarPanelId } from "@/features/sidebar/types";
import { AppStoreZ } from "@/features/sidebar/store";

export const setSidebarPanelId = (panelId: SidebarPanelId): void => {
  AppStoreZ.setState({
    sidebarPanelId: panelId,
  });
};

import { create } from "zustand";
import { SidebarPanelId } from "@/features/sidebar/types";

export interface StoreState {
  sidebarPanelId: SidebarPanelId;
}

export const AppStoreZ = create<StoreState>(() => ({
  sidebarPanelId: "info",
}));

import { registerFeature } from "@/store";
import { type SidebarState } from "./types";

const initialState: SidebarState = {
  sidebarPanelId: "info",
};

export const sidebarStore = registerFeature<SidebarState>({
  name: "sidebar",
  initialState,
  loadState: (storage) => {
    const state: SidebarState = { ...initialState };
    storage.getStringProperty("sidebarPanelId", state, initialState);
    return state;
  },
  saveState: (storage) => {
    try {
      storage.setPrimitiveProperty("sidebarPanelId", sidebarStore.getState());
    } catch (e) {
      console.warn(`failed to save : ${e}`);
    }
  },
});

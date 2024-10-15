import { Slice } from "@/store/appStore";

export const createControlSidebarSlice: Slice = {
  sidebarPanelId: "info",
  sidebarOpen: false,
  type: "control",
};

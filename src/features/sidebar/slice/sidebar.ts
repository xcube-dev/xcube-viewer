import { Slice } from "@/store/registerSlices";

export const createControlSidebarSlice: Slice = {
  sidebarPanelId: "info",
  sidebarOpen: false,
  type: "control",
};

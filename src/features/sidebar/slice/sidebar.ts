import { Slice } from "@/store/registerSlices";

export const controlSidebarSlice: Slice = {
  sidebarPanelId: "info",
  sidebarOpen: false,
  type: "control",
};

// These are just for testing, to be removed later
export const dataSidebar2Slice: Slice = {
  type: "data",
};
export const controlSidebar3Slice: Slice = {
  selectedDatasetId: "2",
  type: "control",
};
export const controlSidebar4Slice: Slice = {
  sidebarPosition: 7,
  type: "control",
};

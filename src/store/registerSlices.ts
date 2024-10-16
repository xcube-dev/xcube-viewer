import { registerSlice } from "@/store/appStore";
import { createControlSidebarSlice } from "@/features/sidebar/slice/sidebar";
import { ControlState } from "@/states/controlState";
import { DataState } from "@/states/dataState";

// These are just for testing, to be removed later
export const createDataSidebar2Slice: Slice = {
  type: "data",
};
export const createControlSidebar3Slice: Slice = {
  selectedDatasetId: "2",
  type: "control",
};
export const createControlSidebar4Slice: Slice = {
  sidebarPosition: 7,
  type: "control",
};

export interface SliceType {
  type: "control" | "data";
}

export type Slice = (Partial<ControlState> | Partial<DataState>) & SliceType;

const registerAllSlices = (): void => {
  registerSlice(createControlSidebarSlice);

  // For testing - To be removed
  registerSlice(createDataSidebar2Slice);
  registerSlice(createControlSidebar3Slice);
  registerSlice(createControlSidebar4Slice);
};

export default registerAllSlices;

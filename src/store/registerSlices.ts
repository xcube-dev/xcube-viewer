import { registerSlice, Slice } from "@/store/appStore";
import { createControlSidebarSlice } from "@/features/sidebar/slice/sidebar";

// This is just for testing, to be removed later
export const createSidebar2Slice: Slice = {
  type: "data",
};

export interface SliceType {
  type: "control" | "data";
}

const registerAllSlices = (): void => {
  registerSlice(createControlSidebarSlice);
  registerSlice(createSidebar2Slice);
};

export default registerAllSlices;

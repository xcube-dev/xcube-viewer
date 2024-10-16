import { controlSidebarSlice } from "@/features/sidebar/slice/sidebar";
import { ControlState } from "@/states/controlState";
import { DataState } from "@/states/dataState";
import { StoreState } from "@/store/store";

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

export const sliceRegistry: Slice[] = [];

const registerSlice = (slice: Slice) => {
  sliceRegistry.push(slice);
};

export interface SliceType {
  type: "control" | "data";
}

export type Slice = (Partial<ControlState> | Partial<DataState>) & SliceType;

export const registerAllSlices = (): void => {
  registerSlice(controlSidebarSlice);

  // For testing - To be removed
  registerSlice(dataSidebar2Slice);
  registerSlice(controlSidebar3Slice);
  registerSlice(controlSidebar4Slice);
};

export const combineSlices = (): StoreState => {
  const combinedState: StoreState = {
    controlState: {},
    dataState: {},
  };

  registerAllSlices();
  sliceRegistry.forEach((slice) => {
    const { type: _type, ...remainingSlice } = slice;
    if (slice.type === "control") {
      combinedState.controlState = {
        ...combinedState.controlState,
        ...remainingSlice,
      };
      combinedState.controlState;
    } else if (slice.type === "data") {
      combinedState.dataState = {
        ...combinedState.dataState,
        ...remainingSlice,
      };
    }
  });
  return combinedState;
};

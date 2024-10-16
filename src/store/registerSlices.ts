import { ControlState } from "@/states/controlState";
import { DataState } from "@/states/dataState";
import { store } from "@/store/appStore";

export interface SliceType {
  type: "control" | "data";
}

export type Slice = (Partial<ControlState> | Partial<DataState>) & SliceType;

export const registerSlice = (slice: Slice) => {
  if (slice.type == "control") {
    store.setState((state) => ({
      ...state,
      ["controlState"]: {
        ...state.controlState,
        ...slice,
      },
    }));
  }
};

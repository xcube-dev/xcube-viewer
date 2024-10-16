import { ControlState } from "@/states/controlState";
import { DataState } from "@/states/dataState";
import { store } from "@/store/appStore";

export interface SliceType {
  type: "control" | "data";
}

export type Slice = (Partial<ControlState> | Partial<DataState>) & SliceType;

export const registerSlice = (slice: Slice) => {
  const { type: _type, ...remainingSlice } = slice;
  if (slice.type == "control") {
    store.setState((state) => ({
      ...state,
      ["controlState"]: {
        ...state.controlState,
        ...remainingSlice,
      },
    }));
  } else if (slice.type == "data") {
    store.setState((state) => ({
      ...state,
      ["dataState"]: {
        ...state.dataState,
        ...remainingSlice,
      },
    }));
  }
};

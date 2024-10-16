import { create } from "zustand";
import { ControlState } from "@/states/controlState";
import { DataState } from "@/states/dataState";
import registerAllSlices, { Slice } from "@/store/registerSlices";

const sliceRegistry: Slice[] = [];

export const registerSlice = (slice: Slice) => {
  sliceRegistry.push(slice);
};

export interface zAppStore {
  controlState: Partial<ControlState>;
  dataState: Partial<DataState>;
}

const combineSlices = (): zAppStore => {
  const combinedState: zAppStore = {
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

export const usezAppStore = create<zAppStore>(() => combineSlices());

const state = usezAppStore.getState();
console.log(state);

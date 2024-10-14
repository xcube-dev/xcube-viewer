import { create } from "zustand";
import registerAllSlices from "@/store/registerSlices";
import { ControlState } from "@/states/controlState";

type Slice<T extends object> = T;

const sliceRegistry: Slice<object>[] = [];

export const registerSlice = <T extends object>(slice: Slice<T>) => {
  sliceRegistry.push(slice);
};

export interface zAppStore {
  controlState: Partial<ControlState>;
}

const combineSlices = () => {
  const combinedState: zAppStore = {
    controlState: {},
  };
  registerAllSlices();
  console.log("sliceRegistry", sliceRegistry);
  sliceRegistry.forEach((slice) => {
    console.log("slice::", slice);
    combinedState.controlState = slice;
  });
  console.log("combinedState", combinedState);
  return combinedState;
};

export const usezAppStore = create<zAppStore>(() => combineSlices());

const state = usezAppStore.getState();
console.log(state);

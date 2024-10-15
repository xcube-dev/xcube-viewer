import { create } from "zustand";
import { ControlState } from "@/states/controlState";
import { DataState } from "@/states/dataState";
import registerAllSlices, { SliceType } from "@/store/registerSlices";

export type Slice = (Partial<ControlState> | Partial<DataState>) & SliceType;

const sliceRegistry: Slice[] = [];

export const registerSlice = <T extends Slice>(slice: T) => {
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
    if ((slice as Slice).type === "control") {
      Object.assign(combinedState.controlState, slice);
    } else if ((slice as Slice).type === "data") {
      Object.assign(combinedState.dataState, slice);
    }
  });
  return combinedState;
};

export const usezAppStore = create<zAppStore>(() => combineSlices());

const state = usezAppStore.getState();
console.log(state);

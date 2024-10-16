import { create } from "zustand";
import { StoreState } from "@/store/store";

export const store = create<StoreState>(() => ({
  controlState: {},
  dataState: {},
}));

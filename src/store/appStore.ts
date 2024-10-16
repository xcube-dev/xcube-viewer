import { create } from "zustand";
import { combineSlices } from "@/store/registerSlices";
import { StoreState } from "@/store/store";

export const store = create<StoreState>(() => combineSlices());

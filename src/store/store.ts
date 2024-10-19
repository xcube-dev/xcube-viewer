import { create } from "zustand";

export interface StoreState extends Record<string, unknown> {}

export const useStore = create<StoreState>(() => ({}));

// A simpler alias if not used as a hook.
export const store = useStore;

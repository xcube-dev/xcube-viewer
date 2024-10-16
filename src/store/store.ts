import { ControlState } from "@/states/controlState";
import { DataState } from "@/states/dataState";

export interface StoreState {
  controlState: Partial<ControlState>;
  dataState: Partial<DataState>;
}

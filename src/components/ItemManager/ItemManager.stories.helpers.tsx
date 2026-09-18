/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type { ReactNode } from "react";
import { create } from "zustand";

import { ItemManagerProps } from "@/components/ItemManager/ItemManager";
import type { ItemRecord } from "@/components/ItemManager/types";
import Typography from "@mui/material/Typography";

export type SampleManagerState = ItemManagerProps<string, string>;
export type SampleRecord = ItemRecord<string, string>;

let lastItemId = 0;

export const useStore = create<SampleManagerState>((set) => ({
  selectedSource: "I'm a selected source",
  itemLoading: false,
  itemRecords: [],
  canAddItem: true,
  addItem: (source: string) => {
    ++lastItemId;
    set((state) => ({
      itemRecords: [
        {
          source,
          value: `Item #${lastItemId}`,
        },
        ...state.itemRecords,
      ],
    }));
  },
  removeItem: (itemIndex: number, _itemRecord: SampleRecord) => {
    set((state) => ({
      itemRecords: [
        ...state.itemRecords.slice(0, itemIndex),
        ...state.itemRecords.slice(itemIndex + 1),
      ],
    }));
  },
  renderItem: (_itemIndex: number, itemRecord: SampleRecord): ReactNode => {
    return <Typography variant={"h5"}>{itemRecord.value}</Typography>;
  },
  renderSource: (source: string | null): ReactNode => {
    return (
      <Typography color={"textSecondary"}>{source || "Source?"}</Typography>
    );
  },
}));

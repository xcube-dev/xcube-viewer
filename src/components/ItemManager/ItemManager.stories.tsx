/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type { ReactNode } from "react";
import { create } from "zustand";
import type { Meta, StoryObj } from "@storybook/react";

import { ItemManagerProps } from "@/components/ItemManager/ItemManager";
import type { ItemRecord } from "@/components/ItemManager/types";
import ItemManager from "@/components/ItemManager/index";

type SampleManagerState = ItemManagerProps<string, string>;
type SampleRecord = ItemRecord<string, string>;

export const useStore = create<SampleManagerState>((set) => ({
  selectedSource: null,
  itemLoading: false,
  itemRecords: [],
  canAddItem: true,
  addItem: (source: string) => {
    set((state) => ({
      itemRecords: [
        ...state.itemRecords,
        {
          source,
          value: `Item #${state.itemRecords.length + 1}`,
        },
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
    return (
      <p>
        {itemRecord.source}: {itemRecord.value}
      </p>
    );
  },
  renderSource: (source: string | null): ReactNode => {
    return <p>{source || "Source?"}</p>;
  },
}));

const SampleManager = () => {
  const {
    selectedSource,
    itemRecords,
    canAddItem,
    itemLoading,
    addItem,
    removeItem,
    renderItem,
    renderSource,
    renderActions,
  } = useStore((state) => state);
  return (
    <div style={{ width: 400, height: 400 }}>
      <ItemManager
        selectedSource={selectedSource}
        itemRecords={itemRecords}
        canAddItem={canAddItem}
        itemLoading={itemLoading}
        addItem={addItem}
        removeItem={removeItem}
        renderItem={renderItem}
        renderSource={renderSource}
        renderActions={renderActions}
      />
    </div>
  );
};

export const ActionsData = {};

const meta = {
  title: "ItemManager",
  component: SampleManager,
  parameters: {
    // Optional parameter to center the component in the Canvas.
    // More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry:
  // https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  args: {
    ...ActionsData,
  },
} satisfies Meta<typeof SampleManager>;

// noinspection JSUnusedGlobalSymbols
export default meta;

type Story = StoryObj<typeof meta>;

// noinspection JSUnusedGlobalSymbols
export const Sample: Story = {
  args: {},
};

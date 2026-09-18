/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type { Meta, StoryObj } from "@storybook/react";

import ItemManager from "./ItemManager";
import { useStore } from "./ItemManager.stories.helpers";

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
    <div style={{ width: 320, height: 320 }}>
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

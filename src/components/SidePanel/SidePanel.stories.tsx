/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ModelData } from "./Sidebar.stories";
import SidePanel from "./SidePanel";

export const ActionsData = {
  setSelectedPanelId: fn(),
};

const meta = {
  title: "SidePanel",
  component: SidePanel,
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
    ...ModelData,
  },
} satisfies Meta<typeof SidePanel>;

// noinspection JSUnusedGlobalSymbols
export default meta;

type Story = StoryObj<typeof meta>;

// noinspection JSUnusedGlobalSymbols
export const NoneSelected: Story = {
  args: {
    selectedPanelId: null,
    width: 350,
  },
};

// noinspection JSUnusedGlobalSymbols
export const OneSelected: Story = {
  args: {
    selectedPanelId: "statistics",
    width: 350,
  },
};

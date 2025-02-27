/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type { Meta, StoryObj } from "@storybook/react";

import { fn } from "@storybook/test";

import Sidepanel from "./Sidepanel";

export const ActionsData = {
  setSelectedPanelId: fn(),
  panelInfos: [
    {
      id: "info",
      title: "Info",
      icon: "info",
      visible: true,
      position: 0,
    },
    {
      id: "timeSeries",
      title: "Time Series",
      icon: "show_chart",
      visible: true,
      position: 10,
    },
    {
      id: "statistics",
      title: "Statistics",
      icon: "functions",
      visible: true,
      position: 20,
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: "analytics",
      visible: true,
      position: 30,
    },
  ],
};

const meta = {
  title: "Sidepanel",
  component: Sidepanel,
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
} satisfies Meta<typeof Sidepanel>;

// noinspection JSUnusedGlobalSymbols
export default meta;

type Story = StoryObj<typeof meta>;

// noinspection JSUnusedGlobalSymbols
export const Default: Story = {
  args: {
    selectedPanelId: "info",
  },
};

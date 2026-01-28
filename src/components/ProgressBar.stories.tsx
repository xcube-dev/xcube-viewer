/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import ProgressBar from "./ProgressBar";

const meta: Meta = {
  component: ProgressBar,
  title: "ProgressBar",
  parameters: {
    // Optional parameter to center the component in the Canvas.
    // More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry:
  // https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof ProgressBar>;

// noinspection JSUnusedGlobalSymbols
export default meta;

type Story = StoryObj<typeof meta>;

// noinspection JSUnusedGlobalSymbols
export const Default: Story = {
  args: {
    progress: 75,
    visibility: "visible",
    enabled: true,
  },
};

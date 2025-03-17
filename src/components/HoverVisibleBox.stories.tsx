/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import type { Meta, StoryObj } from "@storybook/react";
import HoverVisibleBox, { type HoverVisibleBoxProps } from "./HoverVisibleBox";

const meta: Meta<HoverVisibleBoxProps> = {
  component: HoverVisibleBox,
  title: "HoverVisibleBox",
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
};

// noinspection JSUnusedGlobalSymbols
export default meta;

type Story = StoryObj<typeof meta>;

const children = (
  <Box
    width={300}
    height={50}
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 1,
      border: "1px solid grey",
    }}
  >
    <Button>Add</Button>
    <Button>Edit</Button>
    <Button>Remove</Button>
  </Box>
);

// noinspection JSUnusedGlobalSymbols
export const Default: Story = {
  args: { children },
};

// noinspection JSUnusedGlobalSymbols
export const InitialOpacity: Story = {
  args: {
    initialOpacity: 0.15,
    children,
  },
};

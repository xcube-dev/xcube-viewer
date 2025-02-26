import type { Meta, StoryObj } from "@storybook/react";

import { fn } from "@storybook/test";

import IconButton from "./IconButton";

export const ActionsData = {
  onClick: fn(),
};

const meta = {
  component: IconButton,
  title: "IconButton",
  tags: ["autodocs"],
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  args: {
    ...ActionsData,
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AddCircle: Story = {
  args: {
    iconName: "add_circle",
  },
};

export const Home: Story = {
  args: {
    iconName: "home",
  },
};

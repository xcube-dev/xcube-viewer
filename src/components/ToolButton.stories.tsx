import type { Meta, StoryObj } from "@storybook/react";

import { fn } from "@storybook/test";

import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import ToolButton from "./ToolButton";

export const ActionsData = {
  onClick: fn(),
};

const meta = {
  component: ToolButton,
  title: "ToolButton",
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
} satisfies Meta<typeof ToolButton>;

// noinspection JSUnusedGlobalSymbols
export default meta;

type Story = StoryObj<typeof meta>;

export const NamedIcon: Story = {
  args: {
    icon: "add_circle",
    tooltipText: "My icon is 'add_circle'",
  },
};

export const IconElement: Story = {
  args: {
    icon: <FormatColorFillIcon />,
    tooltipText: "My icon is <FormatColorFillIcon/>",
  },
};

export const NoIcon: Story = {
  args: {
    icon: null as unknown as string,
    tooltipText: "My icon is null",
  },
};

export const Toggle: Story = {
  args: {
    icon: <FormatColorFillIcon />,
    toggle: true,
  },
};

export const ToggleSelected: Story = {
  args: {
    icon: <FormatColorFillIcon />,
    toggle: true,
    selected: true,
  },
};

export const Disabled: Story = {
  args: {
    icon: "home",
    disabled: true,
  },
};

export const NamedIconToggle: Story = {
  args: {
    icon: "home",
    toggle: true,
    selected: false,
    size: "large",
  },
};

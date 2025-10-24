import type { Meta, StoryObj } from "@storybook/react-vite";
import ZoomInfoBox from "./ZoomInfoBox";

const meta: Meta = {
  component: ZoomInfoBox,
  title: "ZoomInfoBox",
  parameters: {
    // Optional parameter to center the component in the Canvas.
    // More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry:
  // https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof ZoomInfoBox>;

// noinspection JSUnusedGlobalSymbols
export default meta;

type Story = StoryObj<typeof meta>;

// noinspection JSUnusedGlobalSymbols
export const Default: Story = {
  args: {
    style: {},
    zoomLevel: 10,
    datasetLevel: 3,
    datasetLevels: 4,
    visibility: true,
  },
};

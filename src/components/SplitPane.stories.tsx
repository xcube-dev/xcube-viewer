import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import SplitPane from "./SplitPane";

const meta = {
  component: SplitPane,
  title: "SplitPane",
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
} satisfies Meta<typeof SplitPane>;

// noinspection JSUnusedGlobalSymbols
export default meta;

type Story = StoryObj<typeof meta>;

export const SimpleHorizontal: Story = {
  render: (_args) => {
    const [splitPosition, setSplitPosition] = useState<number>(100); // Controlled state
    return (
      <SplitPane
        dir="hor"
        splitPosition={splitPosition}
        setSplitPosition={setSplitPosition}
        style={{
          width: 400,
          height: 200,
          border: "2px solid red",
          padding: 4,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            height: "100%",
            border: "2px solid blue",
            padding: 4,
          }}
        >
          Pane 1
        </div>
        <div
          style={{
            flexGrow: 1,
            height: "100%",
            border: "2px solid green",
            padding: 4,
          }}
        >
          Pane 2
        </div>
      </SplitPane>
    );
  },
  args: {
    dir: "hor",
    splitPosition: 0,
    setSplitPosition: () => {},
    children: [],
  },
};

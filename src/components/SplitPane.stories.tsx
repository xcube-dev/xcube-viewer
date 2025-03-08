import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import SplitPane from "./SplitPane";

type StoryProps = object;

const meta: Meta<StoryProps> = {
  //component: SplitPane,
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
};

// noinspection JSUnusedGlobalSymbols
export default meta;

type Story = StoryObj<typeof meta>;

// noinspection JSUnusedGlobalSymbols
export const Horizontal: Story = {
  render: (_args) => {
    const [splitPosition, setSplitPosition] = useState<number>(100); // Controlled state
    return (
      <SplitPane
        dir="hor"
        splitPosition={splitPosition}
        setSplitPosition={setSplitPosition}
        style={{ width: 400, height: 300 }}
      >
        <div style={{ width: "100%", height: "100%", background: "lightblue" }}>
          Pane 1
        </div>
        <div
          style={{ width: "100%", height: "100%", background: "lightcoral" }}
        >
          Pane 2
        </div>
      </SplitPane>
    );
  },
};

// noinspection JSUnusedGlobalSymbols
export const Vertical: Story = {
  render: (_args) => {
    const [splitPosition, setSplitPosition] = useState<number>(100); // Controlled state
    return (
      <SplitPane
        dir="ver"
        splitPosition={splitPosition}
        setSplitPosition={setSplitPosition}
        style={{ width: 300, height: 400 }}
      >
        <div style={{ width: "100%", height: "100%", background: "lightblue" }}>
          Pane 1
        </div>
        <div
          style={{ width: "100%", height: "100%", background: "lightcoral" }}
        >
          Pane 2
        </div>
      </SplitPane>
    );
  },
};

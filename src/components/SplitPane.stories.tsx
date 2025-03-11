import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import SplitPane, { SplitPaneProps } from "./SplitPane";

type SplitPaneDemoProps = Omit<
  SplitPaneProps,
  "style" | "childSize" | "setChildSize"
>;

function SplitPaneDemo(props: SplitPaneDemoProps) {
  const [childSize, setChildSize] = useState<number>(100); // Controlled state
  return (
    <SplitPane
      childSize={childSize}
      setChildSize={setChildSize}
      {...props}
      style={{ width: 400, height: 300 }}
    >
      <div style={{ width: "100%", height: "100%", background: "lightblue" }}>
        Pane 1
      </div>
      <div style={{ width: "100%", height: "100%", background: "lightcoral" }}>
        Pane 2
      </div>
    </SplitPane>
  );
}

const meta: Meta<SplitPaneDemoProps> = {
  component: SplitPaneDemo,
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
export const HorizontalFirst: Story = {
  args: {
    dir: "hor",
    childPos: "first",
  },
};

// noinspection JSUnusedGlobalSymbols
export const VerticalFirst: Story = {
  args: {
    dir: "ver",
    childPos: "first",
  },
};

// noinspection JSUnusedGlobalSymbols
export const HorizontalLast: Story = {
  args: {
    dir: "hor",
    childPos: "last",
  },
};

// noinspection JSUnusedGlobalSymbols
export const VerticalLast: Story = {
  args: {
    dir: "ver",
    childPos: "last",
  },
};

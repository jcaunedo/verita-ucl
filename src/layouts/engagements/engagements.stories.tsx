import type { Meta, StoryObj } from "@storybook/react-vite";
import { Engagements } from "./engagements";

const meta: Meta<typeof Engagements> = {
  title: "Layouts/Engagements",
  component: Engagements,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof Engagements>;

/** "Home" links to the `Dashboard` story and "Engagements" to this story, for clicking between the layouts as one prototype. */
export const Default: Story = {
  args: {
    navHrefOverrides: {
      home: "iframe.html?id=layouts-dashboard--default&viewMode=story",
      engagements: "iframe.html?id=layouts-engagements--default&viewMode=story",
    },
  },
};

/** Opens on the Contracts view — two `ContractCard`s. */
export const Contracts: Story = {
  args: { ...Default.args, defaultView: "contracts" },
};

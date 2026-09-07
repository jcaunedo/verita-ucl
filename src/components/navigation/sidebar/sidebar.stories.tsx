import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sidebar } from "./sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Navigation/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {};

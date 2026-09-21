import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dashboard } from "./dashboard";

const meta: Meta<typeof Dashboard> = {
  title: "Layouts/Dashboard",
  component: Dashboard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof Dashboard>;

export const Default: Story = {};

import type { Meta, StoryObj } from "@storybook/react-vite";

import { SidebarTooltip, SidebarTooltipTrigger } from "./sidebar-tooltip";

const meta: Meta<typeof SidebarTooltip> = {
  title: "Overlays/SidebarTooltip",
  component: SidebarTooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};
export default meta;
type Story = StoryObj<typeof SidebarTooltip>;

export const Default: Story = {
  render: () => (
    <SidebarTooltipTrigger delay={0}>
      <button
        type="button"
        className="rounded-full px-3 py-1.5 text-sm text-neutral-600"
      >
        Hover me
      </button>
      <SidebarTooltip>Home</SidebarTooltip>
    </SidebarTooltipTrigger>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <SidebarTooltipTrigger defaultOpen delay={0}>
      <button
        type="button"
        className="rounded-full px-3 py-1.5 text-sm text-neutral-600"
      >
        Hover me
      </button>
      <SidebarTooltip>Home</SidebarTooltip>
    </SidebarTooltipTrigger>
  ),
};

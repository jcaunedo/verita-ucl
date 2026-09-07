import type { Meta, StoryObj } from "@storybook/react-vite";
import { HomeLine } from "@untitledui/icons";

import { SidebarMenuItem } from "./sidebar-menu-item";

const meta: Meta<typeof SidebarMenuItem> = {
  title: "Buttons/SidebarMenuItem",
  component: SidebarMenuItem,
  tags: ["autodocs"],
  args: {
    icon: <HomeLine />,
    label: "Home",
    href: "#",
  },
  decorators: [
    (Story) => (
      <div className="w-64 bg-white p-4">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof SidebarMenuItem>;

export const Default: Story = {};

export const Current: Story = {
  args: { current: true },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <SidebarMenuItem {...args} />
      <SidebarMenuItem {...args} current />
    </div>
  ),
};

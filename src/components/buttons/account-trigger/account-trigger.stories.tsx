import type { Meta, StoryObj } from "@storybook/react-vite";
import { AccountMenu } from "./account-menu";

const meta: Meta<typeof AccountMenu> = {
  title: "Buttons/AccountMenu",
  component: AccountMenu,
  tags: ["autodocs"],
  args: {
    name: "Theresa Smith",
    email: "theresa@email.com",
    avatar: { initials: "TS", className: "bg-primary" },
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
type Story = StoryObj<typeof AccountMenu>;

export const Expanded: Story = {};

export const Collapsed: Story = {
  args: { collapsed: true },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <AccountMenu {...args} />
      <AccountMenu {...args} collapsed />
    </div>
  ),
};

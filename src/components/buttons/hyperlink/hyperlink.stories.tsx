import type { Meta, StoryObj } from "@storybook/react-vite";

import { Hyperlink } from "./hyperlink";

const meta: Meta<typeof Hyperlink> = {
  title: "Buttons/Hyperlink",
  component: Hyperlink,
  tags: ["autodocs"],
  args: {
    children: "View All",
    href: "#",
  },
  decorators: [
    (Story) => (
      <div className="bg-white p-4">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Hyperlink>;

export const Default: Story = {};

export const WithArrow: Story = {
  args: { showArrow: true },
};

export const Base: Story = {
  args: { size: "base", showArrow: true },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      <Hyperlink {...args} size="sm">
        View All
      </Hyperlink>
      <Hyperlink {...args} size="sm" showArrow>
        View All
      </Hyperlink>
      <Hyperlink {...args} size="base">
        View All
      </Hyperlink>
      <Hyperlink {...args} size="base" showArrow>
        View All
      </Hyperlink>
    </div>
  ),
};

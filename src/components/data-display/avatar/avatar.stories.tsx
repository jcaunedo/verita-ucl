import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "DataDisplay/Avatar",
  component: Avatar,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Photo: Story = {
  args: {
    src: "https://i.pravatar.cc/72?img=47",
    alt: "Theresa Smith",
  },
};

export const Initials: Story = {
  args: {
    initials: "TS",
    className: "bg-primary",
  },
};

export const WithStatusDot: Story = {
  args: {
    initials: "TS",
    className: "bg-primary",
    showStatusDot: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar size="sm" initials="SM" className="bg-primary" />
      <Avatar size="md" initials="MD" className="bg-primary" />
      <Avatar size="lg" initials="LG" className="bg-primary" />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar src="https://i.pravatar.cc/72?img=47" alt="Photo avatar" />
        <Avatar initials="AB" className="bg-info" />
        <Avatar initials="CD" className="bg-primary" showStatusDot />
      </div>
      <div className="flex items-center gap-3">
        <Avatar size="sm" initials="SM" className="bg-primary" />
        <Avatar size="md" initials="MD" className="bg-primary" />
        <Avatar size="lg" initials="LG" className="bg-primary" />
      </div>
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalloutCard } from "./callout-card";

const meta: Meta<typeof CalloutCard> = {
  title: "Cards/CalloutCard",
  component: CalloutCard,
  tags: ["autodocs"],
  args: {
    title: "Title",
    description: "Description",
    href: "#",
  },
  decorators: [
    (Story) => (
      <div className="w-[564px] bg-white p-4">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof CalloutCard>;

export const Default: Story = {};

export const RealisticCopy: Story = {
  args: {
    title: "Explore the API docs",
    description: "See every endpoint, request shape, and response example.",
    href: "#",
  },
};

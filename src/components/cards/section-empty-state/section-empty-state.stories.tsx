import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionEmptyState } from "./section-empty-state";

const meta: Meta<typeof SectionEmptyState> = {
  title: "Cards/SectionEmptyState",
  component: SectionEmptyState,
  tags: ["autodocs"],
  args: {
    title: "Title",
    description: "Description",
    buttonLabel: "Label",
  },
  decorators: [
    (Story) => (
      <div className="w-[1152px] bg-white p-4">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof SectionEmptyState>;

export const Default: Story = {};

export const RealisticCopy: Story = {
  args: {
    title: "No engagements yet",
    description: "Create your first engagement to get started.",
    buttonLabel: "New engagement",
  },
};

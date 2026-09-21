import type { Meta, StoryObj } from "@storybook/react-vite";
import { NextStepCard } from "./next-step-card";

const meta: Meta<typeof NextStepCard> = {
  title: "Cards/NextStepCard",
  component: NextStepCard,
  tags: ["autodocs"],
  args: {
    label: "Label",
    title: "Title",
    description: "Description",
    buttonLabel: "Label",
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
type Story = StoryObj<typeof NextStepCard>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[270px]">
      <NextStepCard {...args} />
    </div>
  ),
};

export const Dismissible: Story = {
  args: {
    dismissible: true,
  },
  render: (args) => (
    <div className="w-[270px]">
      <NextStepCard {...args} />
    </div>
  ),
};

export const RealisticCopy: Story = {
  args: {
    label: "Step 1",
    title: "Verify your email",
    description: "Confirm your email address to unlock all features.",
    buttonLabel: "Verify now",
  },
  render: (args) => (
    <div className="w-[270px]">
      <NextStepCard {...args} />
    </div>
  ),
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <NextStepCard {...args} className="w-[270px]" />
      <NextStepCard
        {...args}
        label="Step 1"
        title="Verify your email"
        description="Confirm your email address to unlock all features."
        buttonLabel="Verify now"
        className="w-[270px]"
      />
      <NextStepCard {...args} dismissible label="Recommended" className="w-[270px]" />
    </div>
  ),
};

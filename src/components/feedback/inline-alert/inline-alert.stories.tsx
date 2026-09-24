import type { Meta, StoryObj } from "@storybook/react-vite";

import { InlineAlert } from "./inline-alert";

const meta: Meta<typeof InlineAlert> = {
  title: "Feedback/InlineAlert",
  component: InlineAlert,
  tags: ["autodocs"],
  args: { children: "No work history added yet" },
  argTypes: {
    tone: { control: "inline-radio", options: ["info", "warning", "destructive"] },
  },
};
export default meta;
type Story = StoryObj<typeof InlineAlert>;

export const Default: Story = {};

/** Figma `Optional`. */
export const Info: Story = {
  args: { tone: "info" },
};

/** Figma `Required`. */
export const Warning: Story = {
  args: { tone: "warning" },
};

/** Figma `Danger`. */
export const Destructive: Story = {
  args: { tone: "destructive" },
};

/** Figma `showIcon` off. */
export const WithoutIcon: Story = {
  args: { tone: "warning", showIcon: false },
};

/** Long copy wraps; the icon stays aligned to the first line. */
export const Wrapping: Story = {
  args: {
    tone: "warning",
    children: "No resume added yet — partners reviewing your application will see your profile without one.",
  },
  render: (args) => (
    <div className="w-72">
      <InlineAlert {...args} />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <InlineAlert tone="info">No languages added yet</InlineAlert>
      <InlineAlert tone="warning">No work history added yet</InlineAlert>
      <InlineAlert tone="destructive">No resume added yet</InlineAlert>
      <InlineAlert tone="warning" showIcon={false}>
        No work history added yet
      </InlineAlert>
    </div>
  ),
};

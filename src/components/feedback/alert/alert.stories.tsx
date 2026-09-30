import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alert } from "./alert";

const meta: Meta<typeof Alert> = {
  title: "Feedback/Alert",
  component: Alert,
  tags: ["autodocs"],
  args: { title: "title", description: "description", onClick: () => {}, dismissible: true, onDismiss: () => {} },
  argTypes: {
    tone: { control: "inline-radio", options: ["neutral", "info", "warning", "destructive", "success"] },
  },
};
export default meta;
type Story = StoryObj<typeof Alert>;

/** Figma `State=Default`. */
export const Default: Story = {};

/** Figma `State=Info`. */
export const Info: Story = {
  args: { tone: "info" },
};

/** Figma `State=Warning`. */
export const Warning: Story = {
  args: { tone: "warning" },
};

/** Figma `State=Desctructive`. */
export const Destructive: Story = {
  args: { tone: "destructive" },
};

/** Figma `State=Success`. */
export const Success: Story = {
  args: { tone: "success" },
};

/** No `onClick`: the alert opens nothing, so there's no arrow and no pointer cursor. */
export const NotClickable: Story = {
  args: { tone: "info", onClick: undefined },
};

/** Figma `showX` off. */
export const NotDismissible: Story = {
  args: { tone: "warning", dismissible: false },
};

/** Figma `showTitle` off. */
export const WithoutTitle: Story = {
  args: { title: undefined, description: "Your profile is visible to partners." },
};

/** Figma `showIcon` off. */
export const WithoutIcon: Story = {
  args: { showIcon: false },
};

/** Long copy: the description wraps below the title, the icon stays on the first line. */
export const Wrapping: Story = {
  args: {
    tone: "warning",
    title: "Assessment due soon",
    description: "Complete the Financial Modeling assessment by Oct 4 so partners can review your application.",
  },
  render: (args) => (
    <div className="w-[480px]">
      <Alert {...args} />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Alert tone="neutral" title="title" description="description" onClick={() => {}} dismissible />
      <Alert tone="info" title="title" description="description" onClick={() => {}} dismissible />
      <Alert tone="warning" title="title" description="description" onClick={() => {}} dismissible />
      <Alert tone="destructive" title="title" description="description" onClick={() => {}} dismissible />
      <Alert tone="success" title="title" description="description" onClick={() => {}} dismissible />
      <Alert tone="neutral" title="title" description="description" />
    </div>
  ),
};

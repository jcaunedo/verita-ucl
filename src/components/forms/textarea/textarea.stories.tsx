import type { Meta, StoryObj } from "@storybook/react-vite";

import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "Forms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: { label: "Label", placeholder: "Value" },
  decorators: [
    (Story) => (
      <div className="w-[320px] bg-white p-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Textarea>;

/** Figma `State=Default` (md · 40): one line tall; it grows as you type. Hover for `Hover`, click in for `Focused`. */
export const Default: Story = {};

/** Figma `State=HasValue`, with several lines. */
export const HasValue: Story = {
  args: { defaultValue: "Value\nA second line\nAnd a third" },
};

/** Figma `Size=sm · 36`. */
export const Small: Story = { args: { size: "sm" } };

/** Starting taller with `rows`. */
export const Rows: Story = { args: { rows: 4, hint: "This is a hint text to help user." } };

/** Figma `State=Error`. */
export const Error: Story = { args: { defaultValue: "Value", errorMessage: "This is an error message." } };

/** Figma `State=Disabled`. */
export const Disabled: Story = {
  args: { defaultValue: "Value", isDisabled: true, hint: "This field can't be edited right now." },
};

/** Figma `State=Read-only`. */
export const ReadOnly: Story = { args: { defaultValue: "Value", isReadOnly: true } };

export const AllVariants: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-6">
      {(["sm", "md"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-6">
          <Textarea {...args} size={size} label={`Default · ${size}`} />
          <Textarea {...args} size={size} label="HasValue" defaultValue="Value" />
          <Textarea {...args} size={size} label="Error" defaultValue="Value" errorMessage="This is an error message." />
          <Textarea {...args} size={size} label="Disabled" defaultValue="Value" isDisabled />
          <Textarea {...args} size={size} label="Read-only" defaultValue="Value" isReadOnly />
        </div>
      ))}
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="w-[640px] bg-white p-6">
        <Story />
      </div>
    ),
  ],
};

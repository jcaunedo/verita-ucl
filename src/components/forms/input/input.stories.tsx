import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar, SearchMd } from "@untitledui/icons";

import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "Forms/Input",
  component: Input,
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
type Story = StoryObj<typeof Input>;

/** Figma `State=Default` (md · 40). Hover for Figma's `Hover` border; click in for `Focused`. */
export const Default: Story = {};

/** Figma `State=HasValue`: the value in `foreground`. */
export const HasValue: Story = { args: { defaultValue: "Value" } };

/** Figma `Size=sm · 36`. */
export const Small: Story = { args: { size: "sm" } };

/** Figma `showDescription` and `showHelperText`. */
export const WithDescriptionAndHint: Story = {
  args: { description: "Description", hint: "Helper text" },
};

/** Figma `showLeftIcon`, `showRightIcon`, and `showSuffix`. */
export const WithIconsAndSuffix: Story = {
  args: { iconLeading: SearchMd, iconTrailing: Calendar, suffix: "Suffix" },
};

/** Figma `State=Error`: the message replaces the hint. */
export const Error: Story = {
  args: { defaultValue: "Value", hint: "Helper text", errorMessage: "Enter a valid value" },
};

/** Figma `State=Disabled`. */
export const Disabled: Story = { args: { defaultValue: "Value", isDisabled: true, iconLeading: SearchMd } };

/** Figma `State=Read-only`. */
export const ReadOnly: Story = { args: { defaultValue: "Value", isReadOnly: true } };

export const AllVariants: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-6">
      {(["sm", "md"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-6">
          <Input {...args} size={size} label={`Default · ${size}`} />
          <Input {...args} size={size} label="HasValue" defaultValue="Value" />
          <Input
            {...args}
            size={size}
            label="Icons + suffix"
            iconLeading={SearchMd}
            iconTrailing={Calendar}
            suffix="Suffix"
          />
          <Input {...args} size={size} label="Error" defaultValue="Value" errorMessage="Enter a valid value" />
          <Input {...args} size={size} label="Disabled" defaultValue="Value" iconLeading={SearchMd} isDisabled />
          <Input {...args} size={size} label="Read-only" defaultValue="Value" isReadOnly />
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

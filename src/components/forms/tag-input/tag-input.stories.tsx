import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { TagInput } from "./tag-input";

const EMAIL_PATTERN = /^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/;

const meta: Meta<typeof TagInput> = {
  title: "Forms/TagInput",
  component: TagInput,
  tags: ["autodocs"],
  args: {
    label: "Skills",
    hint: "Enter a skill and press Enter.",
    placeholder: "e.g. Financial modeling",
  },
  decorators: [
    (Story) => (
      <div className="w-[420px] bg-white p-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof TagInput>;

/** Empty. Type and press Enter (or a comma) to add a tag; Backspace in the empty input removes the last one. */
export const Default: Story = {};

/** Starting with tags. They wrap onto new rows and the field grows taller. */
export const WithTags: Story = {
  args: { defaultValue: ["Financial modeling", "Forecasting", "Excel", "Valuation", "Due diligence"] },
};

/**
 * Emails, as in "Share your referral link": `validate` rejects anything that isn't an address, and the delimiter also
 * splits on spaces and semicolons, so a pasted list becomes one tag per address. Try a repeat or an invalid address.
 */
export const Emails: Story = {
  render: function EmailsStory() {
    const [emails, setEmails] = React.useState(["ana@example.com"]);
    return (
      <TagInput
        label="Share by email"
        hint="Enter an email address and press Enter or Space to add it."
        placeholder="Add email"
        value={emails}
        onChange={setEmails}
        validate={(email) => (EMAIL_PATTERN.test(email) ? null : "Enter a valid email address")}
        duplicateMessage="You’ve already added this email"
        delimiter={/[\s,;]+/}
        tagsLabel="Email addresses"
        inputProps={{ inputMode: "email", autoComplete: "email" }}
      />
    );
  },
};

/** An error from outside the field (`errorMessage`) replaces the hint and turns the field destructive. */
export const Invalid: Story = {
  args: { defaultValue: ["Excel"], errorMessage: "Add at least two skills" },
};

/** Without a visible label: name it with `aria-label`. */
export const WithoutLabel: Story = {
  args: { label: undefined, "aria-label": "Skills", hint: undefined },
};

/** Figma `Input` `Size=sm · 36`. */
export const Small: Story = {
  args: { size: "sm", defaultValue: ["Financial modeling", "Excel"] },
};

/** Figma `Input` `State=Disabled`: no typing, and the tags lose their ×. */
export const Disabled: Story = {
  args: { isDisabled: true, defaultValue: ["Financial modeling", "Excel"] },
};

/** Figma `Input` `State=Read-only`: the tags stay readable and focusable, but can't change. */
export const ReadOnly: Story = {
  args: { isReadOnly: true, defaultValue: ["Financial modeling", "Excel"] },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <TagInput {...args} />
      <TagInput {...args} defaultValue={["Financial modeling", "Forecasting", "Excel", "Valuation"]} />
      <TagInput {...args} defaultValue={["Excel"]} errorMessage="Add at least two skills" />
      <TagInput {...args} size="sm" defaultValue={["Financial modeling", "Excel"]} />
      <TagInput {...args} isDisabled defaultValue={["Financial modeling", "Excel"]} />
      <TagInput {...args} isReadOnly defaultValue={["Financial modeling", "Excel"]} />
    </div>
  ),
};

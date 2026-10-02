import type { Meta, StoryObj } from "@storybook/react-vite";

import { LinkedInLogo } from "./linkedin-logo";

const meta: Meta<typeof LinkedInLogo> = {
  title: "Branding/LinkedInLogo",
  component: LinkedInLogo,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="bg-white p-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof LinkedInLogo>;

/** Figma `Property 1=LinkedIn`: the full wordmark. */
export const Wordmark: Story = {};

/** Figma `Property 1=in`: the square mark, e.g. on Referrals → My network's import card. */
export const Mark: Story = {
  args: { mark: true },
};

/** Both variants at their native 40px height. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <LinkedInLogo />
      <LinkedInLogo mark />
    </div>
  ),
};

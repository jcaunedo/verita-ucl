import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { PreviewEmail, type PreviewEmailProps } from "./preview-email";

/** A modal surface, the way `ShareReferralLinkModal` renders the preview. */
function Surface({ children }: { children: React.ReactNode }) {
  return <div className="w-[600px] overflow-hidden rounded-popover bg-background shadow-modal">{children}</div>;
}

const GENERAL: Pick<PreviewEmailProps, "recipientFirstName" | "recipientCount" | "title" | "description"> = {
  recipientFirstName: "Ana",
  recipientCount: 3,
  title: "Theresa invited you to discover opportunities on Verita AI.",
  description:
    "Verita connects experienced professionals with flexible, remote work that matches their expertise. Discover opportunities that fit your background, apply when you’re ready, and earn on your terms.",
};

const OPPORTUNITY: Pick<PreviewEmailProps, "recipientFirstName" | "recipientCount" | "title" | "description" | "ctaLabel"> = {
  recipientFirstName: "Ana",
  recipientCount: 1,
  title: "Theresa thinks you’d be a great fit for a Senior Financial Analyst role on Verita AI.",
  description:
    "Verita connects experienced professionals with flexible, remote work that matches their expertise. The details: $95–115k/yr, 32 hrs/week, 1 year. Take a look and apply when you’re ready.",
  ctaLabel: "View opportunity",
};

const meta: Meta<typeof PreviewEmail> = {
  title: "Overlays/PreviewEmail",
  component: PreviewEmail,
  tags: ["autodocs"],
  args: { onBack: () => {}, onSend: () => {} },
  render: (args) => (
    <Surface>
      <PreviewEmail {...args} />
    </Surface>
  ),
};
export default meta;
type Story = StoryObj<typeof PreviewEmail>;

/** Figma `preview-email`: the general invite, from "Share your referral link". */
export const Default: Story = { args: GENERAL };

/** A typed address that isn't a connection: there's no name, so the greeting reads "Hi there,". */
export const NoRecipientName: Story = { args: { ...GENERAL, recipientFirstName: undefined } };

/** An invite to a specific opportunity. Draft copy, pending review: Figma only shows the general invite. */
export const Opportunity: Story = { args: OPPORTUNITY };

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8">
      <Surface>
        <PreviewEmail {...args} {...GENERAL} />
      </Surface>
      <Surface>
        <PreviewEmail {...args} {...OPPORTUNITY} />
      </Surface>
    </div>
  ),
};

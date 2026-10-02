import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/buttons/button";
import { Toaster } from "@/components/feedback/toast";

import { ShareReferralLinkModal } from "./share-referral-link-modal";

const meta: Meta<typeof ShareReferralLinkModal> = {
  title: "Overlays/ShareReferralLinkModal",
  component: ShareReferralLinkModal,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof ShareReferralLinkModal>;

/** Figma `share-referral-link-modal`. Opens on load on the link view; "Share by email" swaps to the email view and back. "Copy referral link" closes it and shows a toast (bottom right on desktop, bottom center on mobile). */
export const Default: Story = {
  render: () => {
    const [isOpen, setOpen] = React.useState(true);
    return (
      <div className="flex min-h-[480px] items-start bg-white p-6">
        <Button onPress={() => setOpen(true)}>Share your referral link</Button>
        <ShareReferralLinkModal isOpen={isOpen} onOpenChange={setOpen} link="https://ref.verita-ai.com/hhd87" />
        <Toaster />
      </div>
    );
  },
};

/**
 * Figma `Opportunity Default` / `Opportunity Email`: referring someone to a specific opportunity. The opportunity summary
 * and its potential reward sit above the same link and email views.
 */
export const Opportunity: Story = {
  render: () => {
    const [isOpen, setOpen] = React.useState(true);
    return (
      <div className="flex min-h-[640px] items-start bg-white p-6">
        <Button onPress={() => setOpen(true)}>Refer</Button>
        <ShareReferralLinkModal
          isOpen={isOpen}
          onOpenChange={setOpen}
          link="https://ref.verita-ai.com/hhd87-yw7e"
          opportunity={{
            title: "Senior Financial Analyst",
            partnerName: "Verita partner",
            compensation: "$95–115k/yr",
            engagementTerms: "32 hrs/week",
            duration: "1 year",
            reward: 450,
          }}
        />
        <Toaster />
      </div>
    );
  },
};

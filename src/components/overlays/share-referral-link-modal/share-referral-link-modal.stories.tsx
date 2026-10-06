import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/buttons/button";
import { Toaster } from "@/components/feedback/toast";

import { ShareReferralLinkModal } from "./share-referral-link-modal";

const meta: Meta<typeof ShareReferralLinkModal> = {
  title: "Overlays/ShareReferralLinkModal",
  component: ShareReferralLinkModal,
  tags: ["autodocs"],
  // Opens on mount, and an open modal locks page scroll and covers the page — so on the Docs page each story gets its own iframe.
  parameters: { layout: "fullscreen", docs: { story: { inline: false, height: "480px" } } },
};
export default meta;
type Story = StoryObj<typeof ShareReferralLinkModal>;

/** Figma `share-referral-link-modal`. Opens on load on the link view; "Share by email" swaps to the email view and back; once an address is added, "Preview invite email" shows the invite (`PreviewEmail`). "Copy referral link" closes it and shows a toast (bottom right on desktop, bottom center on mobile). */
export const Default: Story = {
  args: { link: "https://ref.verita-ai.com/hhd87", inviterName: "Theresa" },
  argTypes: { isOpen: { control: false } },
  // On the Docs page this story renders inline and closed (open it from its trigger), so the Docs controls reach it; a
  // story in its own iframe doesn't receive Docs control changes.
  parameters: { docs: { story: { inline: true } } },
  render: function Render({ isOpen: _isOpen, onOpenChange: _onOpenChange, ...args }, { viewMode }) {
    const [isOpen, setOpen] = React.useState(viewMode !== "docs");
    return (
      <div className={`flex items-start bg-white p-6 ${viewMode !== "docs" ? "min-h-[480px]" : ""}`}>
        <Button onPress={() => setOpen(true)}>Share your referral link</Button>
        <ShareReferralLinkModal {...args} isOpen={isOpen} onOpenChange={setOpen} />
        <Toaster />
      </div>
    );
  },
};

/**
 * Figma `Opportunity Default` / `Opportunity Email`: referring someone to a specific opportunity. The opportunity summary
 * and its potential reward sit above the same link and email views. LinkedIn and X open with copy written for the
 * opportunity and the people it suits (`audience`).
 */
export const Opportunity: Story = {
  parameters: { docs: { story: { height: "640px" } } },
  render: () => {
    const [isOpen, setOpen] = React.useState(true);
    return (
      <div className="flex min-h-[640px] items-start bg-white p-6">
        <Button onPress={() => setOpen(true)}>Refer someone</Button>
        <ShareReferralLinkModal
          isOpen={isOpen}
          onOpenChange={setOpen}
          link="https://ref.verita-ai.com/hhd87-yw7e"
          inviterName="Theresa"
          opportunity={{
            title: "Senior Financial Analyst",
            partnerName: "Verita partner",
            compensation: "$95–115k/yr",
            engagementTerms: "32 hrs/week",
            duration: "1 year",
            reward: 450,
            audience: "financial analysts and FP&A professionals",
          }}
        />
        <Toaster />
      </div>
    );
  },
};

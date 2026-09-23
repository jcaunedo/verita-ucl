import type { Meta, StoryObj } from "@storybook/react-vite";
import { partnerLogos } from "@/assets/logos";
import { OfferCard } from "./offer-card";

const meta: Meta<typeof OfferCard> = {
  title: "Cards/OfferCard",
  component: OfferCard,
  tags: ["autodocs"],
  args: {
    rowProps: { onClick: () => {} },
    title: "Strategic Finance Expert",
    compensation: "$56/hour",
    engagementTerms: "Up to 30 hrs/week",
    duration: "3 months",
    company: "verita",
    partnerName: "Verita partner",
    expirationDate: "Expires in 3 days",
    onCtaPress: () => {},
    // On by default so every story shows Figma's Hover variant (× slides in, pushing the CTA left) — see `WithoutDismiss` for the no-trigger case.
    dismissLabel: "Dismiss offer",
    onDismiss: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-full bg-white">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof OfferCard>;

export const Default: Story = {};

/** Partner tile with a logo — `company` set to a partner and `logoSrc` supplied (Figma's `avatar-companies` google variant). */
export const PartnerLogo: Story = {
  args: {
    company: "google",
    logoSrc: partnerLogos.google,
    logoAlt: "Google",
    partnerName: "Google",
  },
};

export const NoExpirationDate: Story = {
  args: {
    expirationDate: undefined,
  },
};

export const NoDuration: Story = {
  args: {
    duration: undefined,
  },
};

export const WithDiscipline: Story = {
  args: {
    discipline: "Corporate Finance",
  },
};

export const CustomCtaLabel: Story = {
  args: {
    ctaLabel: "Review offer",
  },
};

/** No dismiss (×) trigger — hover only tints the row; the CTA stays put. */
export const WithoutDismiss: Story = {
  args: {
    dismissLabel: undefined,
    onDismiss: undefined,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-full flex-col divide-y divide-border">
      <OfferCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        duration="3 months"
        company="verita"
        partnerName="Verita partner"
        expirationDate="Expires in 3 days"
        onCtaPress={() => {}}
        dismissLabel="Dismiss offer"
        onDismiss={() => {}}
      />
      <OfferCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        duration="3 months"
        company="verita"
        partnerName="Verita partner"
        discipline="Corporate Finance"
        expirationDate="Expires in 3 days"
        onCtaPress={() => {}}
        dismissLabel="Dismiss offer"
        onDismiss={() => {}}
      />
      <OfferCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        company="verita"
        partnerName="Verita partner"
        onCtaPress={() => {}}
        dismissLabel="Dismiss offer"
        onDismiss={() => {}}
      />
    </div>
  ),
};

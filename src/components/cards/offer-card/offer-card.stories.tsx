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
    // On by default: the always-visible × that dismisses (declines) the offer — see `WithoutDismiss` for a row without it.
    onDismiss: () => {},
    dismissLabel: "Decline Strategic Finance Expert",
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

/** More than 5 days left: the date, in the muted supporting-text color (`offer-card.md` §2.3). */
export const ExpirationMoreThanFiveDays: Story = {
  args: {
    expirationDate: "Expires on Oct 9",
    expirationTone: "muted",
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

/**
 * A closed offer (`engagements.md` §4.1): the outcome as a neutral badge with its details before it, no expiration
 * date, no CTA, and no ×; the row itself opens the detail.
 */
export const Closed: Story = {
  args: {
    expirationDate: undefined,
    statusLabel: "Declined",
    statusTone: "neutral",
    supportingText: "Declined by you on Sep 25",
    showCta: false,
    onDismiss: undefined,
  },
};

/** No × — the row still opens the detail and tints on hover. */
export const WithoutDismiss: Story = {
  args: {
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
        onDismiss={() => {}}
        dismissLabel="Decline Strategic Finance Expert"
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
        onDismiss={() => {}}
        dismissLabel="Decline Strategic Finance Expert"
      />
      <OfferCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        company="verita"
        partnerName="Verita partner"
        onCtaPress={() => {}}
        onDismiss={() => {}}
        dismissLabel="Decline Strategic Finance Expert"
      />
      <OfferCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        duration="3 months"
        company="verita"
        partnerName="Verita partner"
        statusLabel="Declined"
        supportingText="Declined by you on Sep 25"
        showCta={false}
      />
    </div>
  ),
};

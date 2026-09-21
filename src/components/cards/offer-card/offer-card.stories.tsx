import type { Meta, StoryObj } from "@storybook/react-vite";
import { OfferCard } from "./offer-card";

const meta: Meta<typeof OfferCard> = {
  title: "Cards/OfferCard",
  component: OfferCard,
  tags: ["autodocs"],
  args: {
    title: "Strategic Finance Expert",
    compensation: "$56/hour",
    engagementTerms: "Up to 30 hrs/week",
    duration: "3 months",
    partnerName: "Bank of America",
    expirationDate: "Expires in 3 days",
    onCtaPress: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-[1174px] bg-white">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof OfferCard>;

export const Default: Story = {};

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

export const WithDismiss: Story = {
  args: {
    dismissLabel: "Dismiss offer",
    onDismiss: () => {},
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-[1174px] flex-col divide-y divide-border">
      <OfferCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        duration="3 months"
        partnerName="Bank of America"
        expirationDate="Expires in 3 days"
        onCtaPress={() => {}}
      />
      <OfferCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        duration="3 months"
        partnerName="Bank of America"
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
        partnerName="Bank of America"
        onCtaPress={() => {}}
      />
    </div>
  ),
};

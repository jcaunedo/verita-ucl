import type { Meta, StoryObj } from "@storybook/react-vite";
import { partnerLogos } from "@/assets/logos";
import { MatchCard } from "./match-card";

const meta: Meta<typeof MatchCard> = {
  title: "Cards/MatchCard",
  component: MatchCard,
  tags: ["autodocs"],
  args: {
    rowProps: { onClick: () => {} },
    title: "Strategic Finance Expert",
    compensation: "$95-115k/yr",
    engagementTerms: "Up to 30 hrs/week",
    duration: "3 months",
    company: "verita",
    partnerName: "Verita partner",
    matchTier: "Strong match",
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
type Story = StoryObj<typeof MatchCard>;

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

export const WithActionsMenu: Story = {
  args: {
    actionsMenuLabel: "More actions",
    onActionsPress: () => {},
  },
};

export const WithSavedToggle: Story = {
  args: {
    onSaveToggle: () => {},
    savedToggleLabel: "Save match",
    isSaved: false,
  },
};

export const Saved: Story = {
  args: {
    onSaveToggle: () => {},
    savedToggleLabel: "Remove from saved",
    isSaved: true,
  },
};

export const ReadyToApply: Story = {
  args: {
    readinessState: "readyToApply",
    ctaLabel: "Apply",
    onCtaPress: () => {},
  },
};

export const MatchedButBlocked: Story = {
  args: {
    readinessState: "matchedBlocked",
    missingRequirementSummary: "Complete your certification upload to apply.",
    ctaLabel: "Complete requirement to apply",
    onCtaPress: () => {},
  },
};

export const PotentialFitWithMissingData: Story = {
  args: {
    readinessState: "potentialFit",
    matchTier: undefined,
    fitExplanation: "Complete your rate preferences to confirm this match.",
  },
};

export const WithFitExplanation: Story = {
  args: {
    fitExplanation:
      "Matches your 5 years of FP&A experience and your stated hourly rate.",
  },
};

export const WithOpportunityType: Story = {
  args: {
    opportunityType: "Engagement",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-[1174px] flex-col divide-y divide-border">
      <MatchCard
        title="Strategic Finance Expert"
        compensation="$95-115k/yr"
        engagementTerms="Up to 30 hrs/week"
        duration="3 months"
        company="verita"
        partnerName="Verita partner"
        matchTier="Strong match"
      />
      <MatchCard
        title="Strategic Finance Expert"
        compensation="$95-115k/yr"
        engagementTerms="Up to 30 hrs/week"
        duration="3 months"
        company="verita"
        partnerName="Verita partner"
        discipline="Corporate Finance"
        matchTier="Good match"
      />
      <MatchCard
        title="Strategic Finance Expert"
        compensation="$95-115k/yr"
        engagementTerms="Up to 30 hrs/week"
        duration="3 months"
        company="verita"
        partnerName="Verita partner"
        matchTier="Strong match"
        fitExplanation="Matches your 5 years of FP&A experience and your stated hourly rate."
        readinessState="readyToApply"
        ctaLabel="Apply"
        onCtaPress={() => {}}
        onSaveToggle={() => {}}
        savedToggleLabel="Save match"
      />
      <MatchCard
        title="Strategic Finance Expert"
        compensation="$95-115k/yr"
        engagementTerms="Up to 30 hrs/week"
        duration="3 months"
        company="verita"
        partnerName="Verita partner"
        matchTier="Strong match"
        readinessState="matchedBlocked"
        missingRequirementSummary="Complete your certification upload to apply."
        ctaLabel="Complete requirement to apply"
        onCtaPress={() => {}}
        onSaveToggle={() => {}}
        savedToggleLabel="Save match"
        isSaved={true}
        actionsMenuLabel="More actions"
        onActionsPress={() => {}}
      />
      <MatchCard
        title="Strategic Finance Expert"
        engagementTerms="Up to 30 hrs/week"
        company="verita"
        partnerName="Verita partner"
        readinessState="potentialFit"
        fitExplanation="Complete your rate preferences to confirm this match."
      />
    </div>
  ),
};

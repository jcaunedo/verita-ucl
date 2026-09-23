import type { Meta, StoryObj } from "@storybook/react-vite";
import { partnerLogos } from "@/assets/logos";
import { AlignLeft, Share06, XCircle } from "@untitledui/icons";

import { MenuItem, MenuSeparator } from "@/components/overlays/menu";
import { ApplicationCard } from "./application-card";

const meta: Meta<typeof ApplicationCard> = {
  title: "Cards/ApplicationCard",
  component: ApplicationCard,
  tags: ["autodocs"],
  args: {
    rowProps: { onClick: () => {} },
    title: "Strategic Finance Expert",
    compensation: "$56/hour",
    engagementTerms: "Up to 30 hrs/week",
    duration: "3 months",
    company: "verita",
    partnerName: "Verita partner",
    statusLabel: "Applied",
    statusTone: "info",
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
type Story = StoryObj<typeof ApplicationCard>;

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

export const Applied: Story = {
  args: {
    statusLabel: "Applied",
    statusTone: "info",
    supportingText: undefined,
  },
};

export const ActionRequired: Story = {
  args: {
    statusLabel: "Action required",
    statusTone: "warning",
    supportingText: "Complete your assessment (2 of 4 steps completed)",
  },
};

/** `Action required` with a deadline — the line names the action and its date (`applications-card.md` §2.4.1 copy rules). */
export const ActionRequiredWithDeadline: Story = {
  args: {
    statusLabel: "Action required",
    statusTone: "warning",
    supportingText: "Complete your assessment by Sep 28",
  },
};

/** A confirmed interview — the badge says "scheduled", so the line is just the date and time. */
export const InterviewScheduled: Story = {
  args: {
    statusLabel: "Interview scheduled",
    statusTone: "success",
    supportingText: "Sep 30 at 2 PM EDT",
  },
};

/** Interview completed, awaiting an outcome — the only place `In review` is used (`applications-card.md` §2.4.1). */
export const InReview: Story = {
  args: {
    statusLabel: "In review",
    statusTone: "success",
    supportingText: "Awaiting partner review after your Sep 18 interview",
  },
};

export const InterviewActionRequired: Story = {
  args: {
    statusLabel: "Interview · Action required",
    statusTone: "warning",
    supportingText: "Schedule your interview by Sep 30",
  },
};

export const OnHold: Story = {
  args: {
    statusLabel: "On hold",
    statusTone: "purple",
    supportingText: undefined,
  },
};

export const OfferReceived: Story = {
  args: {
    statusLabel: "Offer received",
    statusTone: "success",
    supportingText: undefined,
  },
};

export const NotSelected: Story = {
  args: {
    statusLabel: "Not selected",
    statusTone: "neutral",
    supportingText: undefined,
  },
};

export const Withdrawn: Story = {
  args: {
    statusLabel: "Withdrawn",
    statusTone: "neutral",
    supportingText: undefined,
  },
};

export const NoSupportingText: Story = {
  args: {
    supportingText: undefined,
  },
};

export const NoDuration: Story = {
  args: {
    duration: undefined,
  },
};

/** Hover the row, then open the `···` trigger: View Details, Share, and a destructive Withdraw (PRD §4.1). */
export const WithActionsMenu: Story = {
  args: {
    actionsMenuLabel: "More actions",
    actionsMenu: (
      <>
        <MenuItem icon={AlignLeft}>View Details</MenuItem>
        <MenuItem icon={Share06}>Share</MenuItem>
        <MenuSeparator />
        <MenuItem icon={XCircle} tone="destructive">Withdraw</MenuItem>
      </>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-[1174px] flex-col divide-y divide-border">
      <ApplicationCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        duration="3 months"
        company="verita"
        partnerName="Verita partner"
        statusLabel="Applied"
        statusTone="info"
        actionsMenuLabel="More actions"
        onActionsPress={() => {}}
      />
      <ApplicationCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        duration="3 months"
        company="verita"
        partnerName="Verita partner"
        statusLabel="Action required"
        statusTone="warning"
        supportingText="Complete your assessment (2 of 4 steps completed)"
      />
      <ApplicationCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        duration="3 months"
        company="verita"
        partnerName="Verita partner"
        statusLabel="Interview scheduled"
        statusTone="success"
        supportingText="Sep 30 at 2 PM EDT"
      />
      <ApplicationCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        duration="3 months"
        company="verita"
        partnerName="Verita partner"
        statusLabel="In review"
        statusTone="success"
        supportingText="Awaiting partner review after your Sep 18 interview"
      />
      <ApplicationCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        duration="3 months"
        company="verita"
        partnerName="Verita partner"
        statusLabel="Interview · Action required"
        statusTone="warning"
        supportingText="Schedule your interview by Sep 30"
      />
      <ApplicationCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        duration="3 months"
        company="verita"
        partnerName="Verita partner"
        statusLabel="On hold"
        statusTone="purple"
      />
      <ApplicationCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        duration="3 months"
        company="verita"
        partnerName="Verita partner"
        statusLabel="Offer received"
        statusTone="success"
      />
      <ApplicationCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        duration="3 months"
        company="verita"
        partnerName="Verita partner"
        statusLabel="Not selected"
        statusTone="neutral"
      />
      <ApplicationCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        duration="3 months"
        company="verita"
        partnerName="Verita partner"
        statusLabel="Withdrawn"
        statusTone="neutral"
      />
    </div>
  ),
};

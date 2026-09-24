import type { Meta, StoryObj } from "@storybook/react-vite";
import { partnerLogos } from "@/assets/logos";
import { AlignLeft, Share06, XCircle } from "@untitledui/icons";

import { MenuItem } from "@/components/overlays/menu";
import { ApplicationCard, ApplicationCardGroup } from "./application-card";

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
        <MenuItem icon={XCircle} tone="destructive">Withdraw</MenuItem>
      </>
    ),
  },
};

/**
 * Supporting text's two positions: beside the badge on the right, wrapping to at most 2 lines (wide, medium),
 * and as the left container's 4th row once it would need a 3rd line there (narrow). Resize the canvas to watch it switch.
 */
export const SupportingTextPlacement: Story = {
  args: {
    statusLabel: "Action required",
    statusTone: "warning",
    supportingText: "Complete your assessment (2 of 4 steps completed)",
    actionsMenuLabel: "More actions",
    onActionsPress: () => {},
  },
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-6 bg-white">
        <div className="w-[1174px] border border-border">
          <Story />
        </div>
        <div className="w-[900px] border border-border">
          <Story />
        </div>
        <div className="w-[640px] border border-border">
          <Story />
        </div>
      </div>
    ),
  ],
};

/**
 * `ApplicationCardGroup`: the long row's text would need a 3rd line on the right, so every row in the list
 * shows its supporting text as the 4th row — including the short one that would fit on its own.
 */
export const GroupedList: Story = {
  render: () => (
    <ApplicationCardGroup>
      <div className="flex w-[760px] flex-col divide-y divide-border border border-border bg-white">
        <ApplicationCard
          title="Senior Financial Analyst"
          compensation="$95–115k/yr"
          engagementTerms="32 hrs/week"
          duration="1 year"
          company="verita"
          partnerName="Verita partner"
          statusLabel="Action required"
          statusTone="warning"
          supportingText="Complete your assessment (2 of 4 steps completed)"
        />
        <ApplicationCard
          title="Clinical Data Coordinator"
          compensation="$85/hr"
          engagementTerms="15 hrs/week"
          duration="2 weeks"
          company="verita"
          partnerName="Verita partner"
          statusLabel="Interview scheduled"
          statusTone="success"
          supportingText="Sep 30 at 2 PM EDT"
        />
        <ApplicationCard
          title="Search Quality Analyst"
          compensation="$60/hr"
          engagementTerms="Up to 25 hrs/week"
          company="verita"
          partnerName="Verita partner"
          statusLabel="Applied"
          statusTone="info"
        />
      </div>
    </ApplicationCardGroup>
  ),
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

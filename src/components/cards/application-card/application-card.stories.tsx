import type { Meta, StoryObj } from "@storybook/react-vite";
import { ApplicationCard } from "./application-card";

const meta: Meta<typeof ApplicationCard> = {
  title: "Cards/ApplicationCard",
  component: ApplicationCard,
  tags: ["autodocs"],
  args: {
    title: "Strategic Finance Expert",
    compensation: "$56/hour",
    engagementTerms: "Up to 30 hrs/week",
    partnerName: "Bank of America",
    statusLabel: "In review",
    statusTone: "success",
    supportingText: "Applied 2 days ago",
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

export const NotSubmitted: Story = {
  args: {
    statusLabel: "Not submitted",
    statusTone: "neutral",
    supportingText: "2 of 4 steps completed",
  },
};

export const Applied: Story = {
  args: {
    statusLabel: "Applied",
    statusTone: "info",
    supportingText: "Applied just now",
  },
};

export const InReview: Story = {
  args: {
    statusLabel: "In review",
    statusTone: "success",
    supportingText: "Applied 2 days ago",
  },
};

export const InReviewActionRequired: Story = {
  args: {
    statusLabel: "In review · Action required",
    statusTone: "warning",
    supportingText: "Complete your assessment · 2 of 4 steps completed",
  },
};

export const Interview: Story = {
  args: {
    statusLabel: "Interview",
    statusTone: "success",
    supportingText: "Interview scheduled for Sep 24 at 10 AM EDT",
  },
};

export const InterviewActionRequired: Story = {
  args: {
    statusLabel: "Interview · Action required",
    statusTone: "warning",
    supportingText: "Schedule your interview by Sep 22",
  },
};

export const OnHold: Story = {
  args: {
    statusLabel: "On hold",
    statusTone: "purple",
    supportingText: "Placed on hold Sep 18",
  },
};

export const OfferReceived: Story = {
  args: {
    statusLabel: "Offer received",
    statusTone: "success",
    supportingText: "Offer received Sep 18",
  },
};

export const NotSelected: Story = {
  args: {
    statusLabel: "Not selected",
    statusTone: "neutral",
    supportingText: "Application closed Sep 18",
  },
};

export const Withdrawn: Story = {
  args: {
    statusLabel: "Withdrawn",
    statusTone: "neutral",
    supportingText: "Withdrawn Sep 18",
  },
};

export const NoSupportingText: Story = {
  args: {
    supportingText: undefined,
  },
};

export const WithActionsMenu: Story = {
  args: {
    actionsMenuLabel: "More actions",
    onActionsPress: () => {},
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-[1174px] flex-col divide-y divide-border">
      <ApplicationCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        partnerName="Bank of America"
        statusLabel="Not submitted"
        statusTone="neutral"
        supportingText="2 of 4 steps completed"
      />
      <ApplicationCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        partnerName="Bank of America"
        statusLabel="Applied"
        statusTone="info"
        supportingText="Applied just now"
      />
      <ApplicationCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        partnerName="Bank of America"
        statusLabel="In review"
        statusTone="success"
        supportingText="Applied 2 days ago"
        actionsMenuLabel="More actions"
        onActionsPress={() => {}}
      />
      <ApplicationCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        partnerName="Bank of America"
        statusLabel="In review · Action required"
        statusTone="warning"
        supportingText="Complete your assessment · 2 of 4 steps completed"
      />
      <ApplicationCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        partnerName="Bank of America"
        statusLabel="Interview"
        statusTone="success"
        supportingText="Interview scheduled for Sep 24 at 10 AM EDT"
      />
      <ApplicationCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        partnerName="Bank of America"
        statusLabel="Interview · Action required"
        statusTone="warning"
        supportingText="Schedule your interview by Sep 22"
      />
      <ApplicationCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        partnerName="Bank of America"
        statusLabel="On hold"
        statusTone="purple"
        supportingText="Placed on hold Sep 18"
      />
      <ApplicationCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        partnerName="Bank of America"
        statusLabel="Offer received"
        statusTone="success"
        supportingText="Offer received Sep 18"
      />
      <ApplicationCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        partnerName="Bank of America"
        statusLabel="Not selected"
        statusTone="neutral"
        supportingText="Application closed Sep 18"
      />
      <ApplicationCard
        title="Strategic Finance Expert"
        compensation="$56/hour"
        engagementTerms="Up to 30 hrs/week"
        partnerName="Bank of America"
        statusLabel="Withdrawn"
        statusTone="neutral"
        supportingText="Withdrawn Sep 18"
      />
    </div>
  ),
};

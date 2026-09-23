import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContractCard } from "./contract-card";

const meta: Meta<typeof ContractCard> = {
  title: "Cards/ContractCard",
  component: ContractCard,
  tags: ["autodocs"],
  args: {
    rowProps: { onClick: () => {} },
    company: "verita",
    title: "Product Design Advisor",
    compensation: "$85/hour",
    partnerName: "Verita partner",
    engagementTerms: "Up to 30 hrs/week",
  },
  decorators: [
    (Story) => (
      <div className="bg-white p-4">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof ContractCard>;

export const Default: Story = {
  args: {
    primaryActionLabel: "Open work",
  },
};

/** Partner tile with no `logoSrc` — the neutral fallback shown until a partner logo is supplied. */
export const PartnerAvatar: Story = {
  args: {
    company: "partner",
    partnerName: "Amazon Health",
    primaryActionLabel: "Open work",
  },
};

/** A title longer than two lines truncates with an ellipsis on line 2. */
export const LongTitle: Story = {
  args: {
    title: "Clinical Expert, In-Home Health Evaluation Survey and Longitudinal Sleep Study Review",
    primaryActionLabel: "Open work",
  },
};

export const WithDuration: Story = {
  args: {
    duration: "3 months",
    primaryActionLabel: "Open work",
  },
};

export const WithStatusBadge: Story = {
  args: {
    statusLabel: "Awaiting start",
    primaryActionLabel: "Complete setup",
  },
};

export const WithProgress: Story = {
  args: {
    progress: {
      metricLabel: "12 of 30 hours used",
      percentageLabel: "40%",
      percentage: 40,
    },
    primaryActionLabel: "Open work",
  },
};

export const ActionRequired: Story = {
  args: {
    statusLabel: "Action required",
    statusTone: "warning",
    instructions: "Submit availability before Sep 21, 8:00 AM EDT",
    instructionsUrgent: true,
    progress: {
      metricLabel: "12 of 30 hours used",
      percentageLabel: "40%",
      percentage: 40,
    },
    primaryActionLabel: "Submit availability",
  },
};

export const WithInstructionsNotUrgent: Story = {
  args: {
    statusLabel: "Action required",
    statusTone: "warning",
    instructions: "Submit availability before Sep 25, 8:00 AM EDT",
    primaryActionLabel: "Submit availability",
  },
};

export const Paused: Story = {
  args: {
    statusLabel: "Paused",
    compensation: "$1,500 per project",
    engagementTerms: "One-time",
  },
};

export const NoAction: Story = {
  args: {
    statusLabel: "Completed",
    progress: {
      metricLabel: "5 of 5 deliverables accepted",
      percentageLabel: "100%",
      percentage: 100,
    },
  },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <ContractCard {...args} primaryActionLabel="Open work" />
      <ContractCard {...args} duration="3 months" primaryActionLabel="Open work" />
      <ContractCard
        {...args}
        statusLabel="Awaiting start"
        primaryActionLabel="Complete setup"
      />
      <ContractCard
        {...args}
        progress={{
          metricLabel: "12 of 30 hours used",
          percentageLabel: "40%",
          percentage: 40,
        }}
        primaryActionLabel="Open work"
      />
      <ContractCard
        {...args}
        statusLabel="Action required"
        statusTone="warning"
        instructions="Submit availability before Sep 21, 8:00 AM EDT"
        instructionsUrgent
        progress={{
          metricLabel: "12 of 30 hours used",
          percentageLabel: "40%",
          percentage: 40,
        }}
        primaryActionLabel="Submit availability"
      />
      <ContractCard
        {...args}
        statusLabel="Paused"
        compensation="$1,500 per project"
        engagementTerms="One-time"
      />
      <ContractCard
        {...args}
        statusLabel="Completed"
        progress={{
          metricLabel: "5 of 5 deliverables accepted",
          percentageLabel: "100%",
          percentage: 100,
        }}
      />
    </div>
  ),
};

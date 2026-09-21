import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContractCard } from "./contract-card";

const meta: Meta<typeof ContractCard> = {
  title: "Cards/ContractCard",
  component: ContractCard,
  tags: ["autodocs"],
  args: {
    title: "Product Design Advisor",
    compensation: "$85/hour",
    workArrangement: "Project-based",
    partnerName: "Verita partner",
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
    progress: {
      metricLabel: "12 of 30 hours used",
      percentageLabel: "40%",
      percentage: 40,
    },
    primaryActionLabel: "Submit availability",
  },
};

export const Paused: Story = {
  args: {
    statusLabel: "Paused",
    compensation: "$1,500 per project",
    workArrangement: "One-time",
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
        workArrangement="One-time"
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

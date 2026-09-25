import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileCheck02 } from "@untitledui/icons";

import { EmptyState } from "./empty-state";

const meta: Meta<typeof EmptyState> = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  args: {
    title: "No completed contracts",
    description: "Contracts will appear here when your work is complete.",
  },
  decorators: [
    (Story) => (
      // Stands in for an empty filter panel; the empty state centers itself in it.
      <div className="flex h-[400px] w-[800px] bg-white">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

/** Engagements → Contracts → Completed (Figma: Verita `Contracts`, `node-id=5701-7251`). */
export const Default: Story = {};

/** With a CTA — Engagements → Talent Network → Active (Figma: Verita `Talent Network`, `node-id=5702-7522`). */
export const WithAction: Story = {
  args: {
    title: "You haven’t joined a talent network yet",
    description: "Apply to a talent network that matches your expertise to be considered for future opportunities.",
    buttonLabel: "Discover talent networks",
    buttonProps: { onPress: () => {} },
  },
};

/** Title only, no description. */
export const TitleOnly: Story = {
  args: { description: undefined },
};

/** With an icon above the title — Figma has no icon yet; this shows the slot. */
export const WithIcon: Story = {
  args: {
    icon: <FileCheck02 className="size-8 text-icon-muted" />,
  },
};

export const AllVariants: Story = {
  decorators: [(Story) => <div className="flex w-[800px] flex-col gap-10 bg-white py-10">{<Story />}</div>],
  render: (args) => (
    <>
      <EmptyState {...args} />
      <EmptyState {...args} description={undefined} />
      <EmptyState {...args} icon={<FileCheck02 className="size-8 text-icon-muted" />} />
      <EmptyState {...args} buttonLabel="Discover talent networks" buttonProps={{ onPress: () => {} }} />
    </>
  ),
};

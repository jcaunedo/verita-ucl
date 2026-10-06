import type { Meta, StoryObj } from "@storybook/react-vite";

import { Typography } from "@/components/typography";

import { TabUnderline, TabUnderlineList, TabUnderlinePanel, TabUnderlines } from "./tab-underline";

const meta: Meta<typeof TabUnderline> = {
  title: "Navigation/TabUnderline",
  component: TabUnderline,
  subcomponents: { TabUnderlineList },
  tags: ["autodocs"],
  args: { label: "Tab" },
  decorators: [
    (Story) => (
      <div className="bg-white p-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof TabUnderline>;

/** A single tab (Figma `State=Active` — the only tab, so it's selected). */
export const Default: Story = {
  render: (args) => (
    <TabUnderlines>
      <TabUnderlineList aria-label="Tabs">
        <TabUnderline id="only" {...args} />
      </TabUnderlineList>
    </TabUnderlines>
  ),
};

/** Figma `Tab Group Underline` — select a tab to see the underline glide. Hover the unselected one for its hover state. */
export const Group: Story = {
  render: () => (
    <TabUnderlines defaultSelectedKey="referrals" className="flex flex-col gap-4">
      <TabUnderlineList aria-label="Referrals views">
        <TabUnderline id="referrals" label="My referrals" />
        <TabUnderline id="network" label="My network" />
      </TabUnderlineList>
      <TabUnderlinePanel id="referrals">
        <Typography className="text-foreground-muted">Everyone you've referred.</Typography>
      </TabUnderlinePanel>
      <TabUnderlinePanel id="network">
        <Typography className="text-foreground-muted">People in your network you could refer.</Typography>
      </TabUnderlinePanel>
    </TabUnderlines>
  ),
};

/** With counters (Figma `Counter`): the active tab's pill is `tone/brand/muted`, the others `tone-neutral-subtle`. */
export const WithCounters: Story = {
  render: () => (
    <TabUnderlines defaultSelectedKey="referrals">
      <TabUnderlineList aria-label="Referrals views">
        <TabUnderline id="referrals" label="My referrals" count={7} />
        <TabUnderline id="network" label="My network" count={0} />
      </TabUnderlineList>
    </TabUnderlines>
  ),
};

/** Every state at once: Active, Default, and Disabled (no Figma source for disabled). */
export const AllVariants: Story = {
  render: () => (
    <TabUnderlines defaultSelectedKey="active" disabledKeys={["disabled"]}>
      <TabUnderlineList aria-label="All states">
        <TabUnderline id="active" label="Active" />
        <TabUnderline id="default" label="Default" />
        <TabUnderline id="disabled" label="Disabled" />
      </TabUnderlineList>
    </TabUnderlines>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Typography } from "@/components/typography";

import {
  TabButton,
  TabButtonList,
  TabButtonPanel,
  TabButtons,
} from "./tab-button";

const meta: Meta<typeof TabButton> = {
  title: "Navigation/TabButton",
  component: TabButton,
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
type Story = StoryObj<typeof TabButton>;

const tabs = [
  { id: "open", label: "Open", count: 5 },
  { id: "moving-forward", label: "Moving forward", count: 1 },
  { id: "not-moving-forward", label: "Not moving forward" },
];

/** A single tab (Figma `State=Active` — the only tab, so it's selected). Hover the others in `Group` for `State=Hover`. */
export const Default: Story = {
  render: (args) => (
    <TabButtons>
      <TabButtonList aria-label="Tabs">
        <TabButton id="only" {...args} />
      </TabButtonList>
    </TabButtons>
  ),
};

/** Default / Hover / Active with counters — select a tab to watch the dark fill glide to it. */
export const Group: Story = {
  render: () => (
    <TabButtons defaultSelectedKey="open">
      <TabButtonList aria-label="Application filters">
        {tabs.map((tab) => (
          <TabButton key={tab.id} id={tab.id} label={tab.label} count={tab.count} />
        ))}
      </TabButtonList>
    </TabButtons>
  ),
};

/** Figma `Size=sm · 36`. */
export const Small: Story = {
  render: () => (
    <TabButtons defaultSelectedKey="open">
      <TabButtonList aria-label="Application filters">
        {tabs.map((tab) => (
          <TabButton key={tab.id} id={tab.id} label={tab.label} count={tab.count} size="sm" />
        ))}
      </TabButtonList>
    </TabButtons>
  ),
};

/** Without counters (Figma `showCounter` off). */
export const WithoutCounters: Story = {
  render: () => (
    <TabButtons defaultSelectedKey="open">
      <TabButtonList aria-label="Tabs">
        {tabs.map((tab) => (
          <TabButton key={tab.id} id={tab.id} label={tab.label} />
        ))}
      </TabButtonList>
    </TabButtons>
  ),
};

/** With panels: each tab controls a `TabButtonPanel`. */
export const WithPanels: Story = {
  render: () => (
    <TabButtons defaultSelectedKey="open" className="flex flex-col gap-6">
      <TabButtonList aria-label="Application filters">
        {tabs.map((tab) => (
          <TabButton key={tab.id} id={tab.id} label={tab.label} count={tab.count} />
        ))}
      </TabButtonList>
      {tabs.map((tab) => (
        <TabButtonPanel key={tab.id} id={tab.id}>
          <Typography size="sm" className="text-foreground-muted">
            {tab.label} panel
          </Typography>
        </TabButtonPanel>
      ))}
    </TabButtons>
  ),
};

/** Both sizes, plus a disabled tab (no Figma state — uses Button's disabled text treatment). */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["md", "sm"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <Typography size="xs" className="text-foreground-muted">
            {size === "md" ? "md · 40" : "sm · 36"}
          </Typography>
          <TabButtons defaultSelectedKey="open" disabledKeys={size === "sm" ? ["not-moving-forward"] : []}>
            <TabButtonList aria-label={`Filters ${size}`}>
              {tabs.map((tab) => (
                <TabButton key={tab.id} id={tab.id} label={tab.label} count={tab.count} size={size} />
              ))}
            </TabButtonList>
          </TabButtons>
        </div>
      ))}
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Typography } from "@/components/typography";

import {
  MetricTab,
  MetricTabList,
  MetricTabPanel,
  MetricTabs,
} from "./metric-tab";

const meta: Meta<typeof MetricTab> = {
  title: "Navigation/MetricTab",
  component: MetricTab,
  tags: ["autodocs"],
  args: { label: "Label", value: "#" },
  decorators: [
    (Story) => (
      <div className="bg-white p-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof MetricTab>;

const metrics = [
  { id: "applications", label: "Applications", value: 12 },
  { id: "matches", label: "Matches", value: 4 },
  { id: "offers", label: "Offers", value: 2 },
  { id: "contracts", label: "Contracts", value: 1 },
  { id: "assessments", label: "Assessments", value: 0 },
];

/** A single tab (Figma `Property 1=Active` — the only tab, so it's selected). Hover the others in `Group` for `Property 1=Hover`. */
export const Default: Story = {
  render: (args) => (
    <MetricTabs>
      <MetricTabList aria-label="Metrics" className="w-60">
        <MetricTab id="only" {...args} />
      </MetricTabList>
    </MetricTabs>
  ),
};

/** Default / Hover / Active together — select a tab to watch the brand border glide to it. */
export const Group: Story = {
  render: () => (
    <MetricTabs defaultSelectedKey="applications">
      <MetricTabList aria-label="Metrics">
        {metrics.map((metric) => (
          <MetricTab key={metric.id} id={metric.id} label={metric.label} value={metric.value} />
        ))}
      </MetricTabList>
    </MetricTabs>
  ),
};

/** With panels: each tab controls a `MetricTabPanel`. */
export const WithPanels: Story = {
  render: () => (
    <MetricTabs defaultSelectedKey="applications" className="flex flex-col gap-6">
      <MetricTabList aria-label="Metrics">
        {metrics.map((metric) => (
          <MetricTab key={metric.id} id={metric.id} label={metric.label} value={metric.value} />
        ))}
      </MetricTabList>
      {metrics.map((metric) => (
        <MetricTabPanel key={metric.id} id={metric.id}>
          <Typography size="sm" className="text-foreground-muted">
            {metric.label} panel
          </Typography>
        </MetricTabPanel>
      ))}
    </MetricTabs>
  ),
};

/** A disabled tab (no Figma state — uses Button's disabled text treatment); keyboard navigation skips it. */
export const Disabled: Story = {
  render: () => (
    <MetricTabs defaultSelectedKey="applications" disabledKeys={["offers"]}>
      <MetricTabList aria-label="Metrics">
        {metrics.map((metric) => (
          <MetricTab key={metric.id} id={metric.id} label={metric.label} value={metric.value} />
        ))}
      </MetricTabList>
    </MetricTabs>
  ),
};

/** Two independent lists on one page — each indicator glides only within its own list. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {["First list", "Second list"].map((name) => (
        <div key={name} className="flex flex-col gap-2">
          <Typography size="xs" className="text-foreground-muted">
            {name}
          </Typography>
          <MetricTabs defaultSelectedKey="matches" disabledKeys={name === "Second list" ? ["contracts"] : []}>
            <MetricTabList aria-label={name}>
              {metrics.map((metric) => (
                <MetricTab key={metric.id} id={metric.id} label={metric.label} value={metric.value} />
              ))}
            </MetricTabList>
          </MetricTabs>
        </div>
      ))}
    </div>
  ),
};

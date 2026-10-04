import type { Meta, StoryObj } from "@storybook/react-vite";

import { DEMO_CONNECTIONS } from "@/layouts/shared/demo-connections";
import { DEMO_REFERRALS } from "@/layouts/shared/demo-referrals";
import { PROTOTYPE_NAV_HREFS } from "@/layouts/shared/prototype-nav-hrefs";
import { Referrals } from "./referrals";

const meta: Meta<typeof Referrals> = {
  title: "Layouts/Referrals",
  component: Referrals,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: { navHrefOverrides: PROTOTYPE_NAV_HREFS },
};
export default meta;
type Story = StoryObj<typeof Referrals>;

/**
 * The prototype's starting point: no referrals and no network, so both tabs show their empty states. Figma: `My
 * referrals Empty State`. "or start with your network" → "Upload connections" fills both tabs.
 */
export const Default: Story = {};

/**
 * Referrals and network already in: My referrals at every stage from `Referred` to `Paid`, and My network's 43
 * connections. Figma: `My referrals`. The account menu's "Referrals with content" opens this.
 */
export const WithReferrals: Story = {
  args: { defaultReferrals: DEMO_REFERRALS, defaultConnections: DEMO_CONNECTIONS },
};

/** The My network tab before any connections are imported. "Upload connections" imports the demo network. */
export const MyNetwork: Story = {
  args: { defaultView: "network" },
};

/** My network with connections: search, filters, the activity dropdown, and the connection table. Figma: `My network`. */
export const MyNetworkConnections: Story = {
  args: { defaultView: "network", defaultConnections: DEMO_CONNECTIONS, defaultReferrals: DEMO_REFERRALS },
};

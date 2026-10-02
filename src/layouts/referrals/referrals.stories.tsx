import type { Meta, StoryObj } from "@storybook/react-vite";

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

/** My referrals with referrals at every stage from `Referred` to `Paid`. Figma: `My referrals`. */
export const Default: Story = {};

/** No referrals yet: the summary at zero and the empty state. Figma: `My referrals Empty State`. */
export const Empty: Story = {
  args: { referrals: [] },
};

/** The My network tab before any connections are imported. Figma: `My network`. */
export const MyNetwork: Story = {
  args: { defaultView: "network" },
};

import type { Meta, StoryObj } from "@storybook/react-vite";

import { PROTOTYPE_NAV_HREFS } from "@/layouts/shared/prototype-nav-hrefs";
import { PlaceholderPage } from "./placeholder-page";

const meta: Meta<typeof PlaceholderPage> = {
  title: "Layouts/PlaceholderPage",
  component: PlaceholderPage,
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: { navHrefOverrides: PROTOTYPE_NAV_HREFS },
};
export default meta;
type Story = StoryObj<typeof PlaceholderPage>;

/** The sidebar's Discover page. No design yet: title only. */
export const Discover: Story = {
  args: { title: "Discover", activeNavKey: "discover" },
};

/** The sidebar's Earnings page. No design yet: title only. */
export const Earnings: Story = {
  args: { title: "Earnings", activeNavKey: "earnings" },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { PROTOTYPE_NAV_HREFS } from "@/layouts/shared/prototype-nav-hrefs";
import { DashboardEmptyState } from "./dashboard-empty-state";

const meta: Meta<typeof DashboardEmptyState> = {
  title: "Layouts/DashboardEmptyState",
  component: DashboardEmptyState,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof DashboardEmptyState>;

/**
 * "Home" opens the populated `Dashboard` story, the prototype's home page,
 * like every other layout's Home link. Relative `iframe.html` URLs so they
 * work on any Storybook host (local or Netlify).
 */
export const Default: Story = {
  args: {
    navHrefOverrides: PROTOTYPE_NAV_HREFS,
    // Clicking "Welcome back, Theresa" jumps to the populated `Dashboard` story (relative URL — works on any Storybook host).
    welcomeHref: "iframe.html?id=layouts-dashboard--default&viewMode=story",
  },
};

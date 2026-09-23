import type { Meta, StoryObj } from "@storybook/react-vite";
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
 * "Home" links back to this same story's own iframe URL rather than the
 * illustrative `/home` placeholder — for sharing this story as a clickable
 * prototype with the team (open its direct `?viewMode=story` URL in a
 * browser tab; clicking Home then behaves like landing on the home page
 * instead of a dead link). This repo has no router, so a self-link is the
 * closest thing to a real "Home" destination without introducing one.
 */
export const Default: Story = {
  args: {
    navHrefOverrides: {
      home: "http://localhost:6009/iframe.html?id=layouts-dashboardemptystate--default&viewMode=story",
      engagements: "iframe.html?id=layouts-engagements--default&viewMode=story",
    },
    // Clicking "Welcome back, Theresa" jumps to the populated `Dashboard` story (relative URL — works on any Storybook host).
    welcomeHref: "iframe.html?id=layouts-dashboard--default&viewMode=story",
  },
};

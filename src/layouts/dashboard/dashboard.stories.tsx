import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dashboard } from "./dashboard";

const meta: Meta<typeof Dashboard> = {
  title: "Layouts/Dashboard",
  component: Dashboard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof Dashboard>;

/**
 * "Home" links to the `DashboardEmptyState` story — for sharing the two
 * layouts as one clickable prototype (open this story's direct
 * `?viewMode=story` URL; clicking Home lands on the empty-state dashboard).
 * Relative `iframe.html` URL so it works on any Storybook host (local dev
 * server or a static build), not just `localhost:6009`.
 */
export const Default: Story = {
  args: {
    navHrefOverrides: {
      home: "iframe.html?id=layouts-dashboardemptystate--default&viewMode=story",
    },
  },
};

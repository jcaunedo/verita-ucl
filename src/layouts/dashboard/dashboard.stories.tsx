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
 * The prototype's links (open this story's direct `?viewMode=story` URL):
 * Home reloads this populated Dashboard, Engagements opens the `Engagements`
 * layout. The empty-state dashboard is reached from the account menu's page
 * links instead (`prototype-account-menu.tsx`). "Open applications" → "View
 * All" also opens `Engagements`, whose default story lands on Applications
 * with the `Open` filter selected; "Current contracts" → "View All" opens its
 * `Contracts` story (Contracts view, `Current` filter).
 * Relative `iframe.html` URL so it works on any Storybook host (local dev
 * server or a static build), not just `localhost:6009`.
 */
export const Default: Story = {
  args: {
    navHrefOverrides: {
      home: "iframe.html?id=layouts-dashboard--default&viewMode=story",
      engagements: "iframe.html?id=layouts-engagements--default&viewMode=story",
    },
    viewAllApplicationsHref: "iframe.html?id=layouts-engagements--default&viewMode=story",
    viewAllContractsHref: "iframe.html?id=layouts-engagements--contracts&viewMode=story",
  },
};

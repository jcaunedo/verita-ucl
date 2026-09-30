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
 * links instead (`prototype-account-menu.tsx`). "Applications" → "View
 * All" also opens `Engagements`, whose default story lands on Applications
 * with the `In progress` filter selected; "Current contracts" → "View All" opens its
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

/**
 * Two open offers under "2 new offers for you": one expiring within 5 days (red countdown) and one after (muted
 * date), per `offer-card.md` §2.3. Opened from the account menu's "2 offers" page link. Home and Engagements stay in
 * this scenario: Engagements opens its "2 offers" story (Offers view, with every closed-offer outcome under `Closed`).
 */
export const TwoOffers: Story = {
  name: "2 offers",
  args: {
    ...Default.args,
    navHrefOverrides: {
      home: "iframe.html?id=layouts-dashboard--two-offers&viewMode=story",
      engagements: "iframe.html?id=layouts-engagements--two-offers&viewMode=story",
    },
    offerLimit: 2,
  },
};

/**
 * The offer alert banner option (Figma: Verita → `Dashboard`, `node-id=6095-2350`): the two open offers are one info
 * `Alert` above Next steps instead of the "2 new offers for you" rows. Clicking it opens Engagements → Offers; its ×
 * hides it for this visit. Opened from the account menu's "Offer alert banner" page link.
 */
export const OfferAlertBanner: Story = {
  name: "Offer alert banner",
  args: {
    ...Default.args,
    navHrefOverrides: {
      ...Default.args?.navHrefOverrides,
      home: "iframe.html?id=layouts-dashboard--offer-alert-banner&viewMode=story",
    },
    offerLimit: 2,
    offerDisplay: "banner",
    viewOffersHref: "iframe.html?id=layouts-engagements--offers&viewMode=story",
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { PROTOTYPE_NAV_HREFS } from "@/layouts/shared/prototype-nav-hrefs";
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
 * with the `In progress` filter selected; "Current contracts" → "View all" opens its
 * `Contracts` story (Contracts view, `Current` filter). The Offer card leading Next steps ("1 new offer") opens
 * Engagements → Offers → `Awaiting response`.
 * Relative `iframe.html` URL so it works on any Storybook host (local dev
 * server or a static build), not just `localhost:6009`.
 */
export const Default: Story = {
  args: {
    navHrefOverrides: PROTOTYPE_NAV_HREFS,
    viewAllApplicationsHref: "iframe.html?id=layouts-engagements--default&viewMode=story",
    viewAllContractsHref: "iframe.html?id=layouts-engagements--contracts&viewMode=story",
    viewOffersHref: "iframe.html?id=layouts-engagements--offers&viewMode=story",
  },
};

/**
 * Two open offers: the Offer card reads "2 new offers" and names the soonest expiration ("Next offer expires in 3
 * days"). Opened from the account menu's "2 offers" page link. Home and Engagements stay in this scenario: the card
 * and Engagements open its "2 offers" story (Offers view, with every closed-offer outcome under `Closed`).
 */
export const TwoOffers: Story = {
  name: "2 offers",
  args: {
    ...Default.args,
    navHrefOverrides: {
      ...PROTOTYPE_NAV_HREFS,
      home: "iframe.html?id=layouts-dashboard--two-offers&viewMode=story",
      engagements: "iframe.html?id=layouts-engagements--two-offers&viewMode=story",
    },
    offerLimit: 2,
    viewOffersHref: "iframe.html?id=layouts-engagements--two-offers&viewMode=story",
  },
};

/**
 * The offer alert banner option (Figma: Verita → `Dashboard`, `node-id=6095-2350`): the two open offers are one info
 * `Alert` above Next steps instead of the Offer card. Clicking it opens Engagements → Offers; its ×
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

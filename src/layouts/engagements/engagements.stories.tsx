import type { Meta, StoryObj } from "@storybook/react-vite";
import { DEMO_CLOSED_OFFERS } from "@/layouts/shared/demo-engagements";
import { Engagements } from "./engagements";

const meta: Meta<typeof Engagements> = {
  title: "Layouts/Engagements",
  component: Engagements,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof Engagements>;

/** "Home" links to the `Dashboard` story and "Engagements" to this story, for clicking between the layouts as one prototype. */
export const Default: Story = {
  args: {
    navHrefOverrides: {
      home: "iframe.html?id=layouts-dashboard--default&viewMode=story",
      engagements: "iframe.html?id=layouts-engagements--default&viewMode=story",
    },
  },
};

/** Opens on the Contracts view — two `ContractCard`s. */
export const Contracts: Story = {
  args: { ...Default.args, defaultView: "contracts" },
};

/** Opens on the Offers view — two open offers in one table list, one expiring within 5 days and one after. */
export const Offers: Story = {
  args: { ...Default.args, defaultView: "offers" },
};

/**
 * The "2 offers" scenario's Engagements, reached from the "2 offers" Dashboard: opens on Offers, and `Closed` already
 * lists one offer per closed outcome (`offer-card.md` §3.2) — declined, withdrawn by the partner, expired with no
 * response, and declined but since expired. Home links back to the "2 offers" Dashboard.
 */
export const TwoOffers: Story = {
  name: "2 offers",
  args: {
    navHrefOverrides: {
      home: "iframe.html?id=layouts-dashboard--two-offers&viewMode=story",
      engagements: "iframe.html?id=layouts-engagements--two-offers&viewMode=story",
    },
    defaultView: "offers",
    closedOffers: DEMO_CLOSED_OFFERS,
  },
};

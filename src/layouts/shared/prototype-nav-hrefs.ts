import type { SidebarProps } from "@/components/navigation/sidebar";

/**
 * Where each sidebar item goes in the prototype: every main nav item opens a
 * layout story, so the whole sidebar is clickable from any page. Stories pass
 * this as `navHrefOverrides` and override single entries to stay in a scenario
 * (e.g. the "2 offers" pages). Relative `iframe.html` URLs so they work on any
 * Storybook host (local or Netlify).
 */
const PROTOTYPE_NAV_HREFS = {
  home: "iframe.html?id=layouts-dashboard--default&viewMode=story",
  discover: "iframe.html?id=layouts-placeholderpage--discover&viewMode=story",
  engagements: "iframe.html?id=layouts-engagements--default&viewMode=story",
  earnings: "iframe.html?id=layouts-placeholderpage--earnings&viewMode=story",
  referrals: "iframe.html?id=layouts-placeholderpage--referrals&viewMode=story",
} satisfies NonNullable<SidebarProps["navHrefOverrides"]>;

export { PROTOTYPE_NAV_HREFS };

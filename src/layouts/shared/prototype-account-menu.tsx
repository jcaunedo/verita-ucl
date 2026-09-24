import { ArrowUpRight, LogOut01, ReverseLeft, Settings02, Translate01, UserCircle } from "@untitledui/icons";

import type { SidebarProps } from "@/components/navigation/sidebar";
import { AccountMenuItem } from "@/components/overlays/account-menu";
import { MenuSeparator } from "@/components/overlays/menu";
import { restartPrototype } from "@/layouts/shared/demo-state";

/**
 * Pages the prototype can jump straight to from the account menu (Figma's
 * "Link to page" item, `arrow-up-right`) — states you can't reach by
 * clicking through, like an empty state. One entry per page; the label is
 * the menu item's text. Relative `iframe.html` URLs so they work on any
 * Storybook host (local or Netlify).
 */
const PROTOTYPE_PAGE_LINKS = [
  {
    id: "page-dashboard-empty-state",
    label: "Dashboard empty state",
    href: "iframe.html?id=layouts-dashboardemptystate--default&viewMode=story",
  },
];

/**
 * The sidebar account menu every layout passes to `Sidebar`: Figma's account
 * items, a divider, then the prototype-only items — a link per page in
 * `PROTOTYPE_PAGE_LINKS`, and "Restart prototype" (Figma: `reverse-left`),
 * which clears every demo interaction and returns to the starting Dashboard —
 * e.g. to bring back a declined offer before the next demo.
 * Prototype-only, so it lives here rather than in `Sidebar`'s defaults.
 */
const prototypeAccountMenu: NonNullable<SidebarProps["accountMenu"]> = {
  children: (
    <>
      <AccountMenuItem id="profile" icon={UserCircle}>
        My Profile
      </AccountMenuItem>
      <AccountMenuItem id="language" icon={Translate01} suffix="English">
        Language
      </AccountMenuItem>
      <AccountMenuItem id="settings" icon={Settings02}>
        Settings
      </AccountMenuItem>
      <AccountMenuItem id="sign-out" icon={LogOut01}>
        Sign out
      </AccountMenuItem>
      {/* Figma's 16px divider (1px `border` line, centered) — the shared menu separator is the same geometry. */}
      <MenuSeparator />
      {PROTOTYPE_PAGE_LINKS.map(({ id, label, href }) => (
        <AccountMenuItem key={id} id={id} icon={ArrowUpRight} href={href}>
          {label}
        </AccountMenuItem>
      ))}
      <AccountMenuItem id="restart-prototype" icon={ReverseLeft} onAction={restartPrototype}>
        Restart prototype
      </AccountMenuItem>
    </>
  ),
  termsHref: "#",
  privacyHref: "#",
};

export { prototypeAccountMenu };

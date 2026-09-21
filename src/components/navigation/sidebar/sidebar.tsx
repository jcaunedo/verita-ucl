import * as React from "react";
import { motion } from "motion/react";
import {
  BankNote01,
  Bell01,
  Compass03,
  FlexAlignLeft,
  FlexAlignRight,
  HomeLine,
  LifeBuoy02,
  UsersPlus,
} from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { enterTransition, useMotionPreference } from "@/lib/motion";
import { Logo } from "@/components/branding/logo";
import { Button } from "@/components/buttons/button";
import { SidebarMenuItem } from "@/components/buttons/sidebar-menu-item";
import { AccountTrigger } from "@/components/buttons/account-trigger";

/**
 * Figma: `briefcase-business` (flat case + top handle + notch, and a
 * lid-seam line) — not in the installed `@untitledui/icons` package (which
 * only ships the plain `Briefcase01`/`Briefcase02`), so defined locally
 * matching that package's icon API (24x24, `currentColor` stroke) until
 * it's added upstream.
 */
function BriefcaseBusiness({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 12H12.01M16 6V4C16 3.47 15.789 2.961 15.414 2.586C15.039 2.211 14.53 2 14 2H10C9.47 2 8.961 2.211 8.586 2.586C8.211 2.961 8 3.47 8 4V6M22 13C19.033 14.959 15.556 16.003 12 16.003C8.444 16.003 4.967 14.959 2 13M4 6H20C21.105 6 22 6.895 22 8V18C22 19.105 21.105 20 20 20H4C2.895 20 2 19.105 2 18V8C2 6.895 2.895 6 4 6Z" />
    </svg>
  );
}

/** Measured from Figma: `Sidebar` COMPONENT_SET's Expanded/Collapsed frame widths. */
const EXPANDED_WIDTH = 280;
const COLLAPSED_WIDTH = 84;

type NavKey = "home" | "discover" | "engagements" | "earnings" | "referrals";

const NAV_ITEMS: {
  key: NavKey;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}[] = [
  { key: "home", icon: HomeLine, label: "Home", href: "/home" },
  { key: "discover", icon: Compass03, label: "Discover", href: "/discover" },
  { key: "engagements", icon: BriefcaseBusiness, label: "Engagements", href: "/engagements" },
  { key: "earnings", icon: BankNote01, label: "Earnings", href: "/earnings" },
  { key: "referrals", icon: UsersPlus, label: "Referrals", href: "/referrals" },
];

const FOOTER_ITEMS = [
  { key: "notifications", icon: Bell01, label: "Notifications" },
  { key: "support", icon: LifeBuoy02, label: "Support" },
] as const;

/**
 * The app-shell sidebar — logo, collapse toggle, main nav, footer nav, and
 * account trigger. Figma: `Sidebar` (Expanded / Collapsed). `activeNavKey`
 * tracks which of the 5 main nav items is current (defaults to "home",
 * switches on click); the 3 footer items only support hover/press, no
 * current-page state, per spec.
 *
 * Behavior/motion adapted from bethere-ucl's `Sidebar` (same underlying
 * pattern, adapted to verita's own layout/tokens — not a visual copy):
 * width animates between the two Figma-measured states via Motion's
 * `enterTransition` (rather than an instant class-swap); the whole rail is
 * also a click target for toggling, via `onClick` on the root plus
 * `stopPropagation` on each content wrapper (the top nav block and bottom
 * footer block) so real controls (nav items, buttons, account menu) don't
 * also toggle the rail — only the genuinely empty rail background outside
 * those two wrappers (e.g. between the nav list and the footer list) reaches
 * the root's handler; the small gaps between adjacent items within a list
 * (e.g. between "Home" and "Discover", or "Notifications" and "Support") sit
 * inside a `stopPropagation` wrapper and were never click-to-toggle either,
 * so `cursor-default` is applied there on the list containers to match that
 * — only the actually-toggleable rail background keeps the
 * `cursor-w-resize`/`cursor-e-resize` inherited from the root. The collapsed
 * logo swaps to the same `LayoutLeft` toggle icon on hover, hinting "click to
 * expand" (Figma's Collapsed state has no visible toggle button at all, so
 * this hover hint is this component's own affordance for discovering the
 * expand action, same as bethere's).
 *
 * `collapsed`/`onCollapsedChange` make the rail a standard controlled/
 * uncontrolled component — omit both and it manages its own state (e.g. the
 * standalone Storybook story); pass both when a consumer (e.g. `Dashboard`)
 * needs to react to the collapse toggle itself, such as adjusting the
 * canvas's own padding to match.
 */
interface SidebarProps {
  /** Controlled collapsed state. Omit to let Sidebar manage its own state. */
  collapsed?: boolean;
  /** Notified on every toggle, controlled or not, with the new value. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /**
   * Overrides a main nav item's `href` by key, e.g.
   * `{ home: "https://..." }`. This repo has no router (Sidebar and each
   * `layouts/*` composition are independently-previewed Storybook stories,
   * not routed pages of one app), so the default `href`s (`/home`,
   * `/discover`, etc.) are illustrative placeholders — this override exists
   * for a consumer that wants a real destination for one or more items
   * without forking the component, e.g. a clickable Storybook prototype
   * that links "Home" to another story's URL. Items not listed keep their
   * default `href`.
   */
  navHrefOverrides?: Partial<Record<NavKey, string>>;
}

function Sidebar({
  collapsed: collapsedProp,
  onCollapsedChange,
  navHrefOverrides,
}: SidebarProps = {}) {
  const [uncontrolledCollapsed, setUncontrolledCollapsed] = React.useState(false);
  const collapsed = collapsedProp ?? uncontrolledCollapsed;
  const [activeNavKey, setActiveNavKey] = React.useState<NavKey>("home");
  const [isRailHovered, setIsRailHovered] = React.useState(false);
  const { resolve } = useMotionPreference();

  const toggleCollapsed = () => {
    const next = !collapsed;
    setUncontrolledCollapsed(next);
    onCollapsedChange?.(next);
  };

  return (
    <motion.div
      data-slot="sidebar"
      data-collapsed={collapsed}
      animate={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      transition={resolve(enterTransition)}
      className={cn(
        "relative flex h-screen shrink-0 flex-col justify-between overflow-hidden p-6",
        collapsed ? "cursor-e-resize items-center" : "cursor-w-resize items-start",
      )}
      onClick={toggleCollapsed}
      onMouseEnter={() => setIsRailHovered(true)}
      onMouseLeave={() => setIsRailHovered(false)}
    >
      <div
        className="relative z-10 flex w-full flex-col items-start gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            "flex h-10 w-full items-center py-2 pr-1 pl-[3px]",
            collapsed ? "justify-start" : "justify-between",
          )}
        >
          {collapsed ? (
            <button
              type="button"
              aria-label="Expand sidebar"
              onClick={toggleCollapsed}
              onMouseEnter={() => setIsRailHovered(true)}
              onMouseLeave={() => setIsRailHovered(false)}
              className="relative flex size-8 shrink-0 cursor-e-resize items-center justify-center rounded-md"
            >
              <Logo mark className={cn("size-8", isRailHovered && "invisible")} />
              <FlexAlignRight
                className={cn(
                  "absolute size-4 text-foreground",
                  !isRailHovered && "hidden",
                )}
              />
            </button>
          ) : (
            <>
              <Logo className="h-7 w-auto" />
              <Button
                color="tertiary"
                size="xs"
                aria-label="Collapse sidebar"
                onPress={toggleCollapsed}
                iconLeading={FlexAlignLeft}
                className={cn(
                  "cursor-w-resize rounded-md",
                  isRailHovered
                    ? "*:data-[icon=leading]:text-foreground"
                    : "*:data-[icon=leading]:text-icon-subtle",
                )}
              />
            </>
          )}
        </div>

        <div className="flex w-full cursor-default flex-col items-start gap-4">
          {NAV_ITEMS.map(({ key, icon: Icon, label, href }) => (
            <SidebarMenuItem
              key={key}
              icon={<Icon />}
              label={label}
              href={navHrefOverrides?.[key] ?? href}
              collapsed={collapsed}
              current={activeNavKey === key}
              onPress={() => setActiveNavKey(key)}
            />
          ))}
        </div>
      </div>

      <div
        className="relative z-10 flex w-full flex-col items-start justify-end gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full cursor-default flex-col items-start gap-4">
          {FOOTER_ITEMS.map(({ key, icon: Icon, label }) => (
            <SidebarMenuItem
              key={key}
              icon={<Icon />}
              label={label}
              href="#"
              collapsed={collapsed}
            />
          ))}
        </div>

        <div className="flex h-2 w-full items-center">
          <div className="h-px w-full bg-border" />
        </div>

        <AccountTrigger
          name="Theresa Smith"
          email="theresa@email.com"
          avatar={{ initials: "TS", className: "bg-success" }}
          collapsed={collapsed}
        />
      </div>
    </motion.div>
  );
}

export { Sidebar, type SidebarProps };

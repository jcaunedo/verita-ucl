import * as React from "react";
import { motion } from "motion/react";
import {
  BankNote01,
  Bell01,
  Briefcase02,
  Compass03,
  FlexAlignLeft,
  FlexAlignRight,
  HomeLine,
  LifeBuoy02,
  MessageTextCircle01,
  UsersPlus,
} from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { enterTransition, useMotionPreference } from "@/lib/motion";
import { Logo } from "@/components/branding/logo";
import { Button } from "@/components/buttons/button";
import { SidebarMenuItem } from "@/components/buttons/sidebar-menu-item";
import { AccountMenu } from "@/components/buttons/account-menu";

/** Measured from Figma: `Sidebar` COMPONENT_SET's Expanded/Collapsed frame widths. */
const EXPANDED_WIDTH = 280;
const COLLAPSED_WIDTH = 84;

const NAV_ITEMS = [
  { key: "home", icon: HomeLine, label: "Home", href: "/home" },
  { key: "discover", icon: Compass03, label: "Discover", href: "/discover" },
  { key: "engagements", icon: Briefcase02, label: "Engagements", href: "/engagements" },
  { key: "earnings", icon: BankNote01, label: "Earnings", href: "/earnings" },
  { key: "referrals", icon: UsersPlus, label: "Referrals", href: "/referrals" },
] as const;

const FOOTER_ITEMS = [
  { key: "notifications", icon: Bell01, label: "Notifications" },
  { key: "feedback", icon: MessageTextCircle01, label: "Send feedback" },
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
 * `stopPropagation` on each content wrapper so real controls (nav items,
 * buttons, account menu) don't also toggle the rail — only genuinely empty
 * space reaches the root's handler, verified via real DOM event bubbling
 * rather than z-index/hit-testing layering (which proved unreliable for the
 * empty rows between nav items); and the collapsed logo swaps to the same
 * `LayoutLeft` toggle icon on hover, hinting "click to expand" (Figma's
 * Collapsed state has no visible toggle button at all, so this hover hint
 * is this component's own affordance for discovering the expand action,
 * same as bethere's).
 */
function Sidebar() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [activeNavKey, setActiveNavKey] = React.useState<
    (typeof NAV_ITEMS)[number]["key"]
  >("home");
  const [isRailHovered, setIsRailHovered] = React.useState(false);
  const { resolve } = useMotionPreference();

  const toggleCollapsed = () => setCollapsed((c) => !c);

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
              <Logo className="h-8 w-auto" />
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

        <div className="flex w-full flex-col items-start gap-3">
          {NAV_ITEMS.map(({ key, icon: Icon, label, href }) => (
            <SidebarMenuItem
              key={key}
              icon={<Icon />}
              label={label}
              href={href}
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
        <div className="flex w-full flex-col items-start gap-3">
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

        <AccountMenu
          name="Theresa Smith"
          email="theresa@email.com"
          avatar={{ initials: "TS", className: "bg-success" }}
          collapsed={collapsed}
        />
      </div>
    </motion.div>
  );
}

export { Sidebar };

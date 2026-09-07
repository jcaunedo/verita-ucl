import * as React from "react";
import { Link, type LinkProps } from "react-aria-components";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { SidebarTooltip, SidebarTooltipTrigger } from "@/components/overlays/sidebar-tooltip";

/**
 * Figma states → code (relabeled 2026-09-06 — Hover/Active were swapped from
 * the initial sync; the two non-default treatments' visuals didn't change,
 * only which state name they belong to):
 * - Default: neutral-600 text/icon, no fill.
 * - Hover (`data-hovered`): rosewood text/icon (`text-primary`), regular
 *   weight, no fill.
 * - Active/current page (`aria-current="page"` → React Aria's `data-current`):
 *   rosewood text/icon like hover, but medium weight, `bg-primary-subtle`
 *   fill, and a 4px outside outline in the same `primary-subtle` color
 *   (Figma: an OUTSIDE-aligned stroke, so `outline` rather than `border` to
 *   match its layout-non-affecting behavior) — a deliberately distinct third
 *   state, not hover reused.
 */
const sidebarMenuItemVariants = cva(
  "inline-flex w-full items-center gap-3.5 rounded-full px-2 py-[7px] text-sm font-normal text-neutral-600 outline-4 outline-transparent data-[hovered]:text-primary data-[current]:bg-primary-subtle data-[current]:font-medium data-[current]:text-primary data-[current]:outline-primary-subtle data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-2 [&_svg]:size-5 [&_svg]:shrink-0",
);

interface SidebarMenuItemProps extends Omit<LinkProps, "children" | "className"> {
  /** Icon element, e.g. `<HomeLine />` from `@untitledui/icons`. Rendered at 20px and recolored to match the current text color. */
  icon: React.ReactNode;
  /** Nav item label. */
  label: string;
  /** Marks this item as the current page (renders `aria-current="page"`; Figma's Active state). */
  current?: boolean;
  /** Icon-only mode for a collapsed sidebar (Figma: `Sidebar` layout's Collapsed variant) — shrinks to a 36px square, hides the label visually while keeping it for screen readers. */
  collapsed?: boolean;
  className?: string;
}

/** A single sidebar navigation link — icon + label, with hover and current-page states. Figma: `Sidebar Menu Item`. When `collapsed`, hovering/focusing shows the label in a `SidebarTooltip` to the right (Figma: `sidebar-tooltip`), since the label itself is visually hidden. */
function SidebarMenuItem({
  className,
  icon,
  label,
  current,
  collapsed,
  ...props
}: SidebarMenuItemProps) {
  const link = (
    <Link
      data-slot="sidebar-menu-item"
      aria-current={current ? "page" : undefined}
      className={cn(
        sidebarMenuItemVariants(),
        collapsed && "h-9 w-9 justify-center px-2 py-0",
        className,
      )}
      {...props}
    >
      {icon}
      <span
        className={cn(
          "min-w-px flex-1 overflow-hidden text-ellipsis whitespace-nowrap",
          collapsed && "sr-only",
        )}
      >
        {label}
      </span>
    </Link>
  );

  if (!collapsed) {
    return link;
  }

  return (
    <SidebarTooltipTrigger delay={0}>
      {link}
      <SidebarTooltip placement="right" offset={8}>
        {label}
      </SidebarTooltip>
    </SidebarTooltipTrigger>
  );
}

export { SidebarMenuItem, sidebarMenuItemVariants, type SidebarMenuItemProps };

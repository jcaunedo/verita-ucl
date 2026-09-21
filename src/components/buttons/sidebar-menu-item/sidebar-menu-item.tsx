import * as React from "react";
import { Link, type LinkProps } from "react-aria-components";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { SidebarTooltip, SidebarTooltipTrigger } from "@/components/overlays/sidebar-tooltip";

/**
 * Figma states → code (updated 2026-09-21 — dropped the rosewood/primary
 * accent for a neutral/brand grayscale scheme; all three states are now
 * medium weight (previously only Active was); text size dropped from
 * `base`/16px to `sm`/14px in the same pass):
 * - Default: `foreground-muted` text/icon, medium weight, no fill.
 * - Hover (`data-hovered`): `icon-foreground` text/icon, medium weight, no
 *   fill.
 * - Active/current page (`aria-current="page"` → React Aria's `data-current`):
 *   `tone-brand` text/icon, medium weight, `tone-brand-subtle` fill, and a
 *   4px outside outline in the same `tone-brand-subtle` color (Figma's icon
 *   sits at the same 8px inset in both Default and Active, confirming the
 *   stroke doesn't consume content space, so `outline` rather than `border`
 *   still matches) — a deliberately distinct third state, not hover reused.
 *
 * `h-9` (36px) is explicit rather than content-driven — Figma fixes every
 * item at `h-[36px]` regardless of state; `py-[7px]` with `sm`'s 22px
 * line-height now computes to exactly 36px.
 */
const sidebarMenuItemVariants = cva(
  "inline-flex h-9 w-full items-center gap-3.5 rounded-full px-2 py-[7px] text-sm font-medium text-foreground-muted outline-4 outline-transparent data-[hovered]:text-icon-foreground data-[current]:bg-tone-brand-subtle data-[current]:text-tone-brand data-[current]:outline-tone-brand-subtle data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-2 [&_svg]:size-5 [&_svg]:shrink-0",
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
        collapsed && "w-9 justify-center px-2 py-0",
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

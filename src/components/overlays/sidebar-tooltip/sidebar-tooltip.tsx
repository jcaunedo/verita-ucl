import * as React from "react";
import { motion } from "motion/react";
import {
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  type TooltipProps as AriaTooltipProps,
} from "react-aria-components";

import { cn } from "@/lib/utils";
import { enterTransition, motionDistance, useMotionPreference } from "@/lib/motion";

/**
 * A small pill-shaped label tooltip — e.g. the sidebar's collapsed nav-item
 * hint. Figma: `sidebar-tooltip` (single style, no variant states; updated
 * 2026-09-24 — a white floating pill: `card/card` fill, `border/neutral/border`
 * border, `shadow/popover` shadow, `color/tone/brand/brand` text, replacing
 * the earlier `tone-brand-subtle` tinted pill). Wraps
 * React Aria's `Tooltip` for real positioning/focus/hover-delay/escape
 * behavior rather than a bare styled `div`; pair with the re-exported
 * `SidebarTooltipTrigger` (React Aria's `TooltipTrigger`) around the actual
 * trigger element.
 *
 * Fade + slide uses Motion's `enterTransition` (not a CSS transition) —
 * React Aria exposes `isEntering`/`isExiting` as render props specifically
 * so a custom animation can hook into its overlay lifecycle (it still owns
 * keeping the node mounted through the exit), so a plain `motion.div` reads
 * those booleans and animates opacity + a small leftward offset (Figma's
 * tooltip sits to the right of its trigger, so it glides in from that same
 * direction — CLAUDE.md's `motionDistance.subtle`, 8px) via `animate`
 * instead of `className`.
 */
interface SidebarTooltipProps
  extends Omit<AriaTooltipProps, "className" | "children"> {
  className?: string;
  children?: React.ReactNode;
}

function SidebarTooltip({
  className,
  children,
  ...props
}: SidebarTooltipProps) {
  const { resolve } = useMotionPreference();

  return (
    <AriaTooltip data-slot="sidebar-tooltip" {...props}>
      {({ isEntering, isExiting }) => (
        <motion.div
          initial={{ opacity: 0, x: -motionDistance.subtle }}
          animate={{
            opacity: isEntering || isExiting ? 0 : 1,
            x: isEntering || isExiting ? -motionDistance.subtle : 0,
          }}
          transition={resolve(enterTransition)}
          className={cn(
            "inline-flex items-center justify-center rounded-full border border-border bg-card px-4 py-2 text-sm whitespace-nowrap text-tone-brand shadow-popover",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AriaTooltip>
  );
}

export {
  SidebarTooltip,
  AriaTooltipTrigger as SidebarTooltipTrigger,
  type SidebarTooltipProps,
};

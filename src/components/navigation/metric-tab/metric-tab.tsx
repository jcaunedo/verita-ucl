import * as React from "react";
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  type TabListProps as AriaTabListProps,
  type TabProps as AriaTabProps,
} from "react-aria-components";
import { LayoutGroup, motion } from "motion/react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { layoutSpring, useMotionPreference } from "@/lib/motion";
import { Typography } from "@/components/typography";

/**
 * Figma `Metric Tab` (`Property 1`: Default, Hover, Active) — a tab that
 * reads as a small card: a label over a metric value. Built on
 * react-aria's `Tab`, so it's a real `role="tab"` with arrow-key navigation
 * and selection owned by the surrounding `MetricTabs`.
 *
 * - Default → `card/card` fill, 1px `border/neutral/border`, `foreground` text.
 * - Hover → fill swaps to `state/hover-row` (`bg-hover-row`, DESIGN.md
 *   "Row hover"); border/text unchanged. Not applied to the selected tab —
 *   Figma has no Active+Hover state.
 * - Active → 2px `color/tone/brand/brand` border + brand text. Figma's
 *   Active has no fill; it keeps Default's `card/card` here (confirmed
 *   2026-09-23 — the missing fill is a Figma omission).
 *
 * The Active border is a separate `motion.span` with a shared `layoutId`,
 * so it glides from the previously selected tab to the new one (CLAUDE.md
 * "Tabs": the indicator animates with the selected state, not on its own).
 * Both strokes are inside-aligned like Figma's: the 1px base border is an
 * inset `ring` (box-shadow, takes no space — a CSS `border` would add 2px
 * and make the tab 83px instead of Figma's 81px), and the 2px indicator
 * sits at `inset-0` over it — no layout shift between states. The
 * indicator is raised (`z-10`) so it glides over the other tabs in either
 * direction, never under them.
 * `MetricTabList` scopes the `layoutId` per list.
 *
 * The value uses Figma's `xl/xl -semibold` (20/28, 0 tracking). The theme's
 * `text-xl` is 20/30, so this instance overrides to `leading-7` locally
 * rather than changing the shared xl step (confirmed 2026-09-23).
 *
 * A zero value (`0`/`"0"`) renders in `foreground/subtle` (`text-foreground-subtle`)
 * on an unselected tab, per Figma's empty Assessments/Talent Network tabs, so an
 * empty metric reads as quieter than one with activity. Figma has no selected
 * zero state; a selected tab keeps the brand text.
 */
const metricTabVariants = cva(
  [
    // Figma: vertical auto-layout, padding `spacing/3`×`spacing/4` (12/16px), raw 7px gap, `radius/card`.
    "relative flex min-w-0 flex-1 flex-col items-start justify-center gap-[7px] rounded-card bg-card px-4 py-3 ring-1 ring-border ring-inset text-foreground outline-none",
    // Hover feedback: `motionDuration.fast` on the standard curve — same as Button.
    "transition-colors duration-160 ease-in-out",
    "not-data-[selected]:data-[hovered]:bg-hover-row",
    "data-[selected]:text-tone-brand",
    "data-[focus-visible]:outline-solid data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-ring",
    // No Figma source for disabled — reuses Button's disabled text treatment.
    "data-[disabled]:text-foreground-subtle",
  ].join(" "),
);

interface MetricTabProps
  extends Omit<AriaTabProps, "children" | "className"> {
  /** The metric's name (Figma's `Label` text property), e.g. "Applications". */
  label: React.ReactNode;
  /** The metric's value (Figma's `Value` text property), e.g. `12`. */
  value: React.ReactNode;
  className?: string;
}

/** One metric tab — label over value, with a gliding brand border when selected. Figma: `Metric Tab`. Render inside `MetricTabList`. */
function MetricTab({ label, value, className, ...props }: MetricTabProps) {
  const { resolve } = useMotionPreference();

  return (
    <AriaTab
      data-slot="metric-tab"
      className={cn(metricTabVariants(), className)}
      {...props}
    >
      {({ isSelected }) => (
        <>
          {isSelected && (
            <motion.span
              aria-hidden="true"
              data-slot="metric-tab-indicator"
              layoutId="metric-tab-indicator"
              transition={resolve(layoutSpring)}
              // `z-10`: the indicator belongs to the newly selected tab, and the tabs paint in DOM order, so gliding left
              // it passed *under* the tabs after it. Raised above every tab in the row (the tabs set no z-index of
              // their own); `pointer-events-none` keeps it from blocking clicks on the tabs it crosses.
              className="pointer-events-none absolute inset-0 z-10 rounded-card border-2 border-tone-brand"
            />
          )}
          <Typography as="span" size="sm" weight="medium">
            {label}
          </Typography>
          <Typography
            as="span"
            size="xl"
            weight="semibold"
            className={cn(
              "leading-7",
              !isSelected && (value === 0 || value === "0") && "text-foreground-subtle",
            )}
          >
            {value}
          </Typography>
        </>
      )}
    </AriaTab>
  );
}

interface MetricTabListProps<T extends object>
  extends Omit<AriaTabListProps<T>, "className"> {
  className?: string;
}

/**
 * The row of `MetricTab`s. Wraps react-aria's `TabList` in a `LayoutGroup`
 * with a per-instance id, so two metric tab lists on one page each keep
 * their own gliding indicator instead of animating between each other.
 * Tabs share the row equally (`flex-1`); override per tab via `className`.
 */
function MetricTabList<T extends object>({
  className,
  ...props
}: MetricTabListProps<T>) {
  const id = React.useId();

  return (
    <LayoutGroup id={id}>
      <AriaTabList
        data-slot="metric-tab-list"
        className={cn("flex gap-4", className)}
        {...props}
      />
    </LayoutGroup>
  );
}

export {
  AriaTabs as MetricTabs,
  MetricTabList,
  MetricTab,
  AriaTabPanel as MetricTabPanel,
  metricTabVariants,
  type MetricTabProps,
  type MetricTabListProps,
};

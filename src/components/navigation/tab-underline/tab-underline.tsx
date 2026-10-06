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
 * Figma `Tab Item Underline` — a text tab with a 2px underline when selected, used to switch between a page's
 * top-level views (e.g. Referrals → My referrals / My network). Built on react-aria's `Tab` like `TabButton` and
 * `MetricTab`, so it's a real `role="tab"` with arrow-key navigation and selection owned by `TabUnderlines`.
 *
 * - Default → `foreground/muted` text, no underline.
 * - Hover → `foreground` text. No Figma source; follows `TabButton`'s hover text change.
 * - Active → `color/tone/brand/brand` text and a 2px `color/tone/brand/brand` underline.
 *
 * Counter (Figma `Counter`, 2026-10-03): pass `count` to show it 6px after the label, the same pill as `TabButton`'s —
 * `xs -medium`, 22px min width, 6px × 2px padding, fully round. Default/Hover → `color-tone-neutral-subtle` fill +
 * `foreground/muted` text; Active → `color/tone/brand/muted` fill + `color/tone/brand/brand` text. Omit `count` to hide
 * it; whether a zero shows is the consumer's call.
 *
 * Figma: 36px tall, `pb-[10px]`, `base/base -semibold` label. The underline is a separate `motion.span` with a shared
 * `layoutId`, so it glides from the previously selected tab to the new one (CLAUDE.md "Tabs").
 */
const tabUnderlineVariants = cva(
  [
    "relative inline-flex h-9 shrink-0 items-center gap-1.5 pb-2.5 text-foreground-muted outline-none",
    "transition-colors duration-160 ease-in-out",
    "not-data-[selected]:data-[hovered]:text-foreground",
    "data-[selected]:text-tone-brand",
    "data-[focus-visible]:outline-solid data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-ring",
    "data-[disabled]:text-foreground-subtle",
  ].join(" "),
);

interface TabUnderlineProps extends Omit<AriaTabProps, "children" | "className"> {
  /** Tab label (Figma's `Tab` text). */
  label: React.ReactNode;
  /** Counter after the label (Figma's `Counter`), e.g. how many items the view holds. Omit to hide it. */
  count?: React.ReactNode;
  /** Extra classes for the root element, merged after the component's own. */
  className?: string;
}

/** One underline tab — label with a gliding underline when selected. Figma: `Tab Item Underline`. Render inside `TabUnderlineList`. */
function TabUnderline({ label, count, className, ...props }: TabUnderlineProps) {
  const { resolve } = useMotionPreference();

  return (
    <AriaTab data-slot="tab-underline" className={cn(tabUnderlineVariants(), className)} {...props}>
      {({ isSelected }) => (
        <>
          <Typography as="span" size="base" weight="semibold" className="whitespace-nowrap">
            {label}
          </Typography>
          {count != null && (
            <Typography
              as="span"
              size="xs"
              weight="medium"
              data-slot="tab-underline-counter"
              className={cn(
                "min-w-[22px] rounded-full px-1.5 py-0.5 text-center tabular-nums",
                isSelected
                  ? "bg-tone-brand-muted text-tone-brand"
                  : "bg-tone-neutral-subtle text-foreground-muted",
              )}
            >
              {count}
            </Typography>
          )}
          {isSelected && (
            <motion.span
              aria-hidden="true"
              data-slot="tab-underline-indicator"
              layoutId="tab-underline-indicator"
              transition={resolve(layoutSpring)}
              className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-tone-brand"
            />
          )}
        </>
      )}
    </AriaTab>
  );
}

interface TabUnderlineListProps<T extends object> extends Omit<AriaTabListProps<T>, "className"> {
  /** Extra classes for the root element, merged after the component's own. */
  className?: string;
}

/**
 * The row of `TabUnderline`s (Figma `Tab Group Underline`: 24px between tabs). Wraps react-aria's `TabList` in a
 * `LayoutGroup` with a per-instance id, so two lists on one page each keep their own gliding underline.
 */
function TabUnderlineList<T extends object>({ className, ...props }: TabUnderlineListProps<T>) {
  const id = React.useId();

  return (
    <LayoutGroup id={id}>
      <AriaTabList data-slot="tab-underline-list" className={cn("flex items-start gap-6", className)} {...props} />
    </LayoutGroup>
  );
}

export {
  AriaTabs as TabUnderlines,
  TabUnderlineList,
  TabUnderline,
  AriaTabPanel as TabUnderlinePanel,
  tabUnderlineVariants,
  type TabUnderlineProps,
  type TabUnderlineListProps,
};

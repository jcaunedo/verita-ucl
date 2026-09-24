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
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { layoutSpring, useMotionPreference } from "@/lib/motion";
import { Typography } from "@/components/typography";

/**
 * Figma `Tab Item Button` (`Size`: sm · 36, md · 40 × `State`: Default,
 * Hover, Active) — a pill-shaped tab with an optional counter, following
 * Untitled UI's "Button brand horizontal" tabs. Built on react-aria's `Tab`
 * like `MetricTab`, so it's a real `role="tab"` with arrow-key navigation and
 * selection owned by the surrounding `TabButtons`.
 *
 * - Default → no fill, `foreground/muted` text.
 * - Hover → `neutral/neutral-100` fill (`bg-neutral-100`), `foreground` text.
 *   Not applied to the selected tab.
 * - Active → `foreground/foreground` fill (`bg-foreground`) with
 *   `color/tone/brand/on-brand` text (`text-primary-foreground`, white).
 *
 * The Active fill is a separate `motion.span` with a shared `layoutId`, so it
 * glides from the previously selected tab to the new one (CLAUDE.md "Tabs").
 * Motion animates the pill's transform; CSS animates only text color, so the
 * two never animate the same property. The pill's radius is set in `style`
 * so Motion keeps its ends round while it resizes between labels. `TabButtonList` scopes the
 * `layoutId` per list.
 *
 * Counter (Figma `counter`, `showCounter`): pass `count` to render it.
 * Default/Hover → `color-tone-neutral-subtle` fill + `foreground/muted` text;
 * Active → `color/tone/brand/muted` fill + `color/tone/brand/brand` text.
 * Whether a zero count shows is the consumer's call — omit `count` to hide it.
 */
const tabButtonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center rounded-full text-foreground-muted outline-none",
    // Text color feedback: `motionDuration.fast` on the standard curve — same as MetricTab/Button.
    "transition-colors duration-160 ease-in-out",
    "not-data-[selected]:data-[hovered]:bg-neutral-100 not-data-[selected]:data-[hovered]:text-foreground",
    "data-[selected]:text-primary-foreground",
    "data-[focus-visible]:outline-solid data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-ring",
    // No Figma source for disabled — reuses Button's disabled text treatment.
    "data-[disabled]:text-foreground-subtle",
  ].join(" "),
  {
    variants: {
      size: {
        // Figma `sm · 36`: 36px tall, `spacing/2` (8px) padding, `sm/sm -medium` label.
        sm: "h-9 px-2 py-2",
        // Figma `md · 40`: 40px tall, `spacing/2_5` (10px) horizontal padding, `base/base -medium` label.
        md: "h-10 px-2.5 py-2.5",
      },
    },
    defaultVariants: { size: "md" },
  },
);

interface TabButtonProps
  extends Omit<AriaTabProps, "children" | "className">,
    VariantProps<typeof tabButtonVariants> {
  /** Tab label (Figma's `Tab` text). */
  label: React.ReactNode;
  /** Counter value (Figma's `counter`, shown when `showCounter` is on). Omit to hide the counter. */
  count?: React.ReactNode;
  className?: string;
}

/** One pill tab — label plus optional counter, with a gliding dark fill when selected. Figma: `Tab Item Button`. Render inside `TabButtonList`. */
function TabButton({ label, count, size, className, ...props }: TabButtonProps) {
  const { resolve } = useMotionPreference();
  const resolvedSize = size ?? "md";

  return (
    <AriaTab
      data-slot="tab-button"
      data-size={resolvedSize}
      className={cn(tabButtonVariants({ size }), className)}
      {...props}
    >
      {({ isSelected }) => (
        <>
          {isSelected && (
            <motion.span
              aria-hidden="true"
              data-slot="tab-button-indicator"
              layoutId="tab-button-indicator"
              transition={resolve(layoutSpring)}
              // Radius in `style`, not a `rounded-full` class: Motion's layout animation resizes the pill with a scale
              // transform, and only corrects border-radius it can see in `style`. As a class, the pill's ends stretched
              // into ovals while it moved between labels of different widths.
              style={{ borderRadius: 9999 }}
              className="pointer-events-none absolute inset-0 bg-foreground"
            />
          )}
          {/* Figma `container`: `spacing/1_5` (6px) horizontal padding around the label. */}
          <Typography
            as="span"
            size={resolvedSize === "sm" ? "sm" : "base"}
            weight="medium"
            className="relative px-1.5 whitespace-nowrap"
          >
            {label}
          </Typography>
          {count != null && (
            <Typography
              as="span"
              size="xs"
              weight="medium"
              data-slot="tab-button-counter"
              className={cn(
                "relative min-w-[22px] rounded-full px-1.5 py-0.5 text-center",
                isSelected
                  ? "bg-tone-brand-muted text-tone-brand"
                  : "bg-tone-neutral-subtle text-foreground-muted",
              )}
            >
              {count}
            </Typography>
          )}
        </>
      )}
    </AriaTab>
  );
}

interface TabButtonListProps<T extends object>
  extends Omit<AriaTabListProps<T>, "className"> {
  className?: string;
}

/**
 * The row of `TabButton`s (Figma `Tab Group Button`, `spacing/2` = 8px gap).
 * Wraps react-aria's `TabList` in a `LayoutGroup` with a per-instance id, so
 * two lists on one page each keep their own gliding fill.
 */
function TabButtonList<T extends object>({
  className,
  ...props
}: TabButtonListProps<T>) {
  const id = React.useId();

  return (
    <LayoutGroup id={id}>
      <AriaTabList
        data-slot="tab-button-list"
        className={cn("flex items-center gap-2", className)}
        {...props}
      />
    </LayoutGroup>
  );
}

export {
  AriaTabs as TabButtons,
  TabButtonList,
  TabButton,
  AriaTabPanel as TabButtonPanel,
  tabButtonVariants,
  type TabButtonProps,
  type TabButtonListProps,
};

import * as React from "react";
import { motion } from "motion/react";
import { Link as AriaLink, type LinkProps as AriaLinkProps } from "react-aria-components";
import { ArrowUpRight, CheckCircleBroken } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { liftPattern, useMotionPreference } from "@/lib/motion";
import { Typography } from "@/components/typography";

/**
 * A clickable navigation callout — optional leading icon, title, description,
 * and an arrow-up-right affordance on a brand-subtle card. Figma:
 * `callout-card` COMPONENT_SET (`Property 1`: Default, Hover). Wraps React
 * Aria's `Link` (not `Button`) since the arrow-up-right icon signals
 * navigation, matching `Button`'s own `LinkButtonProps` pattern — `href` is
 * required.
 *
 * Hover (2026-09-22 Figma revision): the fill switches from
 * `color/tone/brand/subtle` to `background/default` (white) and a 1px
 * `border/neutral/border` outline and the `shadow/hover-card` shadow
 * appear (the shared hovered-card look, DESIGN.md "Row hover"). The border is reserved as
 * `border-transparent` at rest so the card doesn't shift 1px when it shows
 * (both Figma variants are the same 104px height). Figma's stroke is inside
 * the frame, so padding is Figma's 24px vertical / 32px left / 40px right
 * minus the 1px border (`py-[23px] pr-[39px] pl-[31px]`), and the title
 * (`lg -semibold`) uses Figma's bound `line-height/lg` (26px) rather than
 * Typography lg's 24px default — together keeping the card at exactly 104px.
 *
 * Motion: the card uses the shared Lift pattern (CLAUDE.md "Lift" — hoverable
 * cards translate up by `motionDistance.hover` on a `subtleSpring`) via a
 * thin `motion.div` wrapper around the React Aria `Link` (same box), so the
 * link keeps React Aria's hover/focus/press semantics untouched. Fill,
 * border, shadow, and arrow color fade with a CSS transition limited to those
 * properties (not `transition`, which would also animate `transform` and
 * fight Motion's lift). Under reduced motion the
 * lift is dropped entirely and only the color change remains.
 *
 * The arrow icon has no bound color variable in Figma (a flattened vector,
 * same as the callout's own no-variable icon slot) — updated 2026-09-21 by
 * sampling its rendered pixels directly: `neutral-300` (`#c6cbd2`) default →
 * `tone-brand` (`#222a34` exactly) on hover, replacing the old
 * rosewood-200/rosewood-800 pairing from before the library's
 * rosewood→brand-grayscale shift.
 */
interface CalloutCardProps
  extends Omit<AriaLinkProps, "children" | "className"> {
  /** Callout headline. */
  title: string;
  /** Supporting copy. */
  description: string;
  /** Shows a leading icon before the title. Defaults to `check-circle-broken` unless `icon` overrides it. */
  showIcon?: boolean;
  /** Custom leading icon, rendered only when `showIcon` is true. Falls back to `check-circle-broken`. */
  icon?: React.ReactNode;
  href: NonNullable<AriaLinkProps["href"]>;
  className?: string;
}

/** A clickable navigation callout card — optional leading icon, title, description, and an arrow-up-right affordance. Figma: `callout-card`. */
function CalloutCard({
  title,
  description,
  showIcon = false,
  icon,
  className,
  ...props
}: CalloutCardProps) {
  const { prefersReducedMotion } = useMotionPreference();

  return (
    // Lift runs on a thin wrapper rather than a `motion.create(AriaLink)`: Motion's handler types (`onAnimationStart`, drag events)
    // and React Aria's function-form `style` clash, and the wrapper is the same box as the link, so hovering either lifts both.
    <motion.div
      data-slot="callout-card-lift"
      className="flex w-full"
      {...(prefersReducedMotion ? {} : liftPattern)}
    >
      <AriaLink
        data-slot="callout-card"
        className={cn(
          "group flex w-full items-center gap-18 rounded-card border border-transparent bg-tone-brand-subtle py-[23px] pr-[39px] pl-[31px] transition-[color,background-color,border-color,box-shadow] duration-150 ease-out",
          "data-[hovered]:border-border data-[hovered]:bg-background data-[hovered]:shadow-hover-card",
          "data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-2",
          className,
        )}
        {...props}
      >
        <div className="flex min-w-px flex-1 flex-col items-start gap-1.5">
          <div className="flex w-full items-center gap-3">
            {showIcon &&
              (icon ?? (
                <CheckCircleBroken className="size-6 shrink-0 text-foreground" />
              ))}
            <Typography size="lg" weight="semibold" className="leading-6.5 text-foreground">
              {title}
            </Typography>
          </div>
          <Typography size="base" className="w-full text-foreground">
            {description}
          </Typography>
        </div>
        <ArrowUpRight className="size-6 shrink-0 text-neutral-300 transition-colors duration-150 ease-out group-data-[hovered]:text-tone-brand" />
      </AriaLink>
    </motion.div>
  );
}

export { CalloutCard, type CalloutCardProps };

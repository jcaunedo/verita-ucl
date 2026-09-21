import * as React from "react";
import { motion } from "motion/react";
import { XClose } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { cardDismissVariants, cardEnterFromRightVariants, useMotionPreference } from "@/lib/motion";
import { Badge, type BadgeProps } from "@/components/data-display/badge";
import { Button, type ButtonProps } from "@/components/buttons/button";
import { Typography } from "@/components/typography";
import { DashedBorder } from "@/components/cards/dashed-border";

/**
 * A single onboarding/checklist step — label badge, title, description, and a
 * call-to-action button, on a dashed-border card. Figma: `next-step-card`
 * (`Property 1`: Default, Hover). Composes the existing `Badge` (default
 * `tone="neutral"`, default `size="sm"`), `Button` (`size="xs"`), and
 * `Typography` (`size="lg"`/`"sm"`, which already carries the correct
 * letter-spacing for `lg`) rather than reproducing their look inline.
 * `badgeTone` defaults to `"neutral"` (the original Figma component's only
 * observed tone) but is exposed since consuming layouts (e.g. the
 * Dashboard's four next-step cards) bind different per-card tones
 * (destructive/warning/info) via the same underlying `next-step-card`
 * component with a different badge instance tone.
 *
 * The CTA is bound to `--tone-brand`/white text (Figma: `color/tone/brand/
 * brand`, `color/tone/brand/on-brand` — the latter has no dedicated
 * `--tone-*` CSS token, so it's applied as literal `text-white`, matching
 * its resolved value), not `Button`'s own `color="primary"` (`--primary`,
 * rosewood) — a card-specific binding, not a general button color, so it's
 * applied via `className` override rather than a new `Button` color
 * variant. Note `--tone-brand` currently resolves to `neutral-800`
 * (`#222a34`), not rosewood, per the 2026-09-17 token sync.
 *
 * The card's resting background/border (`--next-steps-card-background`/
 * `--next-steps-card-border`) are a component-specific token pair with no
 * shared ramp — bound only by this component, per Figma's
 * `next-steps-card/*` variables. The dashed border itself is the shared
 * `DashedBorder` component (`cards/dashed-border`) — an absolutely-positioned
 * live SVG rather than CSS `border-dashed` (which can't express Figma's
 * exact 4px/4px dash) or a background-image trick (which can't carry the
 * dash continuously through the rounded corners at an arbitrary box size) —
 * colored via `currentColor` from `text-next-steps-card-border` on this
 * element. It's only rendered while not hovered (`!isHovered`), since hover
 * switches to a real solid `border` instead (Figma: `background/default`,
 * `border/neutral/border`) rather than a second dashed state — the CTA also
 * darkens ~20% black (`color-mix`) on hover, matching Figma's Hover variant.
 *
 * `dismissible` shows a hover-revealed dismiss (X) button in the top-right
 * corner, per `product-specs/next-steps-card.md` §2.1: only `Recommended`
 * (non-required) tasks are dismissible — `Blocking`/`Required later` cards
 * must not pass this prop. It is presentational only here (no confirmation
 * step, per the same section); wiring an actual dismiss action is left to
 * the consumer via `onDismiss`.
 *
 * The card itself is a `motion.div` using the shared `cardDismissVariants`
 * (fade + soft scale-down, CLAUDE.md "Dismiss") so it animates out smoothly
 * when removed from the tree — the consumer (e.g. `Dashboard`) must wrap
 * each rendered card in Motion's `AnimatePresence` for the `exit` animation
 * to actually play (Motion can't animate an unmount without it). `layout`
 * is also set (skipped under reduced motion) so sibling cards in the same
 * grid/flex row smoothly reflow into the vacated slot instead of snapping
 * once a card is removed. Under reduced motion, the scale transform and
 * layout reflow animation are both dropped and only the fade plays, per
 * CLAUDE.md's reduced-motion guidance to keep state-change feedback while
 * removing nonessential transforms.
 *
 * `enterFromRight` swaps in `cardEnterFromRightVariants` (fade + slide from
 * the right on mount, same dismiss exit) for a card whose *arrival* should
 * read as sliding into a newly-opened slot — e.g. `Dashboard`'s grid caps
 * the visible count below a breakpoint and reveals the next queued card by
 * actually mounting it once a slot frees up. This only works for a genuine
 * mount/unmount (the card entering/leaving the React tree) — a card merely
 * toggled via a `hidden` CSS class never unmounts, so `initial` never
 * replays and `layout` instead animates the display-change as an
 * undirected position jump, which is what this prop's caller must avoid by
 * conditionally rendering rather than hiding. `layout` is also explicitly
 * disabled on this card while `enterFromRight` is true — a freshly-mounted
 * grid item has no prior recorded position, and running `layout` alongside
 * the *other* grid siblings' own reflow-triggered `layout` animations (all
 * firing the same frame a dismissal frees the slot) caused this card's
 * mount to read as sliding up from below instead of in from the right, since
 * the grid's row auto-placement briefly resolves differently before the
 * sibling reflow settles. `initial`/`animate` alone already fully describes
 * this card's entrance, so no `layout` animation is lost by skipping it here.
 *
 * The label row is a fixed `h-[22px]` (Figma: updated 2026-09-21 so the
 * Default variant reserves the same row height/badge position as Hover,
 * rather than a shorter row that grows when the X appears) and the X button
 * itself is always rendered (`opacity-0` → `group-hover:opacity-100`/
 * `focus-visible:opacity-100`), never `hidden`/`display:none` → `flex` —
 * toggling `display` removes the button from layout flow entirely in the
 * default state, which is what caused the badge to visibly jump on hover
 * (the row had no reserved space for it) before this fix.
 *
 * See `product-specs/next-steps-card.md` for the full card content model,
 * badge-level rules, and dismiss/re-surface behavior this component
 * implements — this file only covers markup/styling, not the product logic
 * for which badge/props a given task should receive.
 */
interface NextStepCardProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"
  > {
  /** Leading label badge text (Figma's `badge` instance, `Label`). */
  label: string;
  /** Leading label badge tone (Figma's `badge` instance tone binding). Defaults to `"neutral"`. */
  badgeTone?: BadgeProps["tone"];
  /** Step title. */
  title: string;
  /** Step description. */
  description: string;
  /** Call-to-action button text (Figma's `button` instance, `Label`). */
  buttonLabel: string;
  /** Forwarded to the action button (e.g. `onPress`). Figma shows no link variant for this button, so only the plain-button props are accepted. */
  buttonProps?: Omit<ButtonProps, "size" | "color" | "children">;
  /** Shows a hover-revealed dismiss (X) button. Only `Recommended` tasks are dismissible — see `product-specs/next-steps-card.md` §2.1. Defaults to `false`. */
  dismissible?: boolean;
  /** Called when the dismiss (X) button is activated. Only relevant when `dismissible` is `true`. */
  onDismiss?: () => void;
  /**
   * Animates the mount with a fade + slide-in from the right (CLAUDE.md
   * "Glide") instead of appearing in place — for a card newly revealed by a
   * queue shifting (e.g. a hidden card taking a slot vacated by a dismissed
   * one), where the arrival should read as "sliding into the row" rather
   * than materializing. Only affects genuine React mount (`initial` →
   * `animate`) — the consumer must actually mount/unmount this card (e.g.
   * conditionally render it, not just toggle a `hidden` class) for there to
   * be a mount to animate at all. Defaults to `false` (plain fade-in place).
   */
  enterFromRight?: boolean;
  className?: string;
}

/** An onboarding/checklist step card — badge, title, description, and a CTA button. Figma: `next-step-card`. */
function NextStepCard({
  label,
  badgeTone = "neutral",
  title,
  description,
  buttonLabel,
  buttonProps,
  dismissible = false,
  onDismiss,
  enterFromRight = false,
  className,
  ...props
}: NextStepCardProps) {
  const { prefersReducedMotion } = useMotionPreference();

  return (
    <motion.div
      data-slot="next-step-card"
      layout={!prefersReducedMotion && !enterFromRight}
      variants={enterFromRight ? cardEnterFromRightVariants : cardDismissVariants}
      initial="initial"
      animate="animate"
      exit={
        prefersReducedMotion
          ? { opacity: 0, transition: { duration: 0.01 } }
          : "exit"
      }
      className={cn(
        "group relative flex h-[248px] w-full flex-col items-start justify-between rounded-card border border-transparent bg-next-steps-card-background px-5 py-6 text-next-steps-card-border transition-colors duration-150 ease-out",
        "hover:border-solid hover:border-border hover:bg-background",
        className,
      )}
      {...props}
    >
      <DashedBorder radius={12} className="group-hover:hidden" />
      <div className="flex w-full flex-col items-start gap-4">
        <div className="flex h-[22px] w-full items-center justify-between">
          <Badge tone={badgeTone} label={label} />
          {dismissible && (
            <button
              type="button"
              aria-label="Dismiss"
              onClick={onDismiss}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-icon-muted opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100 hover:text-icon-foreground focus-visible:opacity-100"
            >
              <XClose className="size-4" />
            </button>
          )}
        </div>
        <div className="flex w-full flex-col items-start gap-1.5">
          <Typography size="lg" weight="semibold" className="text-foreground">
            {title}
          </Typography>
          <Typography size="sm" className="text-foreground-muted">
            {description}
          </Typography>
        </div>
      </div>
      <Button
        size="xs"
        {...buttonProps}
        className={cn(
          "bg-tone-brand text-white hover:bg-[color-mix(in_srgb,var(--tone-brand)_80%,black)]",
          buttonProps?.className,
        )}
      >
        {buttonLabel}
      </Button>
    </motion.div>
  );
}

export { NextStepCard, type NextStepCardProps };

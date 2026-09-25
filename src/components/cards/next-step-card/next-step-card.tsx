import * as React from "react";
import { motion } from "motion/react";
import { XClose } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { clickableRowProps } from "@/lib/clickable-row";
import {
  cardDismissVariants,
  cardEnterFromRightVariants,
  motionDistance,
  subtleSpring,
  useMotionPreference,
} from "@/lib/motion";
import { Badge, type BadgeProps } from "@/components/data-display/badge";
import {
  Button,
  type ButtonComponentProps,
  type ButtonProps,
  type LinkButtonProps,
} from "@/components/buttons/button";
import { Typography } from "@/components/typography";
import { DashedBorder } from "@/components/cards/dashed-border";

/**
 * A single onboarding/checklist step — label badge, title, description, and a
 * call-to-action button, on a dashed-border card. Figma: `next-step-card`
 * (`Property 1`: Default, Hover). Composes the existing `Badge` (default
 * `tone="neutral"`, default `size="sm"`), `Button` (`size="xs"`), and
 * `Typography` (`size="base"`/`"sm"`) rather than reproducing their look inline.
 * `badgeTone` defaults to `"neutral"` (the original Figma component's only
 * observed tone) but is exposed since consuming layouts (e.g. the
 * Dashboard's four next-step cards) bind different per-card tones
 * (destructive/warning/info) via the same underlying `next-step-card`
 * component with a different badge instance tone.
 *
 * The CTA is a plain `Button` (`color="primary"`, Figma Solid/Brand) with no
 * card-specific color override — `primary` itself is bound to `--tone-brand`
 * since the 2026-09-21 re-sync, so the card inherits the global button look
 * (including its hover) like every other surface.
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
 * `border/neutral/border`) rather than a second dashed state.
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
 * The whole card is clickable and performs the CTA's action (it clicks the
 * CTA itself), with the pointer cursor, focus, and Enter/Space handling from
 * the shared `clickableRowProps` helper (`role="button"` — DESIGN.md's
 * global cursor rule). The dismiss (X) and the CTA remain their own targets:
 * clicks on them never trigger the card.
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
  /** Forwarded to the CTA (e.g. `onPress`, or `href`/`target`/`rel` for a link CTA such as an external sign-in). The whole card performs the same action. */
  buttonProps?:
    | Omit<ButtonProps, "size" | "color" | "children">
    | Omit<LinkButtonProps, "size" | "color" | "children">;
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

/**
 * `Button`'s overloads (one per button/link variant) can't accept a spread of
 * `buttonProps`' button-or-link union; its implementation does (it branches
 * on `href` at runtime), so the CTA renders through that union signature.
 */
const CtaButton = Button as (props: ButtonComponentProps) => React.ReactElement;

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
  onClick,
  onKeyDown,
  ...props
}: NextStepCardProps) {
  const { prefersReducedMotion } = useMotionPreference();
  // The whole card is a click target that performs the CTA's own action (PRD: card = CTA), by clicking the CTA itself —
  // React Aria treats a programmatic `.click()` as a press, so `buttonProps.onPress`/`href` stay the single source of the action.
  // `clickableRowProps` ignores clicks from nested controls, so the dismiss (X) and the CTA itself never double-fire.
  const cardPress = clickableRowProps({
    onKeyDown,
    onClick: (event) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      event.currentTarget.querySelector<HTMLElement>("[data-next-step-cta]")?.click();
    },
  })!;

  /**
   * Lift on hover (CLAUDE.md "Lift", same as `CalloutCard`): up `motionDistance.hover` on `subtleSpring`. The spring is
   * scoped to `y` — in `whileHover` for the rise, and on the `animate` variant for the return — so the card's `layout`
   * reflow and entrance keep their own transitions. Dropped under reduced motion; the hover fill/border stay.
   */
  const baseVariants = enterFromRight ? cardEnterFromRightVariants : cardDismissVariants;
  const variants = React.useMemo(() => {
    const animate = baseVariants.animate as { transition?: object };
    return {
      ...baseVariants,
      animate: { ...animate, transition: { ...animate.transition, y: subtleSpring } },
    };
  }, [baseVariants]);

  return (
    <motion.div
      data-slot="next-step-card"
      layout={!prefersReducedMotion && !enterFromRight}
      variants={variants}
      whileHover={prefersReducedMotion ? undefined : { y: -motionDistance.hover, transition: subtleSpring }}
      initial="initial"
      animate="animate"
      exit={
        prefersReducedMotion
          ? { opacity: 0, transition: { duration: 0.01 } }
          : "exit"
      }
      className={cn(
        "group relative flex h-[248px] w-full flex-col items-start justify-between rounded-card border border-transparent bg-next-steps-card-background px-5 py-6 text-next-steps-card-border transition-[color,background-color,border-color,box-shadow] duration-150 ease-out",
        // Figma `Property 1=Hover`: solid white card, `border/neutral/border`, and `shadow/hover-card` (DESIGN.md "Row hover").
        "hover:border-solid hover:border-border hover:bg-background hover:shadow-hover-card",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
      role={cardPress.role}
      tabIndex={cardPress.tabIndex}
      onClick={cardPress.onClick}
      onKeyDown={cardPress.onKeyDown}
    >
      <DashedBorder radius={12} className="group-hover:hidden" />
      <div className="flex w-full flex-col items-start gap-4">
        <div className="flex h-[22px] w-full items-center justify-between">
          <Badge tone={badgeTone} label={label} />
          {dismissible && (
            // Reveal on a wrapper, not the Button, so the Button keeps its own look + hover transition.
            <div className="flex shrink-0 opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 has-[[data-focus-visible]]:opacity-100">
              <Button
                color="tertiary"
                size="xs"
                iconLeading={XClose}
                aria-label="Dismiss"
                onPress={onDismiss}
              />
            </div>
          )}
        </div>
        <div className="flex w-full flex-col items-start gap-1.5">
          {/* Figma `base -semibold` (16/24). */}
          <Typography size="base" weight="semibold" className="text-foreground">
            {title}
          </Typography>
          <Typography size="sm" className="text-foreground-muted">
            {description}
          </Typography>
        </div>
      </div>
      <CtaButton
        size="xs"
        data-next-step-cta
        {...buttonProps}
      >
        {buttonLabel}
      </CtaButton>
    </motion.div>
  );
}

export { NextStepCard, type NextStepCardProps };

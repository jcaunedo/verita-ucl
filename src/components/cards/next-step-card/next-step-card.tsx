import * as React from "react";
import { XClose } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { Badge, type BadgeProps } from "@/components/data-display/badge";
import { Button, type ButtonProps } from "@/components/buttons/button";
import { Typography } from "@/components/typography";

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
 * `next-steps-card/*` variables. On hover, the card switches to a solid
 * `background`/`border` pair (Figma: `background/default`,
 * `border/neutral/border`) and the CTA darkens ~20% black
 * (`color-mix`), matching Figma's Hover variant.
 *
 * `dismissible` shows a hover-revealed dismiss (X) button in the top-right
 * corner, per `product-specs/next-steps-card.md` §2.1: only `Recommended`
 * (non-required) tasks are dismissible — `Blocking`/`Required later` cards
 * must not pass this prop. It is presentational only here (no confirmation
 * step, per the same section); wiring an actual dismiss action is left to
 * the consumer via `onDismiss`.
 *
 * See `product-specs/next-steps-card.md` for the full card content model,
 * badge-level rules, and dismiss/re-surface behavior this component
 * implements — this file only covers markup/styling, not the product logic
 * for which badge/props a given task should receive.
 */
interface NextStepCardProps extends React.HTMLAttributes<HTMLDivElement> {
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
  className,
  ...props
}: NextStepCardProps) {
  return (
    <div
      data-slot="next-step-card"
      className={cn(
        "group flex h-[248px] w-[270px] flex-col items-start justify-between rounded-card border border-dashed border-next-steps-card-border bg-next-steps-card-background px-5 py-6 transition-colors duration-150 ease-out",
        "hover:border-solid hover:border-border hover:bg-background",
        className,
      )}
      {...props}
    >
      <div className="flex w-full flex-col items-start gap-4">
        <div className="flex w-full items-center justify-between">
          <Badge tone={badgeTone} label={label} />
          {dismissible && (
            <button
              type="button"
              aria-label="Dismiss"
              onClick={onDismiss}
              className="hidden size-8 shrink-0 items-center justify-center rounded-full text-icon-muted opacity-0 transition-opacity duration-150 ease-out group-hover:flex group-hover:opacity-100 hover:text-icon-foreground"
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
    </div>
  );
}

export { NextStepCard, type NextStepCardProps };

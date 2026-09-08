import * as React from "react";

import { cn } from "@/lib/utils";
import { Badge, type BadgeProps } from "@/components/data-display/badge";
import { Button, type ButtonProps } from "@/components/buttons/button";
import { Typography } from "@/components/typography";

/**
 * A single onboarding/checklist step — label badge, title, description, and a
 * call-to-action button, on a dashed-border card. Figma: `next-step-card`
 * (single COMPONENT, no variant axes). Composes the existing `Badge`
 * (default `tone="neutral"`, default `size="sm"`), `Button` (`size="xs"`,
 * `color="primary"`), and `Typography` (`size="lg"`/`"sm"`, which already
 * carries the correct letter-spacing for `lg`) rather than reproducing their
 * look inline. `badgeTone` defaults to `"neutral"` (the original Figma
 * component's only observed tone) but is exposed since consuming layouts
 * (e.g. the Dashboard's four next-step cards) bind different per-card tones
 * (destructive/warning/info) via the same underlying `next-step-card`
 * component with a different badge instance tone.
 *
 * The card's background/border (`--next-steps-card-background`/
 * `--next-steps-card-border`) are a component-specific token pair with no
 * shared ramp — bound only by this component, per Figma's
 * `next-steps-card/*` variables.
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
  className,
  ...props
}: NextStepCardProps) {
  return (
    <div
      data-slot="next-step-card"
      className={cn(
        "flex h-[248px] w-[270px] flex-col items-start justify-between rounded-card border border-dashed border-next-steps-card-border bg-next-steps-card-background px-5 py-6",
        className,
      )}
      {...props}
    >
      <div className="flex w-full flex-col items-start gap-4">
        <Badge tone={badgeTone} label={label} />
        <div className="flex w-full flex-col items-start gap-1.5">
          <Typography size="lg" weight="semibold" className="text-foreground">
            {title}
          </Typography>
          <Typography size="sm" className="text-foreground-muted">
            {description}
          </Typography>
        </div>
      </div>
      <Button size="xs" color="primary" {...buttonProps}>
        {buttonLabel}
      </Button>
    </div>
  );
}

export { NextStepCard, type NextStepCardProps };

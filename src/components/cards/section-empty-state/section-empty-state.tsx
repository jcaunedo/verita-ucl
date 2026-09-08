import * as React from "react";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/buttons/button";
import { Typography } from "@/components/typography";

/**
 * A centered empty-state message for a page section — brand-colored title,
 * muted description, and a CTA button, on a dashed border with no fill.
 * Figma: `section-empty-state` (single COMPONENT, no variant axes). Composes
 * the existing `Typography` (`size="2xl"`/`"base"`) and `Button`
 * (`size="sm"`, `color="primary"`) rather than reproducing their look
 * inline. Shares its dashed border color (`--next-steps-card-border`) with
 * `NextStepCard` — Figma binds the same `next-steps-card/border` variable —
 * but has no background fill (Figma's node has no bound `background`
 * variable and no `bg-*` class in the generated output, unlike
 * `NextStepCard`).
 *
 * The description's 60% opacity over the brand text color has no existing
 * token — expressed as Tailwind's `/60` opacity modifier on `text-primary`
 * rather than a new token, since it's a one-off alpha tint, not a value
 * likely to be reused elsewhere.
 */
interface SectionEmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Empty-state headline. */
  title: string;
  /** Supporting copy, rendered at 60% opacity. */
  description: string;
  /** Call-to-action button text (Figma's `button` instance, `Label`). */
  buttonLabel: string;
  /** Forwarded to the action button (e.g. `onPress`). Figma shows no link variant for this button, so only the plain-button props are accepted. */
  buttonProps?: Omit<ButtonProps, "size" | "color" | "children">;
  className?: string;
}

/** A section-level empty state — title, description, and a CTA button on a dashed, unfilled border. Figma: `section-empty-state`. */
function SectionEmptyState({
  title,
  description,
  buttonLabel,
  buttonProps,
  className,
  ...props
}: SectionEmptyStateProps) {
  return (
    <div
      data-slot="section-empty-state"
      className={cn(
        "flex w-full flex-col items-center justify-center gap-5 rounded-card border border-dashed border-next-steps-card-border px-5 py-12",
        className,
      )}
      {...props}
    >
      <div className="flex w-full flex-col items-start gap-1 text-center">
        <Typography size="2xl" weight="semibold" className="w-full text-primary">
          {title}
        </Typography>
        <Typography size="base" className="w-full text-primary/60">
          {description}
        </Typography>
      </div>
      <Button size="sm" color="primary" {...buttonProps}>
        {buttonLabel}
      </Button>
    </div>
  );
}

export { SectionEmptyState, type SectionEmptyStateProps };

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/buttons/button";
import { Typography } from "@/components/typography";
import { DashedBorder } from "@/components/cards/dashed-border";

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
 * Updated 2026-09-21 — dropped the rosewood/primary accent (and the
 * description's `/60` opacity tint over it) for the same neutral/brand
 * grayscale scheme as `SidebarMenuItem`/`SidebarTooltip`: title now
 * `tone-brand` (Figma: `color/tone/brand/brand`), description a flat
 * `foreground-muted` (Figma: `foreground/brand-muted`, same hex as the
 * `foreground/muted` token used elsewhere) — not an opacity blend.
 *
 * Also switched from CSS `border-dashed` to the shared `DashedBorder`
 * component (`cards/dashed-border`) for a pixel-exact, continuous 4px/4px
 * dash matching Figma — see `NextStepCard`'s own comment for why neither
 * plain `border-dashed` nor a CSS background trick reproduces it correctly
 * around a rounded corner at an arbitrary width. Colored via `currentColor`
 * from `text-next-steps-card-border` on this element.
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
        "relative flex w-full flex-col items-center justify-center gap-5 rounded-card px-5 py-12 text-next-steps-card-border",
        className,
      )}
      {...props}
    >
      <DashedBorder radius={12} />
      <div className="flex w-full flex-col items-start gap-1 text-center">
        <Typography size="2xl" weight="semibold" className="w-full text-tone-brand">
          {title}
        </Typography>
        <Typography size="base" className="w-full text-foreground-muted">
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

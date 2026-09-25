import * as React from "react";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/buttons/button";
import { Typography } from "@/components/typography";

/**
 * A centered empty-state message for a view or filter with nothing to show,
 * e.g. Engagements → Contracts → Completed ("No completed contracts").
 * Figma: Verita → `Contracts` frame (`node-id=5701-7251`), the centered
 * text group in the empty filter panel: `lg -semibold` title (18/26,
 * `foreground/foreground`), `base` description (16/24, `foreground/muted`),
 * 8px apart. Optional CTA (Figma: Verita → `Talent Network`,
 * `node-id=5702-7522`, "Browse roles"): a primary `sm` `Button`, 16px below
 * the text. The same layout is used for every empty view; only the copy
 * (and whether there's an action) changes.
 *
 * Centers itself in whatever space its parent gives it — pass
 * `className="flex-1"` (or a height) to fill a panel. `icon` is an optional
 * slot above the title for an icon or illustration; Figma has none yet.
 *
 * Unlike `SectionEmptyState` (a dashed-bordered Home module with a CTA),
 * this has no border and its action is optional.
 */
interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Headline, e.g. "No completed contracts". */
  title: string;
  /** Supporting line, e.g. "Contracts will appear here when your work is complete." */
  description?: string;
  /** Optional icon or illustration above the title. */
  icon?: React.ReactNode;
  /** Call-to-action text, e.g. "Browse roles". Omit for no button. Same naming as `SectionEmptyState`. */
  buttonLabel?: string;
  /** Forwarded to the CTA button (e.g. `onPress`, or `href` for a link). */
  buttonProps?: Omit<ButtonProps, "size" | "color" | "children">;
  className?: string;
}

/** A centered empty-state message — optional icon, title, description, and an optional CTA button. */
function EmptyState({ title, description, icon, buttonLabel, buttonProps, className, ...props }: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn("flex w-full flex-col items-center justify-center gap-4 text-center", className)}
      {...props}
    >
      {/* Figma: icon/title/description 8px apart; the CTA sits 16px below that group. */}
      <div className="flex flex-col items-center gap-2">
        {icon && (
          <div data-slot="empty-state-icon" className="flex items-center justify-center">
            {icon}
          </div>
        )}
        <Typography as="h2" size="lg" weight="semibold" className="leading-6.5 text-foreground">
          {title}
        </Typography>
        {description && (
          <Typography size="base" className="text-foreground-muted">
            {description}
          </Typography>
        )}
      </div>
      {buttonLabel && (
        <Button size="sm" color="primary" {...(buttonProps as ButtonProps)}>
          {buttonLabel}
        </Button>
      )}
    </div>
  );
}

export { EmptyState, type EmptyStateProps };

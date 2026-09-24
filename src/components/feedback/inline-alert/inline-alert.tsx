import * as React from "react";
import { AlertCircle, AlertTriangle, InfoCircle } from "@untitledui/icons";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Figma `inline-alert` COMPONENT_SET — one status line (16px icon + `sm/sm`
 * regular text, 8px gap), tinted by the tone's strong text color. Figma's
 * `Property 1` values map to `tone`, reusing `Badge`'s tone vocabulary:
 * `Optional` → `info`, `Required` → `warning`, `Danger` → `destructive`.
 * Each tone carries its own fixed icon (Figma: `info-circle`,
 * `alert-triangle, warning`, `alert-circle`); `showIcon` mirrors Figma's
 * `showIcon` toggle.
 *
 * Figma renders the text on a single line (`whitespace-nowrap`); here it
 * wraps instead (confirmed 2026-09-24), with the icon centered on the first
 * line via an `h-lh` (one `line-height/sm`, 22px) slot — so longer copy stays
 * readable at narrow widths without the icon drifting to the block's middle.
 *
 * Static status text, so no `role="alert"`/`"status"` by default (that would
 * make screen readers announce it on mount). Pass `role` when the message
 * appears in response to an action and should be announced.
 */
const inlineAlertVariants = cva("flex items-start gap-2 text-sm font-normal", {
  variants: {
    tone: {
      // Figma `Optional` — `color-tone-info-info` (#0054a3).
      info: "text-tone-info",
      // Figma `Required` — `color-tone-warning-warning` (#e07400).
      warning: "text-tone-warning",
      // Figma `Danger` — `color/tone/destructive/destructive` (#c63333).
      destructive: "text-tone-destructive",
    },
  },
  defaultVariants: { tone: "info" },
});

type InlineAlertTone = NonNullable<VariantProps<typeof inlineAlertVariants>["tone"]>;

const toneIcons: Record<InlineAlertTone, React.FC<{ className?: string }>> = {
  info: InfoCircle,
  warning: AlertTriangle,
  destructive: AlertCircle,
};

interface InlineAlertProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof inlineAlertVariants> {
  /** Shows the tone's leading icon (Figma: `showIcon`). */
  showIcon?: boolean;
}

/** A single-line status message — tone-colored icon + text, e.g. "No {name} added yet". Figma: `inline-alert`. */
function InlineAlert({ className, tone, showIcon = true, children, ...props }: InlineAlertProps) {
  const resolvedTone = tone ?? "info";
  const Icon = toneIcons[resolvedTone];

  return (
    <div
      data-slot="inline-alert"
      data-tone={resolvedTone}
      className={cn(inlineAlertVariants({ tone }), className)}
      {...props}
    >
      {showIcon && (
        <span data-slot="inline-alert-icon" aria-hidden="true" className="flex h-lh shrink-0 items-center">
          <Icon className="size-4" />
        </span>
      )}
      <span data-slot="inline-alert-text" className="min-w-0">
        {children}
      </span>
    </div>
  );
}

export { InlineAlert, inlineAlertVariants, type InlineAlertProps, type InlineAlertTone };

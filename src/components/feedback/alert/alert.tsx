import * as React from "react";
import { AlertCircle, AlertTriangle, ArrowUpRight, CheckCircle, InfoCircle, XClose } from "@untitledui/icons";
import { cva, type VariantProps } from "class-variance-authority";

import { Button } from "@/components/buttons/button";
import { clickableRowProps } from "@/lib/clickable-row";
import { cn } from "@/lib/utils";

/**
 * Figma `alerts` COMPONENT_SET — a full-width banner: tinted surface with a
 * 1px border (`radius/lg`, 12px × 8px padding), a 20px tone icon 10px before
 * the text, a `sm -semibold` title and `sm` description 4px apart, a 16px
 * `arrow-up-right`, and an optional trailing ×. Figma's `State` values map to
 * `tone`, reusing `Badge`'s tone vocabulary: `Default` → `neutral`, `Info`,
 * `Warning`, `Desctructive` (sic) → `destructive`, `Success`. Each tone
 * carries its own fixed icon.
 *
 * Figma's toggles map to optional props: `showIcon` → `showIcon`,
 * `showTitle`/`showDescription` → omit `title`/`description`, `showX` →
 * `dismissible` (off by default: without `onDismiss` the × would do nothing).
 * The × is `Button` at `xs` (32px), icon-only `tertiary` at 50% opacity.
 *
 * The whole banner is the link (confirmed 2026-09-30): passing `onClick`
 * makes it a `role="button"` via `clickableRowProps`, the same model as the
 * row cards, so presses on the × don't also fire it. The arrow only shows
 * then; Figma draws it on every alert, but on one that opens nothing it
 * would promise a click that does nothing.
 *
 * Figma renders the text on one line (`whitespace-nowrap`) and pins the ×
 * in a fixed 238px slot; here the description wraps below the title when
 * space runs out, with the icon held on the first line via an `h-lh` slot
 * (as in `InlineAlert`), and the × keeps its natural width.
 *
 * Static by default, so no `role="alert"`/`"status"` (that would make
 * screen readers announce it on mount). Pass `role` when the alert appears in
 * response to an action and should be announced.
 */
const alertVariants = cva(
  // `px-[11px] py-[7px]` = Figma's 12px × 8px padding minus the 1px border (Figma strokes inside the frame, as in
  // `Select`), so the banner is 48px tall like Figma's.
  [
    "flex w-full items-center justify-between gap-2 rounded-lg border px-[11px] py-[7px] text-sm text-foreground",
    // Keyboard focus when clickable — the same ring as the row cards.
    "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
  ].join(" "),
  {
    variants: {
      tone: {
        // Figma `Default` — `card/subtle` (#f5f6f7) + `border/neutral/border` (#dfe2e7).
        neutral: "border-border bg-card-subtle",
        // Figma `Info` — `color-tone-info-subtle` (#e6f0fb) + `-muted` (#99c3e9).
        info: "border-tone-info-muted bg-tone-info-subtle",
        // Figma `Warning` — `color-tone-warning-subtle` (#fef4ec) + `-muted` (#f6c69e).
        warning: "border-tone-warning-muted bg-tone-warning-subtle",
        // Figma `Desctructive` (sic) — `color/tone/destructive/subtle` (#fceded) + `/muted` (#f5cccc).
        destructive: "border-tone-destructive-muted bg-tone-destructive-subtle",
        // Figma `Success` — `color-tone-success-subtle` (#e6f6ec) + `-muted` (#99dbb1).
        success: "border-tone-success-muted bg-tone-success-subtle",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

type AlertTone = NonNullable<VariantProps<typeof alertVariants>["tone"]>;

const toneIcons: Record<AlertTone, { icon: React.FC<{ className?: string }>; className: string }> = {
  // Figma `info-circle`, `icon/foreground` (#31373f).
  neutral: { icon: InfoCircle, className: "text-icon-foreground" },
  // Figma `info-circle`, `color-tone-info-info` (#0054a3).
  info: { icon: InfoCircle, className: "text-tone-info" },
  // Figma `alert-triangle, warning`, `color-tone-warning-warning` (#e07400).
  warning: { icon: AlertTriangle, className: "text-tone-warning" },
  // Figma draws an alert circle (layer named `info-circle`), `color/tone/destructive/destructive` (#c63333).
  destructive: { icon: AlertCircle, className: "text-tone-destructive" },
  // Figma `check-circle`, `color-tone-success-success` (#018638).
  success: { icon: CheckCircle, className: "text-tone-success" },
};

interface AlertProps
  extends Omit<React.ComponentProps<"div">, "title">,
    VariantProps<typeof alertVariants> {
  /** Bold lead-in (Figma: `title`, `sm -semibold`). Omit to show the description alone. */
  title?: React.ReactNode;
  /** Supporting text after the title (Figma: `description`, `sm` regular). */
  description?: React.ReactNode;
  /** Shows the tone's leading icon (Figma: `showIcon`). */
  showIcon?: boolean;
  /** Shows a trailing × button (Figma: `showX`). The consumer unmounts the alert in `onDismiss`. */
  dismissible?: boolean;
  /** Called when the × button is pressed. */
  onDismiss?: () => void;
  /** Accessible label for the × button. Defaults to "Dismiss". */
  dismissLabel?: string;
}

/** A full-width status banner — tone icon, title, description, optional × — that can open something on click. Figma: `alerts`. */
function Alert({
  className,
  tone,
  title,
  description,
  showIcon = true,
  dismissible = false,
  onDismiss,
  dismissLabel = "Dismiss",
  ...props
}: AlertProps) {
  const resolvedTone = tone ?? "neutral";
  const { icon: Icon, className: iconClassName } = toneIcons[resolvedTone];
  const isClickable = Boolean(props.onClick);

  return (
    <div
      data-slot="alert"
      data-tone={resolvedTone}
      className={cn(alertVariants({ tone }), className)}
      {...clickableRowProps(props)}
    >
      <div className="flex min-w-0 flex-1 items-start gap-2.5">
        {showIcon && (
          <span data-slot="alert-icon" aria-hidden="true" className="flex h-lh shrink-0 items-center">
            <Icon className={cn("size-5", iconClassName)} />
          </span>
        )}
        <p data-slot="alert-text" className="flex min-w-0 flex-wrap items-center gap-x-1">
          {title && <span className="font-semibold">{title}</span>}
          {description && <span>{description}</span>}
          {/* Figma `arrow-up-right`, `icon/foreground` (#31373f). */}
          {isClickable && <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-icon-foreground" />}
        </p>
      </div>
      {dismissible && (
        <Button
          color="tertiary"
          size="xs"
          iconLeading={XClose}
          aria-label={dismissLabel}
          onPress={onDismiss}
          className="shrink-0 opacity-50"
        />
      )}
    </div>
  );
}

export { Alert, alertVariants, type AlertProps, type AlertTone };

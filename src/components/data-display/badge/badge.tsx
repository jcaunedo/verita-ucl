import * as React from "react";
import { X } from "@untitledui/icons";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/** Matches Untitled UI's `isReactComponent` check: true for an unrendered function component reference (e.g. `HomeLine`), false for an already-rendered element (e.g. `<HomeLine />`). */
function isIconComponent(
  value: unknown,
): value is React.FC<{ className?: string }> {
  return typeof value === "function";
}

type IconProp = React.FC<{ className?: string }> | React.ReactNode;

/** Renders either an unrendered icon component (auto-sized/colored via `data-icon`) or a pre-rendered element as-is — matches `Button`'s own icon-prop contract. */
function renderIcon(icon: IconProp, position: "leading" | "trailing") {
  if (isIconComponent(icon)) {
    const Icon = icon;
    return <Icon data-icon={position} />;
  }
  return icon;
}

/**
 * Status and metadata labels, following the Untitled UI badge pattern.
 *
 * Figma `badge` COMPONENT_SET — `tone` (12 values: Neutral, Brand,
 * Destructive, Warning, Success, Info, Gray blue, Blue light, Indigo,
 * Purple, Pink, Orange), each resolving to a subtle fill and a strong text
 * color from the semantic `color/tone/<name>/*` layer (`theme.css`'s
 * `--tone-*` tokens). Figma previously also offered a "Modern" style (white
 * card fill, neutral border, shadow/xs, tone driving only the dot/icon
 * color) but that axis has since been removed from the design system — only
 * the tonal-fill style remains, so `Badge` has no `style` prop. Figma also
 * dropped the border from every tone/size combination (2026-09) — the fill
 * alone now carries the tone, no `border-tone-*-muted` outline.
 *
 * `size`: `sm` (22px, `text-xs`), `md` (26px, `text-sm`), `lg` (30px,
 * `text-sm`) — the type ramp comes from the file's `xs`/`sm` text styles,
 * so heights differ slightly from Untitled UI's own 22/24/28 scale.
 *
 * `dot`, `icon`, `rightIcon`, and `onClose` are boolean-driven slots rather
 * than `cva` variants, matching `Button`'s icon-prop pattern — passing
 * `icon` without `label` (or `label={null}`/omitting children) renders an
 * icon-only badge, per Figma's "Show Label off + Show Icon L on" guidance.
 */
const badgeVariants = cva(
  "inline-flex shrink-0 items-center rounded-badge font-medium whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "bg-tone-neutral-subtle text-tone-neutral",
        brand: "bg-tone-brand-subtle text-tone-brand",
        destructive: "bg-tone-destructive-subtle text-tone-destructive",
        warning: "bg-tone-warning-subtle text-tone-warning",
        success: "bg-tone-success-subtle text-tone-success",
        info: "bg-tone-info-subtle text-tone-info",
        "gray-blue": "bg-tone-gray-blue-subtle text-tone-gray-blue",
        "blue-light": "bg-tone-blue-light-subtle text-tone-blue-light",
        indigo: "bg-tone-indigo-subtle text-tone-indigo",
        purple: "bg-tone-purple-subtle text-tone-purple",
        pink: "bg-tone-pink-subtle text-tone-pink",
        orange: "bg-tone-orange-subtle text-tone-orange",
      },
      size: {
        sm: "h-[22px] gap-1 px-2 py-0.5 text-xs",
        md: "h-[26px] gap-1 px-2.5 py-0.5 text-sm",
        lg: "h-[30px] gap-1.5 px-3 py-1 text-sm",
      },
    },
    defaultVariants: { tone: "neutral", size: "sm" },
  },
);

interface BadgeProps
  extends Omit<React.ComponentProps<"span">, "children">,
    VariantProps<typeof badgeVariants> {
  /** Badge text. Omit (or pass `null`) for an icon-only badge (Figma: Show Label off). */
  label?: React.ReactNode;
  /** Leading status dot (Figma: `Dot`, 6px, `currentColor`-filled — always matches the tone's strong color). */
  dot?: boolean;
  /** Leading icon (Figma: `Icon`, 12px). Pass an icon component (auto-sized/colored) or a pre-rendered element. */
  icon?: IconProp;
  /** Trailing icon (Figma: `Right Icon`, 12px). Same contract as `icon`. */
  rightIcon?: IconProp;
  /** Shows a trailing close (×) control (Figma: `Close`, 12px) and calls back on press. Renders a real `button` nested in the badge, not a bare icon, so it stays independently focusable/clickable. */
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Accessible label for the close button. Required when `onClose` is set. */
  closeLabel?: string;
}

/** A status/metadata label — tonal fill, optional dot/icons/close. Figma: `badge`. */
function Badge({
  className,
  tone,
  size,
  label,
  dot = false,
  icon,
  rightIcon,
  onClose,
  closeLabel = "Remove",
  ...props
}: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-tone={tone}
      data-size={size}
      className={cn(badgeVariants({ tone, size }), className)}
      {...props}
    >
      {dot && (
        <span
          data-slot="badge-dot"
          className="size-1.5 shrink-0 rounded-full bg-current"
        />
      )}
      {icon && (
        <span
          data-slot="badge-icon"
          className="flex shrink-0 [&_svg]:size-3"
        >
          {renderIcon(icon, "leading")}
        </span>
      )}
      {label != null && <span data-slot="badge-label">{label}</span>}
      {rightIcon && (
        <span
          data-slot="badge-icon-right"
          className="flex shrink-0 [&_svg]:size-3"
        >
          {renderIcon(rightIcon, "trailing")}
        </span>
      )}
      {onClose && (
        <button
          type="button"
          data-slot="badge-close"
          aria-label={closeLabel}
          onClick={onClose}
          className="flex shrink-0 rounded-full [&_svg]:size-3"
        >
          <X />
        </button>
      )}
    </span>
  );
}

export { Badge, badgeVariants, type BadgeProps };

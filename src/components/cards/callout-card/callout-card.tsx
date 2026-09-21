import * as React from "react";
import { Link as AriaLink, type LinkProps as AriaLinkProps } from "react-aria-components";
import { ArrowUpRight, CheckCircleBroken } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { Typography } from "@/components/typography";

/**
 * A clickable navigation callout — optional leading icon, title, description,
 * and an arrow-up-right affordance on a brand-subtle card. Figma:
 * `callout-card` COMPONENT_SET (`Property 1`: Default, Hover). Wraps React
 * Aria's `Link` (not `Button`) since the arrow-up-right icon signals
 * navigation, matching `Button`'s own `LinkButtonProps` pattern — `href` is
 * required.
 *
 * Hover uses the shared `--hover` overlay token (Figma: `state/hover`,
 * `neutral-700` at ~3%), the same mechanism as other no-solid-fill hover
 * treatments, rather than a card-specific darken. The arrow icon's own
 * rosewood-200 → rosewood-800 hover recolor is unchanged from Figma's
 * flattened preview, since no separate icon-color variable is bound there.
 */
interface CalloutCardProps
  extends Omit<AriaLinkProps, "children" | "className"> {
  /** Callout headline. */
  title: string;
  /** Supporting copy. */
  description: string;
  /** Shows a leading icon before the title. Defaults to `check-circle-broken` unless `icon` overrides it. */
  showIcon?: boolean;
  /** Custom leading icon, rendered only when `showIcon` is true. Falls back to `check-circle-broken`. */
  icon?: React.ReactNode;
  href: NonNullable<AriaLinkProps["href"]>;
  className?: string;
}

/** A clickable navigation callout card — optional leading icon, title, description, and an arrow-up-right affordance. Figma: `callout-card`. */
function CalloutCard({
  title,
  description,
  showIcon = false,
  icon,
  className,
  ...props
}: CalloutCardProps) {
  return (
    <AriaLink
      data-slot="callout-card"
      className={cn(
        "group flex w-full items-center gap-18 rounded-card bg-tone-brand-subtle py-8 pr-10 pl-8 transition duration-100 ease-linear",
        "data-[hovered]:bg-hover",
        "data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-2",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-px flex-1 flex-col items-start gap-2">
        <div className="flex w-full items-center gap-3">
          {showIcon && (icon ?? <CheckCircleBroken className="size-6 shrink-0 text-foreground" />)}
          <Typography size="xl" weight="semibold" className="text-foreground">
            {title}
          </Typography>
        </div>
        <Typography size="base" className="w-full text-foreground-muted">
          {description}
        </Typography>
      </div>
      <ArrowUpRight className="size-6 shrink-0 text-rosewood-200 transition duration-100 ease-linear group-data-[hovered]:text-rosewood-800" />
    </AriaLink>
  );
}

export { CalloutCard, type CalloutCardProps };

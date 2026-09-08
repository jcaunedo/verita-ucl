import * as React from "react";
import { Link as AriaLink, type LinkProps as AriaLinkProps } from "react-aria-components";
import { ArrowUpRight } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { Typography } from "@/components/typography";

/**
 * A clickable navigation callout — title, description, and an arrow-up-right
 * affordance on a brand-subtle card. Figma: `callout-card` COMPONENT_SET
 * (`Property 1`: Default, Hover). Wraps React Aria's `Link` (not `Button`)
 * since the arrow-up-right icon signals navigation, matching `Button`'s own
 * `LinkButtonProps` pattern — `href` is required.
 *
 * Hover is a 2% black darken over the base `--tone-brand-subtle` fill
 * (Figma: `rgba(0,0,0,0.02)` over `color/tone/brand/subtle`), expressed via
 * `color-mix` like `Button`'s other hover-darken colors. The arrow icon
 * itself also recolors on hover, from `rosewood-200` (pale) to `rosewood-800`
 * (`color/tone/brand/brand`) — a distinct, separately-bound Figma value, not
 * a byproduct of the card's own darken.
 */
interface CalloutCardProps
  extends Omit<AriaLinkProps, "children" | "className"> {
  /** Callout headline. */
  title: string;
  /** Supporting copy. */
  description: string;
  href: NonNullable<AriaLinkProps["href"]>;
  className?: string;
}

/** A clickable navigation callout card — title, description, and an arrow-up-right affordance. Figma: `callout-card`. */
function CalloutCard({
  title,
  description,
  className,
  ...props
}: CalloutCardProps) {
  return (
    <AriaLink
      data-slot="callout-card"
      className={cn(
        "group flex w-full items-center gap-18 rounded-card bg-tone-brand-subtle py-8 pr-10 pl-8 transition duration-100 ease-linear",
        "data-[hovered]:bg-[color-mix(in_srgb,var(--tone-brand-subtle)_98%,black)]",
        "data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-2",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-px flex-1 flex-col items-start gap-2">
        <Typography size="xl" weight="semibold" className="text-foreground">
          {title}
        </Typography>
        <Typography size="base" className="w-full text-foreground-muted">
          {description}
        </Typography>
      </div>
      <ArrowUpRight className="size-6 shrink-0 text-rosewood-200 transition duration-100 ease-linear group-data-[hovered]:text-rosewood-800" />
    </AriaLink>
  );
}

export { CalloutCard, type CalloutCardProps };

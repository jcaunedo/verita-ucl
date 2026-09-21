import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A continuous, exact-4px-dash/4px-gap rounded-rect border, rendered as a
 * live inline SVG rather than CSS `border-dashed` or a background-image
 * trick. Figma's dashed cards (`next-step-card`, `section-empty-state`) use
 * a precise 4px/4px pattern that plain `border-dashed` can't reproduce
 * (browsers auto-size dashes relative to border-width with no gap control),
 * and no purely-CSS technique (gradients, `border-image`, `mask-image`) can
 * carry an exact dash length continuously through a rounded corner on a box
 * of arbitrary/responsive size without distortion or an uneven dash right at
 * the corner — that needs real SVG path stroking, sized to the actual
 * rendered box on every render, which only a live `<svg>` element provides.
 *
 * Absolutely positioned, `pointer-events-none`, and colored via
 * `stroke="currentColor"` so it composes with a `text-*` color utility on
 * the parent (e.g. `<div className="relative text-next-steps-card-border">`)
 * — same `currentColor` convention as this repo's other icon/border SVGs.
 * The parent must be `position: relative` (or otherwise establish a
 * positioning context) and sized (the SVG stretches to `inset-0`).
 */
interface DashedBorderProps {
  /** Corner radius in px — must match the parent's own `rounded-*` value exactly, since this isn't derived from CSS. */
  radius: number;
  className?: string;
}

function DashedBorder({ radius, className }: DashedBorderProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    >
      <rect
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        rx={radius - 0.5}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
    </svg>
  );
}

export { DashedBorder, type DashedBorderProps };

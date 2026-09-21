import * as React from "react";
import { Link as AriaLink, type LinkProps as AriaLinkProps } from "react-aria-components";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight } from "@untitledui/icons";

import { cn } from "@/lib/utils";

/**
 * A text link with an optional trailing "external/navigate" arrow — e.g. a
 * dashboard section's "View All" link. Figma: `Hyperlink` (`Property 1` size
 * axis → `size`: `14`→`sm`, `16`→`base`; `state/link` blue text, hovering to
 * `foreground/foreground` — not an underline). Distinct from `Button`'s
 * `color="link-color"` (a rosewood CTA styled as text) — this is a plain
 * navigational link.
 */
const hyperlinkVariants = cva(
  "inline-flex items-center gap-1.5 text-link outline-none hover:text-foreground data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-2",
  {
    variants: {
      size: {
        sm: "text-sm font-medium",
        base: "text-base font-medium",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);

interface HyperlinkProps
  extends Omit<AriaLinkProps, "children" | "className">,
    VariantProps<typeof hyperlinkVariants> {
  /** Link label. */
  children: React.ReactNode;
  /** Shows the trailing arrow-up-right icon (Figma: `showArrowUpRight`). */
  showArrow?: boolean;
  className?: string;
}

function Hyperlink({ size, children, showArrow, className, ...props }: HyperlinkProps) {
  return (
    <AriaLink
      data-slot="hyperlink"
      className={cn(hyperlinkVariants({ size }), className)}
      {...props}
    >
      {children}
      {showArrow && <ArrowUpRight className="size-[18px] shrink-0" />}
    </AriaLink>
  );
}

export { Hyperlink, hyperlinkVariants, type HyperlinkProps };

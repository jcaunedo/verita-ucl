import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Type scale. `size` carries font-size + line-height (via the --text-*
 * tokens) plus the font assignment: sizes up to `lg` use the body font,
 * `xl` and larger use the display/headline font. `weight` is an independent
 * axis.
 */
const typographyVariants = cva("", {
  variants: {
    size: {
      xs: "font-sans text-xs",
      sm: "font-sans text-sm",
      base: "font-sans text-base",
      lg: "font-sans text-lg tracking-normal",
      xl: "font-display text-xl tracking-normal",
      "2xl": "font-display text-2xl",
      "3xl": "font-display text-3xl",
      "4xl": "font-display text-4xl",
      "5xl": "font-display text-5xl",
      "6xl": "font-display text-6xl",
      "7xl": "font-display text-7xl",
    },
    weight: {
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "regular",
  },
});

type TypographySize = NonNullable<
  VariantProps<typeof typographyVariants>["size"]
>;
type TypographyWeight = NonNullable<
  VariantProps<typeof typographyVariants>["weight"]
>;

interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  /** Element to render. Defaults to a <p>. Use this for semantics, e.g. as="h1". */
  as?: React.ElementType;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, size, weight, as, children, ...props }, ref) => {
    const Component = as ?? "p";

    return (
      <Component
        ref={ref}
        className={cn(typographyVariants({ size, weight }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Typography.displayName = "Typography";

export {
  Typography,
  typographyVariants,
  type TypographyProps,
  type TypographySize,
  type TypographyWeight,
};

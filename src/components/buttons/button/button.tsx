import * as React from "react";
import type {
  ButtonProps as AriaButtonProps,
  LinkProps as AriaLinkProps,
} from "react-aria-components";
import { Button as AriaButton, Link as AriaLink } from "react-aria-components";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/** Matches Untitled UI's `isReactComponent` check: true for an unrendered function component reference (e.g. `HomeLine`), false for an already-rendered element (e.g. `<HomeLine />`). */
function isIconComponent(
  value: unknown,
): value is React.FC<{ className?: string }> {
  return typeof value === "function";
}

type IconProp = React.FC<{ className?: string }> | React.ReactNode;

/** Renders either an unrendered icon component (auto-sized/colored via `data-icon`) or a pre-rendered element as-is — matches Untitled UI's own icon-prop contract. */
function renderIcon(icon: IconProp, position: "leading" | "trailing") {
  if (isIconComponent(icon)) {
    const Icon = icon;
    return <Icon data-icon={position} />;
  }
  return icon;
}

/**
 * Figma `button` COMPONENT_SET → `color` (Style + Tone):
 * - Solid/Brand → primary, Solid/Destructive → primary-destructive.
 *   `primary`'s hover was re-synced twice on 2026-09-07: first to a 15% white
 *   overlay, now to a flat, directly-bound `rosewood/600` (`#88353f`) fill —
 *   no overlay/gradient this time, just a solid color-mix-free swap. Don't
 *   normalize this to match Solid/Destructive's hover, which is still an
 *   unrelated 10% black darken over its own base fill (untouched both times).
 * - Outlined/Neutral → secondary (white + border + shadow-xs)
 * - Outlined/Destructive → secondary-destructive (added 2026-09-06, Text only
 *   — no Icon-only variant exists in Figma for this tone). Uses the raw
 *   `destructive-400`/`destructive-200` primitives (Figma's own
 *   `color/tone/destructive/*` scale), not the semantic `--destructive` token
 *   — same reason as `primary-destructive`: this repo's `--destructive`
 *   resolves to `destructive-500`, but every destructive button in Figma
 *   binds to `destructive-400`/`-200`, a lighter step the semantic token
 *   doesn't currently point at.
 * - Ghost/Neutral → tertiary — matches Untitled UI's own `tertiary` exactly
 *   (no bg/border idle, hover gains a fill). Originally named `ghost` because
 *   Figma had a second no-bg neutral style (`Flat/Neutral`, mapped to
 *   `tertiary` at the time) with a different hover treatment; now that
 *   `Style=Flat` is retired (2026-09-06), Ghost/Neutral is the only one left
 *   and it *is* Untitled UI's `tertiary`, so the name was corrected to match.
 * - Ghost/Destructive → tertiary-destructive (added 2026-09-06, Text only —
 *   no Icon-only variant exists in Figma for this tone, same as
 *   secondary-destructive). Same shape as `tertiary` (no bg/border idle,
 *   `rgba(58,52,40,0.03)` hover fill) with `destructive-400`/`destructive-200`
 *   text instead of `foreground`/`foreground-subtle` — the old
 *   `tertiary-destructive` (from `Flat/Destructive`) was retired earlier in
 *   the same pass that dropped `Style=Flat`; this is a distinct, re-added
 *   color backed by a real Ghost/Destructive Figma source, not a restoration
 *   of the removed one.
 * - Link/Brand → link-color. Its text fill and radius were bound to a stale
 *   external variable (old sunset `#f26740` + 12px radius, orphaned by the
 *   rosewood rebrand) as of the initial sync — corrected in code at the time
 *   to `text-primary` + pill radius to match every other Brand-tone variant.
 *   Figma's own binding was fixed shortly after (now points at this file's
 *   local `radius/button-lg` like every other variant), so the code's
 *   correction and Figma now agree independently.
 *
 * All button radii resolve to `radius/full` (9999px) — pill-shaped, no size
 * variance — confirmed directly against Figma's `radius/button-*` semantic
 * tokens (all alias `radius/full`), consistently across every Style/Tone/Type
 * combo including Link/Brand, as of the 2026-09-06 Figma radius fix.
 *
 * `noTextPadding` (matching Untitled UI's own prop of the same name) zeroes
 * the button's own padding — forced on for `link-color` (a link shouldn't
 * carry pill padding), opt-in for any other color. Deliberately narrower than
 * Untitled UI's version: theirs *also* toggles a `px-0.5` buffer on the text
 * span, layered on top of their container padding. Ours doesn't, because our
 * per-size paddings above were measured directly from Figma's absolute node
 * positions (container-edge to text-edge) and already produce the correct
 * final spacing with no such buffer — adding one would double-count 2px that
 * Figma's own measurements don't show.
 */
const buttonVariants = cva(
  [
    "group relative inline-flex items-center justify-center gap-1 rounded-full font-medium whitespace-nowrap outline-none transition duration-100 ease-linear",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    "*:data-[icon]:pointer-events-none *:data-[icon]:shrink-0 *:data-[icon]:transition-inherit-all",
    "data-loading:pointer-events-none",
  ].join(" "),
  {
    variants: {
      size: {
        // Heights/padding/icon sizes re-measured 2026-09-06 against the
        // updated size-scale.md (32/36/40/44/48px, sm now the default,
        // matching Untitled UI). Horizontal padding measured directly from
        // Figma (container-edge to label text, absolute position diff) —
        // sm lands on Tailwind's spacing scale (16px), the rest don't
        // (14/18/18/18px). md/lg/xl converge on the same 18px padding.
        xs: "h-8 gap-1 px-3.5 text-sm *:data-[icon]:size-4",
        sm: "h-9 gap-1 px-4 text-sm *:data-[icon]:size-4",
        md: "h-10 gap-1 px-[18px] text-sm *:data-[icon]:size-5",
        lg: "h-11 gap-1 px-[18px] text-sm *:data-[icon]:size-5",
        xl: "h-12 gap-1 px-[18px] text-sm *:data-[icon]:size-5",
      },
      color: {
        primary:
          "bg-primary text-primary-foreground hover:bg-rosewood-600 disabled:bg-primary-muted",
        "primary-destructive":
          "bg-destructive-400 text-white hover:bg-[color-mix(in_srgb,var(--destructive-400)_90%,black)] disabled:bg-fill-muted",
        secondary:
          "border border-border bg-white text-foreground shadow-xs hover:bg-hover disabled:border-[#e8eaee] disabled:bg-[#f9f8f5] disabled:text-foreground-subtle",
        "secondary-destructive":
          "border border-destructive-200 bg-white text-destructive-400 shadow-xs hover:bg-destructive-subtle disabled:border-destructive-subtle disabled:bg-transparent disabled:text-destructive-200",
        tertiary:
          "bg-transparent text-foreground hover:bg-neutral-100 disabled:text-foreground-subtle",
        "tertiary-destructive":
          "bg-transparent text-destructive-400 hover:bg-destructive-subtle disabled:text-destructive-200",
        "link-color":
          "justify-normal gap-1 text-primary hover:text-foreground disabled:text-foreground-subtle *:data-[text]:underline *:data-[text]:decoration-transparent hover:*:data-[text]:decoration-current",
      },
    },
    defaultVariants: {
      size: "sm",
      color: "primary",
    },
  },
);

/** Common props shared between the button and link variants. */
interface CommonProps extends VariantProps<typeof buttonVariants> {
  /** Shows a loading spinner and disables the button. */
  isLoading?: boolean;
  /** Icon to show before the text — an unrendered component reference (e.g. `HomeLine`, sized/colored automatically) or a pre-rendered element (e.g. `<HomeLine className="..." />`, styled manually). */
  iconLeading?: IconProp;
  /** Icon to show after the text — same shape as `iconLeading`. */
  iconTrailing?: IconProp;
  /** Zeroes the button's own padding. Always on for `color="link-color"`; opt-in for any other color. */
  noTextPadding?: boolean;
  children?: React.ReactNode;
  className?: string;
}

interface ButtonProps
  extends CommonProps,
    Omit<AriaButtonProps, "children" | "className"> {}

interface LinkButtonProps
  extends CommonProps,
    Omit<AriaLinkProps, "children" | "className"> {
  href: NonNullable<AriaLinkProps["href"]>;
}

type Props = ButtonProps | LinkButtonProps;

/** The Verita button. Figma: `button` (Type=Text|Icon, Style×Tone→`color`, Size, State). */
const Button: {
  (props: LinkButtonProps): React.ReactElement<LinkButtonProps>;
  (props: ButtonProps): React.ReactElement<ButtonProps>;
} = ({
  size = "sm",
  color = "primary",
  children,
  className,
  iconLeading,
  iconTrailing,
  isDisabled,
  isLoading,
  noTextPadding,
  ...props
}) => {
  const href = "href" in props ? props.href : undefined;
  const isIconOnly = (iconLeading || iconTrailing) && !children;
  const isNoTextPadding = color === "link-color" || noTextPadding;

  const content = (
    <>
      {renderIcon(iconLeading, "leading")}
      {isLoading && (
        <svg
          fill="none"
          data-icon="loading"
          viewBox="0 0 20 20"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <circle
            className="stroke-current opacity-30"
            cx="10"
            cy="10"
            r="8"
            fill="none"
            strokeWidth="2"
          />
          <circle
            className="origin-center animate-spin stroke-current"
            cx="10"
            cy="10"
            r="8"
            fill="none"
            strokeWidth="2"
            strokeDasharray="12.5 50"
            strokeLinecap="round"
          />
        </svg>
      )}
      {children && <span data-text>{children}</span>}
      {renderIcon(iconTrailing, "trailing")}
    </>
  );

  const commonProps = {
    "data-slot": "button",
    "data-loading": isLoading ? true : undefined,
    "data-icon-only": isIconOnly ? true : undefined,
    ...props,
    isDisabled: isDisabled,
    className: cn(
      buttonVariants({ size, color }),
      isIconOnly && "aspect-square px-0",
      isNoTextPadding && "p-0!",
      isLoading && "[&>*:not([data-icon=loading])]:invisible",
      className,
    ),
    children: content,
  };

  if ("href" in commonProps) {
    return <AriaLink {...commonProps} href={isDisabled ? undefined : href} />;
  }

  return (
    <AriaButton
      {...commonProps}
      type={commonProps.type || "button"}
      isPending={isLoading}
    />
  );
};

export {
  Button,
  buttonVariants,
  type ButtonProps,
  type LinkButtonProps,
  type Props as ButtonComponentProps,
};

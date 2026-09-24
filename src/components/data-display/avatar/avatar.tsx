import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Figma `avatar-users` COMPONENT_SET (18 variants: w1-4/w10, m1-3 photo
 * avatars; i1-10 initials avatars) — all variants share the same 36px
 * circular shape and optional status dot, differing only in their image
 * source or initials/background color. Rather than reproduce 18 fixed
 * variants, `Avatar` exposes `src`/`initials` props so any photo or
 * initials combination renders through the same shape: `src` renders the
 * photo pattern (`w*`/`m*`), `initials` (when `src` is absent) renders the
 * initials pattern (`i*`). Each `i*` variant's background color is a
 * hardcoded per-instance value in Figma (not a bound token — different for
 * every sample), so `Avatar` exposes `className` for the consumer to set
 * a background rather than hardcoding one of Figma's sample colors.
 *
 * The `i1` sample used `Inter:SemiBold` for initials, matching the design
 * system's font.
 */
const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
  {
    variants: {
      // Figma's `avatar-users` only shows one size (36px, → `md`). `sm`/`lg`
      // are an extrapolated 3-step scale (32/36/40px) with no Figma source —
      // confirmed with the user as a reasonable default, not a literal sync.
      // `xl` (56px) is Untitled UI's `xl` avatar size, first used by the
      // account menu header (Figma: `Select Content Account Menu (Popper)`);
      // its initials render at `text-lg` (18px), the nearest token to Figma's
      // 18.67px (a third of the avatar).
      size: {
        sm: "size-8 text-xs",
        md: "size-9 text-xs",
        lg: "size-10 text-sm",
        xl: "size-14 text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  /** Photo URL. When present, renders the photo pattern (Figma's `w*`/`m*` variants) and `initials` is ignored. */
  src?: string;
  /** Alt text for the photo. Required semantically whenever `src` is set. */
  alt?: string;
  /** Initials shown when no `src` is given (Figma's `i*` variants). */
  initials?: string;
  /** Shows the online-status dot (Figma's `Dot`, `showDot` prop). */
  showStatusDot?: boolean;
}

/** A user avatar — photo or initials, with an optional status dot. Figma: `avatar-users`. */
function Avatar({
  className,
  size,
  src,
  alt,
  initials,
  showStatusDot = false,
  ...props
}: AvatarProps) {
  return (
    <div
      data-slot="avatar"
      className={cn(avatarVariants({ size }), className)}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt ?? ""}
          className="size-full object-cover"
        />
      ) : (
        <span className="font-semibold text-white">{initials}</span>
      )}
      {showStatusDot && (
        <span
          data-slot="avatar-status-dot"
          className="absolute right-0 bottom-0 size-[9px] rounded-full bg-success ring-[2.25px] ring-white"
        />
      )}
    </div>
  );
}

export { Avatar, avatarVariants, type AvatarProps };

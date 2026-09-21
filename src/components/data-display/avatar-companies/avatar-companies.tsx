import * as React from "react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/branding/logo";

/**
 * Figma `avatar-companies` (`Property 1`: verita, google, amazon, apple) is a
 * fixed 4-value enum, but only `verita` has a real bundled asset — Figma's
 * google/amazon/apple examples render actual company trademarks (Google's
 * "G", Amazon's smile, Apple's logo) that this library does not bundle.
 * Those three values instead select the *tile treatment* Figma shows for any
 * external partner (white background, `border-border`, `rounded-xl`,
 * letterboxed logo) — the same treatment a `company` value outside the
 * four named ones falls back to — and still require `logoSrc`/`logoAlt` to
 * supply the actual image. `verita` is the only value with a built-in
 * image: it reuses the existing `Logo` component's `mark` (Figma's
 * `Verita-Symbol`, the same rosewood brand glyph as this node's `verita`
 * variant) on a `bg-primary-subtle` tile, and ignores `logoSrc`/`logoAlt`.
 */
interface AvatarCompaniesProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Which tile treatment to render. `"verita"` renders the bundled Verita
   * mark and ignores `logoSrc`/`logoAlt`. Every other value (the named
   * `"google"`/`"amazon"`/`"apple"` examples, or any other partner) renders
   * the same letterboxed white tile and requires `logoSrc`. Defaults to
   * `"verita"` to match Figma's default.
   */
  company?: "verita" | "google" | "amazon" | "apple" | (string & {});
  /** Partner logo image. Required (and only used) when `company` isn't `"verita"`. */
  logoSrc?: string;
  /** Alt text for `logoSrc`. Required semantically whenever `logoSrc` is set. */
  logoAlt?: string;
  className?: string;
}

/** A partner/company avatar tile — the Verita brand mark, or a letterboxed partner logo. Figma: `avatar-companies`. */
function AvatarCompanies({
  company = "verita",
  logoSrc,
  logoAlt,
  className,
  ...props
}: AvatarCompaniesProps) {
  if (company === "verita") {
    return (
      <div
        data-slot="avatar-companies"
        data-company={company}
        className={cn(
          "flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary-subtle",
          className,
        )}
        {...props}
      >
        <Logo mark className="size-8" />
      </div>
    );
  }

  return (
    <div
      data-slot="avatar-companies"
      data-company={company}
      className={cn(
        "flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white",
        className,
      )}
      {...props}
    >
      {logoSrc && (
        <img
          src={logoSrc}
          alt={logoAlt ?? ""}
          className="size-[42px] object-contain"
        />
      )}
    </div>
  );
}

export { AvatarCompanies, type AvatarCompaniesProps };

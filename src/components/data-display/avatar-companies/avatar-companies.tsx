import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Figma `avatar-companies` (`Property 1`: verita, google, amazon, apple, and
 * a Bank of America variant still named `Variant5` in Figma) is a fixed
 * 5-value enum, but only `verita` has a real bundled asset — Figma's
 * google/amazon/apple/bank-of-america examples render actual company
 * trademarks (Google's "G", Amazon's smile, Apple's logo, Bank of America's
 * flag) that this library does not bundle. Those four values instead
 * select the *tile treatment* Figma shows for any external partner (white
 * background, `border-border`, `rounded-xl`, letterboxed logo) — the same
 * treatment a `company` value outside the named ones falls back to — and still require `logoSrc`/`logoAlt` to
 * supply the actual image. `verita` is the only value with a built-in
 * image: the rosewood serif "V" (`VeritaTileGlyph`) on a `bg-primary-subtle`
 * tile, and it ignores `logoSrc`/`logoAlt`. The glyph lives here rather than
 * in `Logo`: since 2026-10-03 `Logo`'s mark is the script "v" in
 * `foreground`, while Figma's `verita` tile keeps its own serif "V" vector.
 *
 * Partner logos are centered in a 40px box — the single frame size Figma
 * uses for every partner logo layer (2026-09-22 revision; previously
 * 41.74px with per-logo exceptions). `logoSrc` should be a square image with
 * the glyph's padding built in and its true aspect ratio, like Figma's
 * exported `@2x` assets; a tightly cropped mark will render oversized.
 * `object-contain` never distorts — fix a stretched or off-center source
 * image rather than special-casing its box.
 */
interface AvatarCompaniesProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Which tile treatment to render. `"verita"` renders the bundled Verita
   * mark and ignores `logoSrc`/`logoAlt`. Every other value (the named
   * `"google"`/`"amazon"`/`"apple"`/`"bank-of-america"` examples, or any
   * other partner) renders the same letterboxed white tile and requires
   * `logoSrc`. Defaults to `"verita"` to match Figma's default.
   */
  company?: "verita" | "google" | "amazon" | "apple" | "bank-of-america" | (string & {});
  /** Partner logo image. Required (and only used) when `company` isn't `"verita"`. */
  logoSrc?: string;
  /** Alt text for `logoSrc`. Required semantically whenever `logoSrc` is set. */
  logoAlt?: string;
  className?: string;
}

/** Figma `avatar-companies` `verita`'s own glyph: the serif "V" in `rosewood`, 32px in the 48px tile. */
function VeritaTileGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" className="size-8 text-rosewood-800">
      <path
        d="M28.3743 5.63884L28.3333 5.66912L28.2776 5.70916L28.2571 5.72478L28.2317 5.72771C27.2348 5.85572 26.5389 6.19776 25.967 6.79119C25.3911 7.38891 24.9342 8.2471 24.4319 9.42302L16.9192 28.0383L16.8938 28.1017H15.5188L15.4934 28.0383L7.97778 9.28826C7.44078 7.96158 6.95442 7.12558 6.38599 6.5949C5.82184 6.06835 5.16748 5.83392 4.27271 5.73259L4.26196 5.73162L4.25317 5.72869L4.1272 5.68767L4.05786 5.66521V4.58806H13.7463V5.71599L13.7161 5.74529L13.6604 5.799L13.634 5.82537L13.5969 5.82732C12.7846 5.87599 12.2043 5.98693 11.8284 6.21111C11.6431 6.32168 11.5081 6.45928 11.4192 6.63103C11.3299 6.80359 11.2834 7.01711 11.2834 7.28337C11.2835 7.85188 11.4456 8.40915 11.7112 9.08806L17.2327 22.9133L22.0852 10.1926L22.0862 10.1896C22.3868 9.458 22.6151 8.86861 22.7688 8.3781C22.9225 7.88744 22.9992 7.50117 22.9993 7.174C22.9993 6.90674 22.945 6.69948 22.8489 6.53728C22.7529 6.37554 22.6106 6.2508 22.425 6.15251C22.048 5.95297 21.5025 5.86926 20.8323 5.81365H20.8284L20.4954 5.77263L20.4075 5.76189V4.58416H28.3743V5.63884ZM23.7405 26.2785C24.1827 26.2453 24.5535 26.2562 24.8528 26.299C25.2478 26.3556 25.535 26.471 25.6917 26.633C25.7379 26.6811 25.7682 26.7404 25.7688 26.8078C25.7693 26.8736 25.7411 26.9319 25.7034 26.9797C25.6301 27.0723 25.4994 27.1529 25.345 27.2219C25.0303 27.3623 24.5603 27.4791 24.0627 27.5353C23.5466 27.5921 22.9757 27.6075 22.3127 27.6281C21.6484 27.6487 20.8868 27.6742 19.9846 27.7511L19.925 27.757L19.8918 27.7052L19.7932 27.551L19.7375 27.464L19.8264 27.4113C20.8228 26.8142 22.0251 26.4814 23.2737 26.3273L23.7405 26.2785ZM24.1858 23.5969C24.3559 23.5974 24.5127 23.6229 24.6145 23.6916H24.6155C24.6907 23.7431 24.7483 23.8072 24.7825 23.883C24.8166 23.959 24.8245 24.041 24.8108 24.1242C24.7839 24.2869 24.6753 24.459 24.5149 24.6301C24.1914 24.9749 23.6148 25.3635 22.8557 25.7404L22.8547 25.7394C21.7755 26.2896 20.9697 26.6655 19.3918 27.2531L19.3254 27.2785L19.2795 27.2238L19.1252 27.0363L19.0627 26.9601L19.1379 26.8957C20.1346 26.0523 21.5836 24.858 22.2307 24.2873L22.2356 24.2824H22.2366C22.6351 23.9781 23.1388 23.7746 23.5803 23.673C23.8012 23.6223 24.0104 23.5964 24.1858 23.5969ZM22.302 20.7375C22.3853 20.7444 22.4557 20.7832 22.5042 20.8488C22.5497 20.9108 22.5723 20.9912 22.5803 21.0763C22.5963 21.2466 22.5581 21.475 22.4758 21.7375C22.31 22.2663 21.9526 22.9718 21.4104 23.716L21.4094 23.717C20.976 24.3014 20.5567 24.7725 20.1204 25.2629C19.6839 25.7534 19.2294 26.2647 18.72 26.9338L18.6829 26.9816L18.6233 26.9719L18.4963 26.9513L18.345 26.926L18.429 26.798C19.1387 25.7111 19.6433 24.4459 20.4192 22.8791H20.4202C20.6346 22.4556 20.9874 21.9197 21.3362 21.4933C21.5105 21.2803 21.6858 21.0908 21.845 20.9562C21.9245 20.889 22.0028 20.8335 22.0764 20.7951C22.1484 20.7576 22.2262 20.7314 22.302 20.7375Z"
        fill="currentColor"
      />
    </svg>
  );
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
        role="img"
        aria-label="Verita"
        {...props}
      >
        <VeritaTileGlyph />
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
          className="size-10 shrink-0 object-contain"
        />
      )}
    </div>
  );
}

export { AvatarCompanies, type AvatarCompaniesProps };

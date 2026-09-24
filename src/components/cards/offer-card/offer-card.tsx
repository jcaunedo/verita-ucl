import * as React from "react";
import { XClose } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { clickableRowProps } from "@/lib/clickable-row";
import { Button } from "@/components/buttons/button";
import {
  AvatarCompanies,
  type AvatarCompaniesProps,
} from "@/components/data-display/avatar-companies";
import { Typography } from "@/components/typography";

/**
 * A single offer row — identity, engagement terms, expiration, and a
 * "View offer" CTA, routing to the offer detail. Figma: `offer-card`
 * (`Property 1`: Default, Hover). Structurally the sibling of
 * `ApplicationCard`/`MatchCard` — same identity block (avatar,
 * `partner-name` eyebrow, title, `compensation · engagementTerms ·
 * duration` terms row) — but the right zone differs: an optional
 * expiration-date warning, a solid "View offer" `Button`, and a
 * hover-revealed dismiss (×) trigger instead of an actions-menu (`···`)
 * trigger.
 *
 * The entire row is the primary click target (no separate row-level CTA
 * distinct from the "View offer" button's own action), mirroring
 * `ApplicationCard`'s row-interaction model — `onPress`/`href` land on the
 * outer element via `rowProps`.
 *
 * Figma's hover-revealed icon button renders an × glyph (confirmed from its
 * SVG path), not the `···` overflow-menu icon `ApplicationCard`/`MatchCard`
 * use — this reads as "dismiss this offer from the list," so it's modeled
 * as `onDismiss`/`dismissLabel`, matching `NextStepCard`'s existing
 * dismiss-affordance naming (`onDismiss?: () => void`) rather than the
 * `onActionsPress` menu-trigger pattern. It reveals exactly like
 * `ApplicationCard`'s trigger (2026-09-22 Figma revision): it takes no space
 * at rest, and on hover/focus-within its slot grows to Figma's 16px gap +
 * 32px button, pushing "View offer" and the expiration date left while the
 * × (Figma: `icon/foreground`) dissolves in.
 *
 * `expirationDate` renders in `text-destructive` with the repo's standard
 * Inter font. Figma's `expiration-date` label binds to a raw, unbound hex
 * (`#d64242`, matching no existing token exactly — nearest is
 * `destructive-400`/`#c63333`) and a `Google Sans Flex` font-family that
 * doesn't exist anywhere else in this design system (only Inter is
 * configured) — treated as unintentional drift in the Figma file rather
 * than a deliberate new token/typeface.
 */
interface OfferCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Avatar tile treatment, forwarded to `AvatarCompanies` (Figma's `avatar-companies` `Property 1`). `"verita"` renders the bundled Verita mark and ignores `logoSrc`; any other value renders the partner tile. Defaults to `"partner"`. */
  company?: AvatarCompaniesProps["company"];
  /** Partner/opportunity logo. Optional, with a neutral fallback tile — Figma's `Logo`/`Logo icon`. */
  logoSrc?: string;
  /** Alt text for `logoSrc`. Required semantically whenever `logoSrc` is set. */
  logoAlt?: string;
  /** Opportunity title (Figma's `Title`). Supports multiline per the PRD. */
  title: string;
  /** Agreed compensation display string, already formatted per its unit, e.g. "$85/hour". Omit when unavailable. */
  compensation?: string;
  /** Engagement terms — time commitment only, e.g. "Up to 30 hrs/week" (Figma's `Engagement terms`). Omit when unavailable. */
  engagementTerms?: string;
  /** Confirmed duration, e.g. "3 months", "Ongoing" (Figma's `duration`) — a separate field from `engagementTerms`, never combined into one string. Omit when no confirmed timeframe exists. */
  duration?: string;
  /** Partner name or approved fallback (Figma's `partner-name`). Rendered as a small eyebrow line above `title`. */
  partnerName: string;
  /** Discipline/domain label (Figma's optional `Discipline` text). Omit when not applicable. */
  discipline?: string;
  /** Offer expiration display string, already formatted, e.g. "Expires in 3 days" (Figma's `expiration-date`). Rendered in the destructive tone as a time-sensitive warning. Omit when the offer has no expiration. */
  expirationDate?: string;
  /** Label for the "View offer" CTA (Figma's `button` instance). Defaults to "View offer" to match Figma. */
  ctaLabel?: string;
  /** Called when the "View offer" CTA is activated. */
  onCtaPress?: () => void;
  /** Accessible label for the hover-revealed dismiss (×) trigger. Required whenever `onDismiss` is set. */
  dismissLabel?: string;
  /** Called when the dismiss (×) trigger is activated. Omit to hide the trigger entirely. */
  onDismiss?: () => void;
  /** Forwarded to the row's own click target (e.g. `onClick`, which routes to the offer detail). Passing `onClick` makes the whole row a `role="button"` (pointer cursor, focusable, Enter/Space) via `clickableRowProps`; clicks on nested controls don't trigger it. */
  rowProps?: Omit<React.HTMLAttributes<HTMLDivElement>, "className">;
  className?: string;
}

/** An Offer card — identity, engagement terms, expiration, and a "View offer" CTA for one offer. Figma: `offer-card`. */
function OfferCard({
  company = "partner",
  logoSrc,
  logoAlt,
  title,
  compensation,
  engagementTerms,
  duration,
  partnerName,
  discipline,
  expirationDate,
  ctaLabel = "View offer",
  onCtaPress,
  dismissLabel,
  onDismiss,
  rowProps,
  className,
  ...props
}: OfferCardProps) {
  const termsParts = [compensation, engagementTerms, duration].filter(
    Boolean,
  );

  return (
    <div
      data-slot="offer-card"
      className={cn(
        "group flex w-full items-center gap-10 py-4 pr-6 pl-5 transition-colors duration-150 ease-out",
        "hover:bg-hover-row",
        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...clickableRowProps(rowProps)}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center gap-5">
        <AvatarCompanies company={company} logoSrc={logoSrc} logoAlt={logoAlt} />
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
          <div className="flex w-full flex-col items-start gap-0.5">
            {/* Figma groups partner name + title with no gap; the 2px gap sits between that pair and the terms row. */}
            <div className="flex w-full flex-col items-start">
              <Typography size="xs" className="w-full text-foreground-muted">
                {partnerName}
              </Typography>
              <Typography
                as="h3"
                weight="semibold"
                className="w-full text-foreground"
              >
                {title}
              </Typography>
            </div>
            {termsParts.length > 0 && (
              <Typography
                size="sm"
                className="flex items-center gap-1 whitespace-nowrap"
              >
                {termsParts.map((part, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <span
                        aria-hidden="true"
                        className="text-foreground-muted"
                      >
                        ·
                      </span>
                    )}
                    <span className="text-foreground">{part}</span>
                  </React.Fragment>
                ))}
              </Typography>
            )}
          </div>
        </div>
      </div>
      {/* Right zone hugs its content so the identity block (title) fills the rest of the row — not Figma's 50/50 `flex-1` split, which wrapped titles at the midpoint. */}
      <div className="flex shrink-0 items-center justify-end gap-4">
        {discipline && (
          <Typography
            size="base"
            className="min-w-0 flex-1 text-foreground-muted"
          >
            {discipline}
          </Typography>
        )}
        {expirationDate && (
          <Typography
            size="sm"
            className="whitespace-nowrap text-destructive"
          >
            {expirationDate}
          </Typography>
        )}
        <div className="flex shrink-0 items-center">
          <Button size="sm" onPress={onCtaPress}>
            {ctaLabel}
          </Button>
          {onDismiss && (
            // Same hover/focus-within reveal as `ApplicationCard`'s `···` slot: grows 0 → 48px (Figma's 16px gap + 32px button), pushing the CTA and expiration date left, while the × dissolves in.
            // Enter mirrors `standardTransition` (`motionDuration.normal`, Tailwind's `ease-in-out`); exit is shorter per CLAUDE.md "Dismiss". Kept mounted (clipped) so it stays keyboard-reachable.
            // The reveal lives on the slot so the Button keeps its own look + hover transition; `py-1 pr-1` (cancelled by `-my-1 -mr-1`, hence 52px) keeps its focus ring inside the clip.
            <div
              data-slot="offer-card-dismiss"
              className="-my-1 -mr-1 flex w-0 justify-end overflow-hidden py-1 pr-1 opacity-0 transition-[width,opacity] duration-150 ease-in-out group-focus-within:w-[52px] group-focus-within:opacity-100 group-focus-within:duration-300 group-hover:w-[52px] group-hover:opacity-100 group-hover:duration-300 motion-reduce:transition-none"
            >
              <Button
                color="tertiary"
                size="xs"
                iconLeading={XClose}
                aria-label={dismissLabel}
                onPress={onDismiss}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { OfferCard, type OfferCardProps };

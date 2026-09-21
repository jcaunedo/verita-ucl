import * as React from "react";
import { XClose } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/buttons/button";
import { AvatarCompanies } from "@/components/data-display/avatar-companies";
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
 * `onActionsPress` menu-trigger pattern.
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
  /** Forwarded to the row's own click target (e.g. `onClick`), which routes to the offer detail. */
  rowProps?: Omit<React.HTMLAttributes<HTMLDivElement>, "className">;
  className?: string;
}

/** An Offer card — identity, engagement terms, expiration, and a "View offer" CTA for one offer. Figma: `offer-card`. */
function OfferCard({
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
        "group flex w-full items-center gap-10 py-5 pr-6 pl-5 transition-colors duration-150 ease-out",
        "hover:bg-row-hover",
        className,
      )}
      {...rowProps}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center gap-5">
        <AvatarCompanies company="partner" logoSrc={logoSrc} logoAlt={logoAlt} />
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
          <div className="flex w-full flex-col items-start gap-0.5">
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
      <div className="flex flex-1 items-center justify-end gap-4">
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
            className="min-w-0 flex-1 text-right text-destructive"
          >
            {expirationDate}
          </Typography>
        )}
        <Button size="sm" onPress={onCtaPress}>
          {ctaLabel}
        </Button>
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={onDismiss}
          className="flex shrink-0 items-center justify-center rounded-full px-[5px] py-2 text-icon-muted opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-within:opacity-100 hover:text-icon-foreground focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span className="flex items-center px-[3px]">
            <XClose className="size-4" />
          </span>
        </button>
      )}
    </div>
  );
}

export { OfferCard, type OfferCardProps };

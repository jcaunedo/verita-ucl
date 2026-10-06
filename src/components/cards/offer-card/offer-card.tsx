import * as React from "react";
import { XClose } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { clickableRowProps } from "@/lib/clickable-row";
import { Button } from "@/components/buttons/button";
import { Badge, type BadgeProps } from "@/components/data-display/badge";
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
 * expiration-date warning, a solid "View offer" `Button`, and an
 * always-visible × that dismisses (declines) the offer.
 *
 * The entire row is the primary click target (no separate row-level CTA
 * distinct from the "View offer" button's own action), mirroring
 * `ApplicationCard`'s row-interaction model — `onPress`/`href` land on the
 * outer element via `rowProps`.
 *
 * `onDismiss` shows an × (`Button`, tertiary icon-only `xs`) after "View
 * offer", 16px apart, always visible (design direction 2026-09-30). It
 * replaced the hover-revealed `···` menu (View details, Decline): the row
 * already opens the detail, so Decline was the menu's only real action.
 * Pressing it dismisses the offer; the consumer declines it (Engagements moves
 * it to Offers → `Closed`). Closed offers pass no `onDismiss`, so they show
 * no ×.
 *
 * `expirationDate` renders in `text-destructive` (or `text-foreground-muted`
 * via `expirationTone` when the deadline is more than 5 days out), in Inter like Figma's
 * `sm` text style. Figma's `expiration-date` label still uses a raw,
 * unbound hex (`#d64242`, matching no existing token exactly — nearest is
 * `destructive-400`/`#c63333`), treated as drift in the Figma file rather
 * than a new token.
 *
 * A closed offer (`engagements.md` §4.1) shows its outcome the way a closed
 * application does: `statusLabel` renders the same `Badge` as
 * `ApplicationCard`, with `supportingText` before it in the same muted
 * style (e.g. "Declined by you on Sep 25"). Closed rows also drop the
 * expiration date and pass `showCta={false}`, since there's nothing left to
 * act on. No Figma design exists for this state yet.
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
  /** Offer expiration display string, already formatted, e.g. "Expires in 3 days" (Figma's `expiration-date`). Omit when the offer has no expiration. */
  expirationDate?: string;
  /**
   * `"destructive"` (default) while the offer expires in 5 days or fewer, `"muted"` (the supporting-text color) before
   * that (`offer-card.md` §2.3). The copy changes with it ("Expires in 3 days" vs "Expires on Oct 9"), so color is
   * never the only signal.
   */
  expirationTone?: "muted" | "destructive";
  /** Offer status label, e.g. "Declined" (`engagements.md` §4.1). Renders the same status `Badge` as `ApplicationCard`. Omit for an open offer awaiting a response, which Figma shows without a badge. */
  statusLabel?: string;
  /** Tone for the status badge. Defaults to `"neutral"`. */
  statusTone?: BadgeProps["tone"];
  /** One muted line before the badge with the outcome's details, e.g. "Declined by you on Sep 25". Omit entirely rather than passing an empty string. */
  supportingText?: string;
  /** Whether to render the "View offer" CTA. Defaults to `true`; closed offers pass `false`. */
  showCta?: boolean;
  /** Label for the "View offer" CTA (Figma's `button` instance). Defaults to "View offer" to match Figma. */
  ctaLabel?: string;
  /** Called when the "View offer" CTA is activated. */
  onCtaPress?: () => void;
  /** Shows the always-visible × and calls back when it's pressed — dismissing the offer declines it. Omit for closed offers. */
  onDismiss?: () => void;
  /** Accessible label for the ×. Required whenever `onDismiss` is set, e.g. "Decline Strategic Finance Expert". */
  dismissLabel?: string;
  /** Forwarded to the row's own click target (e.g. `onClick`, which routes to the offer detail). Passing `onClick` makes the whole row a `role="button"` (pointer cursor, focusable, Enter/Space) via `clickableRowProps`; clicks on nested controls (the CTA, the ×) don't trigger it. Omit `onClick` (and `onDismiss`) for a row that does nothing: it then has no hover tint either. */
  rowProps?: Omit<React.HTMLAttributes<HTMLDivElement>, "className">;
  /** Extra classes for the root element, merged after the component's own. */
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
  expirationTone = "destructive",
  statusLabel,
  statusTone = "neutral",
  supportingText,
  showCta = true,
  ctaLabel = "View offer",
  onCtaPress,
  onDismiss,
  dismissLabel,
  rowProps,
  className,
  ...props
}: OfferCardProps) {
  // Same terms treatment as `ApplicationCard`: compensation semibold, engagement terms and duration regular.
  const termsParts = [
    { value: compensation, className: "font-semibold" },
    { value: engagementTerms },
    { value: duration },
  ].filter((part) => Boolean(part.value));

  return (
    <div
      data-slot="offer-card"
      className={cn(
        "group flex w-full items-center gap-10 py-4 pr-6 pl-5 transition-colors duration-150 ease-out",
        // Hover tint only when the row does something: a row with no click target and no × (e.g. an expired offer
        // with no detail to open) stays flat, so it doesn't look clickable.
        (rowProps?.onClick || onDismiss) && "hover:bg-hover-row",
        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...clickableRowProps(rowProps)}
      {...props}
    >
      {/* Same zone split as `ApplicationCard` (and Figma's `flex-1` zones): 50/50 by default. With supporting text,
          the left keeps its natural width and the text takes the rest of the right zone. */}
      <div className={cn("flex min-w-0 items-center gap-5", supportingText ? "flex-initial" : "flex-1")}>
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
                weight="bold"
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
                    <span className={cn("text-foreground", part.className)}>{part.value}</span>
                  </React.Fragment>
                ))}
              </Typography>
            )}
          </div>
        </div>
      </div>
      {/* Figma `Right Container`: content right-aligned, sharing the row with the left zone. */}
      <div className="flex min-w-px flex-1 items-center justify-end gap-4">
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
            className={cn(
              "whitespace-nowrap",
              expirationTone === "destructive" ? "text-destructive" : "text-foreground-muted",
            )}
          >
            {expirationDate}
          </Typography>
        )}
        {supportingText && (
          // Same as `ApplicationCard`'s right-side supporting text: fills the space before the badge, up to 2 lines.
          <Typography size="sm" className="line-clamp-2 min-w-px flex-1 text-right text-foreground-muted">
            {supportingText}
          </Typography>
        )}
        {/* Badge, CTA, and × share one gapless wrapper, each later item carrying its own 16px gap. */}
        <div className="flex shrink-0 items-center">
          {statusLabel && <Badge tone={statusTone} label={statusLabel} size="md" />}
          {showCta && (
            <span className={cn("flex", statusLabel && "ml-4")}>
              <Button size="sm" onPress={onCtaPress}>
                {ctaLabel}
              </Button>
            </span>
          )}
          {onDismiss && (
            <span className={cn("flex", (statusLabel || showCta) && "ml-4")}>
              <Button color="tertiary" size="xs" iconLeading={XClose} aria-label={dismissLabel} onPress={onDismiss} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export { OfferCard, type OfferCardProps };

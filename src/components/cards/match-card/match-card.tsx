import * as React from "react";
import { Bookmark, BookmarkCheck, DotsHorizontal } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { clickableRowProps } from "@/lib/clickable-row";
import { Button } from "@/components/buttons/button";
import {
  AvatarCompanies,
  type AvatarCompaniesProps,
} from "@/components/data-display/avatar-companies";
import { Typography } from "@/components/typography";

/**
 * A single match row — identity, engagement terms, a plain-language fit
 * tier, and a recommended action, routing to the match detail. Figma:
 * `match-card` (`Property 1`: Default, Hover). Structurally the sibling of
 * `ApplicationCard` — same identity block (avatar, `partner-name` eyebrow,
 * title, `compensation · engagementTerms · duration` terms row), same
 * hover-revealed `···` actions trigger — but a Match is a system-suggested
 * signal, not a pursued Application (`product-specs/match-card.md` §1), so
 * the right zone differs: a plain-text match tier instead of a status
 * `Badge`, plus a saved-state toggle and a recommended-action CTA instead of
 * `supportingText`.
 *
 * The entire row is the primary click target (no separate CTA button),
 * mirroring `ApplicationCard`'s row-interaction model — `onPress`/`href`
 * land on the outer element via `rowProps`.
 * `product-specs/match-card.md` §7 leaves whether the entire card is a
 * single click target, or whether the primary CTA is a distinct control
 * from the row's own click-through, as an open question pending Figma
 * examples — this component currently follows the `ApplicationCard`
 * precedent until that's resolved.
 *
 * ⚠️ Only identity (avatar, `partnerName`, `title`, terms row), `discipline`,
 * `matchTier`, and the hover-revealed actions trigger are backed by the
 * linked Figma node — that frame only exposes `showDiscipline`/
 * `showDuration`/`showMatchTier` toggles, no badge/CTA/saved-toggle
 * treatment. `opportunityType`, `fitExplanation`, `readinessState`,
 * `missingRequirementSummary`, `isSaved`/`onSaveToggle`, and
 * `ctaLabel`/`onCtaPress` are modeled from `product-specs/match-card.md`
 * §2–§6's content requirements with plain `Typography`/`Button` primitives,
 * but have no Figma visual source yet — treat their layout as provisional
 * and revisit once design has examples for them.
 */
interface MatchCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Avatar tile treatment, forwarded to `AvatarCompanies` (Figma's `avatar-companies` `Property 1`). `"verita"` renders the bundled Verita mark and ignores `logoSrc`; any other value renders the partner tile. Defaults to `"partner"`. */
  company?: AvatarCompaniesProps["company"];
  /** Partner/opportunity logo. Optional, with a neutral fallback tile — Figma's `Logo`/`Logo icon`. Ignored when `company="verita"`. */
  logoSrc?: string;
  /** Alt text for `logoSrc`. Required semantically whenever `logoSrc` is set. */
  logoAlt?: string;
  /** Opportunity title (Figma's `Title`). Supports multiline per the PRD. */
  title: string;
  /** Advertised compensation display string, already formatted per its unit — may be a range (e.g. "$95-115k/yr"), unlike Contract/Application cards (`product-specs/match-card.md` §3.1). Omit when not disclosed. */
  compensation?: string;
  /** Engagement terms — time commitment only, e.g. "Up to 30 hrs/week" (Figma's `Engagement terms`). Omit when unavailable. */
  engagementTerms?: string;
  /** Advertised or estimated duration, e.g. "3 months", "Ongoing" (Figma's `duration`) — a separate field from `engagementTerms`. Shown only when a confirmed timeframe was posted (`product-specs/match-card.md` §3.2). */
  duration?: string;
  /** Partner name or approved anonymized label (Figma's `partner-name`). Rendered as a small eyebrow line above `title`. */
  partnerName: string;
  /** Discipline/domain label (Figma's optional `Discipline` text). Omit when not applicable. */
  discipline?: string;
  /** Plain-language fit tier (Figma's `qualitative-match-tier`), e.g. "Strong match" — never the internal numeric score (`product-specs/match-card.md` §4). Rendered as plain right-aligned muted text, matching Figma — tier-to-color treatment isn't decided yet. */
  matchTier?: string;
  /** ⚠️ No Figma source yet. Opportunity type per `product-specs/match-card.md` §3 — "Engagement" or "Talent Network", or an approved equivalent label. Omit to hide. */
  opportunityType?: string;
  /** ⚠️ No Figma source yet. Concise, evidence-grounded reason the opportunity matched (`product-specs/match-card.md` §4.1), e.g. "Matches your 5 years of FP&A experience." Omit to hide. */
  fitExplanation?: string;
  /** ⚠️ No Figma source yet. Application-readiness state per `product-specs/match-card.md` §5 — drives whether `missingRequirementSummary` and the CTA read as actionable now or blocked. */
  readinessState?: "potentialFit" | "matchedBlocked" | "readyToApply";
  /** ⚠️ No Figma source yet. Names the specific outstanding requirement when `readinessState` is `"matchedBlocked"` (`product-specs/match-card.md` §5.1). Omit otherwise. */
  missingRequirementSummary?: string;
  /** ⚠️ No Figma source yet. Whether the professional has bookmarked this match (`product-specs/match-card.md` §6.1). Renders a toggle icon when `onSaveToggle` is provided. */
  isSaved?: boolean;
  /** ⚠️ No Figma source yet. Called when the saved-state toggle is activated. Omit to hide the toggle entirely. */
  onSaveToggle?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Accessible label for the saved-state toggle. Required whenever `onSaveToggle` is set. */
  savedToggleLabel?: string;
  /** ⚠️ No Figma source yet. Label for the single recommended-action CTA (`product-specs/match-card.md` §6), e.g. "Apply", "Complete requirement to apply". Omit to hide the CTA. */
  ctaLabel?: string;
  /** ⚠️ No Figma source yet. Called when the recommended-action CTA is activated. */
  onCtaPress?: () => void;
  /** Accessible label for the hover-revealed actions-menu (`···`) trigger. Required whenever `onActionsPress` is set. */
  actionsMenuLabel?: string;
  /** Called when the actions-menu trigger is activated. Opens the consumer-owned menu — this component does not render the menu itself. Omit to hide the trigger entirely. */
  onActionsPress?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Forwarded to the row's own click target (e.g. `onClick`, which routes to the match detail). Passing `onClick` makes the whole row a `role="button"` (pointer cursor, focusable, Enter/Space) via `clickableRowProps`; clicks on nested controls don't trigger it. */
  rowProps?: Omit<React.HTMLAttributes<HTMLDivElement>, "className">;
  className?: string;
}

/** A Match card — identity, engagement terms, fit tier, and a recommended action for one match. Figma: `match-card`. */
function MatchCard({
  company = "partner",
  logoSrc,
  logoAlt,
  title,
  compensation,
  engagementTerms,
  duration,
  partnerName,
  discipline,
  matchTier,
  opportunityType,
  fitExplanation,
  readinessState,
  missingRequirementSummary,
  isSaved = false,
  onSaveToggle,
  savedToggleLabel,
  ctaLabel,
  onCtaPress,
  actionsMenuLabel,
  onActionsPress,
  rowProps,
  className,
  ...props
}: MatchCardProps) {
  // Same terms treatment as `ApplicationCard`: compensation semibold, engagement terms and duration regular.
  const termsParts = [
    { value: compensation, className: "font-semibold" },
    { value: engagementTerms },
    { value: duration },
  ].filter((part) => Boolean(part.value));
  const showMissingRequirement =
    readinessState === "matchedBlocked" && missingRequirementSummary;

  return (
    <div
      data-slot="match-card"
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
          {opportunityType && (
            <Typography size="sm" className="w-full text-foreground-muted">
              {opportunityType}
            </Typography>
          )}
          {fitExplanation && (
            <Typography size="sm" className="w-full text-foreground-muted">
              {fitExplanation}
            </Typography>
          )}
          {showMissingRequirement && (
            <Typography size="sm" className="w-full text-foreground-muted">
              {missingRequirementSummary}
            </Typography>
          )}
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
        {matchTier && (
          <Typography
            size="sm"
            className="min-w-0 flex-1 text-right text-foreground-muted"
          >
            {matchTier}
          </Typography>
        )}
        {onSaveToggle && (
          <Button
            color="tertiary"
            size="xs"
            iconLeading={isSaved ? BookmarkCheck : Bookmark}
            aria-label={savedToggleLabel}
            aria-pressed={isSaved}
            onClick={(event) => onSaveToggle(event as React.MouseEvent<HTMLButtonElement>)}
          />
        )}
        {ctaLabel && onCtaPress && (
          <Button size="sm" onPress={onCtaPress}>
            {ctaLabel}
          </Button>
        )}
      </div>
      {onActionsPress && (
        // Reveal on a wrapper, not the Button, so the Button keeps its own look + hover transition.
        <div className="flex shrink-0 opacity-0 transition-opacity duration-150 ease-out group-focus-visible:opacity-100 group-has-[[data-focus-visible]]:opacity-100 group-hover:opacity-100">
          <Button
            color="tertiary"
            size="xs"
            iconLeading={DotsHorizontal}
            aria-label={actionsMenuLabel}
            onClick={(event) => onActionsPress(event as React.MouseEvent<HTMLButtonElement>)}
          />
        </div>
      )}
    </div>
  );
}

export { MatchCard, type MatchCardProps };

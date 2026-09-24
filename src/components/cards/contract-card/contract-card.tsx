import * as React from "react";
import { AlertCircle, Building03, Calendar } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { clickableRowProps } from "@/lib/clickable-row";
import {
  AvatarCompanies,
  type AvatarCompaniesProps,
} from "@/components/data-display/avatar-companies";
import { Badge, type BadgeProps } from "@/components/data-display/badge";
import { Button, type ButtonProps } from "@/components/buttons/button";
import { Typography } from "@/components/typography";

/**
 * Work-insights progress data (Figma's `work-insights` group: bar, hours
 * used, percentage used). Optional as a whole group per
 * `product-specs/contract-card.md` §3.1.2 — when omitted, the entire region
 * (bar + metric text) collapses rather than rendering empty/zeroed.
 */
interface ContractCardProgress {
  /** e.g. "12 of 30 hours used" — labeled precisely per the PRD, never a bare number. */
  metricLabel: string;
  /** e.g. "40%" — shown alongside the metric, never standing in for it. Optional independent of the bar/`metricLabel` (Figma's own `show` toggle on just this text) — omit to show the bar + metric label without a percentage figure. */
  percentageLabel?: string;
  /** 0–100. Values above 100 should already be capped by the caller (PRD §5.3: cap the visual fill, keep real numbers in text). */
  percentage: number;
}

/**
 * A single active/upcoming work agreement preview. Figma: `contract-card`.
 * Composes the existing `Badge` (contract status), `Button` (primary
 * action), and `Typography` (title) rather than reproducing their look
 * inline — matching `NextStepCard`'s composition pattern.
 *
 * Per `product-specs/contract-card.md` §3.1.2, the status badge,
 * `work-insights` group, and primary action are each independently
 * optional — the card must not render a redundant badge, an empty/zeroed
 * progress region, or a CTA when no action is available (§2, §3.1.2, §6.2).
 * This component only covers presentation; which fields to pass for a given
 * contract's status/action state is the consumer's responsibility, per the
 * PRD's scope boundary (§1).
 *
 * The avatar composes `AvatarCompanies` — Figma's `avatar-companies`
 * instance — rather than reproducing its tile markup inline, matching
 * `ApplicationCard`/`MatchCard`/`OfferCard`. `company` defaults to
 * `"partner"` (letterboxed `logoSrc` on a white tile, neutral fallback when
 * omitted); pass `company="verita"` for the bundled Verita mark, which is
 * what Figma's `contract-card` instances show. It always renders, so the
 * header keeps Figma's fixed 48px row.
 *
 * The Terms block's two rows are each a fixed leading icon + text (Figma:
 * `building-03` + `partner-name`, `calendar` + `engagement-terms`), per PRD
 * §3.1.2 — replacing this component's previous single concatenated
 * `workArrangement · partnerName` line, which paired the wrong two fields
 * onto one row (Figma pairs `partner-name` with the building icon on its
 * own row, and `engagementTerms`/`duration` together on the calendar row).
 * `Property 1=Hover` in Figma is a `:hover` pseudostate preview (fill
 * `card/card` → `state/hover-row`, i.e. `bg-hover-row`), so it's expressed as a
 * `hover:` utility rather than a `cva` variant — same token and approach as
 * `ApplicationCard`'s Default/Hover set.
 *
 * `duration` is its own optional field (PRD §3.1.2, `applications-card.md`
 * §2.3.2's identical rule) that composes onto the `engagementTerms` row with
 * a leading `·` only when present — never a dangling separator.
 */
interface ContractCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Avatar tile treatment, forwarded to `AvatarCompanies` (Figma's `avatar-companies` `Property 1`). `"verita"` renders the bundled Verita mark and ignores `logoSrc`; any other value renders the partner tile. Defaults to `"partner"`. */
  company?: AvatarCompaniesProps["company"];
  /** Partner/company logo, forwarded to `AvatarCompanies`. Optional, with a neutral fallback tile. Ignored when `company="verita"`. */
  logoSrc?: string;
  /** Alt text for `logoSrc`. Required semantically whenever `logoSrc` is set. */
  logoAlt?: string;
  /**
   * Contract status label (Figma's `badge` instance). Omit entirely when the
   * surrounding module already communicates the status (PRD §3.1.2's
   * status-badge visibility rule) — e.g. hide it for `Active` contracts
   * inside an "Active work" surface, but show it on Home or any
   * mixed-status view.
   */
  statusLabel?: string;
  /** Tone for the status badge. Defaults to `"neutral"`, matching Figma's sampled instance. */
  statusTone?: BadgeProps["tone"];
  /** Engagement/role title (Figma's `Title`). Wraps to at most 2 lines, then truncates with an ellipsis (the full text stays in the DOM for screen readers). */
  title: string;
  /** Agreed compensation display string, already formatted per its unit (PRD §3.3.1), e.g. "$85/hour". */
  compensation: string;
  /** Partner name or approved fallback (Figma's `partner-name`). Paired with a fixed leading `building-03` icon per PRD §3.1.2. */
  partnerName: string;
  /** Time-commitment term, e.g. "Up to 30 hrs/week" (Figma's `engagement-terms`). Paired with a fixed leading `calendar` icon per PRD §3.1.2. */
  engagementTerms: string;
  /** Agreed engagement length, e.g. "3 months" (Figma's `duration`, gated by its own `showDuration` toggle). Optional and independent of `engagementTerms` (PRD §3.1.2) — composes onto the same row with a leading `·` only when present. */
  duration?: string;
  /** Progress metric + bar. Omit the whole group when no verified progress data exists (PRD §3.1.2). */
  progress?: ContractCardProgress;
  /**
   * Deadline/instructions line, e.g. "Submit availability before Sep 21,
   * 8:00 AM EDT" (Figma's `Instructions` group, `alert-circle` icon).
   * Omitted entirely when there's no outstanding deadline to surface —
   * matches Figma's `showInstructions` toggle.
   */
  instructions?: string;
  /**
   * Whether `instructions` is within the PRD's 24-hour "Approaching
   * deadline" warning window (§6.4) — renders in the destructive/urgent
   * color only when `true`; otherwise uses the card's default foreground
   * color. Figma's `Instructions` element only shows one static destructive
   * variant with no urgent/normal toggle of its own, but the PRD is explicit
   * that the emphasized color must be reserved for the 24-hour window, so
   * this prop exists to let the consumer (which knows the actual deadline
   * timestamp) express that distinction. Defaults to `false`. Irrelevant
   * when `instructions` is omitted. The `alert-circle` icon's non-urgent
   * color (`text-icon-muted`) is an inferred pairing with the text color,
   * not a Figma-confirmed binding — the icon node carries no bound variable
   * in either Figma state, so this follows the same icon-matches-text-tone
   * pattern used elsewhere in the library rather than a sampled value.
   */
  instructionsUrgent?: boolean;
  /** Primary action label (Figma's `button` instance, e.g. "Open work"). Omit when no action is available (PRD §6.2's "No action" state). */
  primaryActionLabel?: string;
  /** Forwarded to the primary action button (e.g. `onPress`). */
  primaryActionProps?: Omit<ButtonProps, "size" | "color" | "children">;
  /** Forwarded to the card's own click target (e.g. `onClick`, which opens the contract detail). Passing `onClick` makes the whole card a `role="button"` (pointer cursor, focusable, Enter/Space) via `clickableRowProps` — same model as `ApplicationCard`/`MatchCard`/`OfferCard`; clicks on the primary action button don't trigger it. */
  rowProps?: Omit<React.HTMLAttributes<HTMLDivElement>, "className">;
  className?: string;
}

/** A Contract card — identity, terms, progress, and a primary action for one active/upcoming work agreement. Figma: `contract-card`. */
function ContractCard({
  company = "partner",
  logoSrc,
  logoAlt,
  statusLabel,
  statusTone = "neutral",
  title,
  compensation,
  partnerName,
  engagementTerms,
  duration,
  progress,
  instructions,
  instructionsUrgent = false,
  primaryActionLabel,
  primaryActionProps,
  rowProps,
  className,
  ...props
}: ContractCardProps) {
  return (
    <div
      data-slot="contract-card"
      className={cn(
        "flex w-[374px] flex-col items-start gap-3 rounded-card border border-border bg-card p-6 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)] transition-colors duration-150 ease-out",
        // Figma `Property 1=Hover`: fill → `state/hover-row` (`bg-hover-row`, the shared card/table row hover — DESIGN.md "Row hover"); border and `card-2` shadow unchanged.
        "hover:bg-hover-row",
        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...clickableRowProps(rowProps)}
      {...props}
    >
      {/* Figma `Container`: fixed 48px row (the avatar's height), badge pinned top-right. */}
      <div className="flex h-12 w-full items-start justify-between">
        <AvatarCompanies company={company} logoSrc={logoSrc} logoAlt={logoAlt} />
        {statusLabel && <Badge tone={statusTone} label={statusLabel} size="sm" />}
      </div>
      {/* Figma `Content`: min 150px tall so single-line titles keep the card's rhythm; grows for multiline titles. */}
      <div className="flex min-h-[150px] w-full flex-col items-start gap-3">
        <div className="flex w-full flex-col items-start gap-1.5">
          {/* Figma binds `line-height/xl` (28px) here, not Typography xl's 30px default. */}
          <Typography
            as="h3"
            size="xl"
            weight="semibold"
            className="line-clamp-2 leading-7 text-foreground"
          >
            {title}
          </Typography>
          <Typography size="xl" className="leading-7 text-foreground">
            {compensation}
          </Typography>
        </div>
        <div className="flex w-full flex-col items-start gap-0.5">
          <div className="flex w-full items-center gap-1.5">
            <Building03 className="size-3.5 shrink-0 text-icon-muted" />
            <Typography size="sm" className="text-foreground">
              {partnerName}
            </Typography>
          </div>
          <div className="flex w-full items-center gap-1.5">
            <Calendar className="size-3.5 shrink-0 text-icon-muted" />
            <Typography size="sm" className="text-foreground">
              {engagementTerms}
            </Typography>
            {/* Figma lays `·` and `duration` out as sibling text nodes spaced by the row's 6px gap, not inline spaces. */}
            {duration && (
              <>
                <Typography size="sm" aria-hidden className="text-foreground">
                  ·
                </Typography>
                <Typography size="sm" className="text-foreground">
                  {duration}
                </Typography>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Figma `Bottom`: instructions, work-insights, and the action share one bottom-aligned 80px-min group with a 10px gap. */}
      {(instructions || progress || primaryActionLabel) && (
        <div className="flex min-h-20 w-full flex-col items-start justify-end gap-2.5">
          {instructions && (
            <div className="flex w-full items-center gap-1.5">
              <AlertCircle
                className={cn(
                  "size-3.5 shrink-0",
                  instructionsUrgent ? "text-tone-destructive" : "text-icon-muted",
                )}
              />
              <Typography
                size="xs"
                className={instructionsUrgent ? "text-tone-destructive" : "text-foreground"}
              >
                {instructions}
              </Typography>
            </div>
          )}
          {progress && (
            <div
              data-slot="contract-card-work-insights"
              className="flex w-full flex-1 flex-col items-start gap-1.5"
            >
              <div className="h-1.5 w-full overflow-hidden rounded-lg bg-[#eeeff2]">
                <div
                  className="h-full rounded-2xl bg-tone-brand"
                  style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                />
              </div>
              <div className="flex w-full items-center justify-between">
                <Typography size="xs" className="text-foreground">
                  {progress.metricLabel}
                </Typography>
                {progress.percentageLabel && (
                  <Typography size="xs" className="text-foreground-muted">
                    {progress.percentageLabel}
                  </Typography>
                )}
              </div>
            </div>
          )}
          {primaryActionLabel && (
            <Button
              size="sm"
              {...primaryActionProps}
            >
              {primaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export { ContractCard, type ContractCardProps, type ContractCardProgress };

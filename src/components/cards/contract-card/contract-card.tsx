import * as React from "react";
import { AlertCircle, Building03, Calendar } from "@untitledui/icons";

import { cn } from "@/lib/utils";
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
 * The logo renders as a bare 48px square image with no background tile
 * (Figma's `avatar-companies` instance) — a 2026-09-21 Figma revision from
 * the prior rounded-xl pink-tile treatment this component used to render;
 * there's no fallback glyph shown in Figma for a missing logo, so the slot
 * simply renders nothing when `logoSrc` is omitted (matching Figma's
 * `showStatus`-style optional-render pattern elsewhere in this set) rather
 * than inventing a placeholder Figma doesn't show.
 *
 * The Terms block's two rows are each a fixed leading icon + text (Figma:
 * `building-03` + `partner-name`, `calendar` + `engagement-terms`), per PRD
 * §3.1.2 — replacing this component's previous single concatenated
 * `workArrangement · partnerName` line, which paired the wrong two fields
 * onto one row (Figma pairs `partner-name` with the building icon on its
 * own row, and `engagementTerms`/`duration` together on the calendar row).
 * `duration` is its own optional field (PRD §3.1.2, `applications-card.md`
 * §2.3.2's identical rule) that composes onto the `engagementTerms` row with
 * a leading `·` only when present — never a dangling separator.
 */
interface ContractCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Partner/company logo (Figma's `avatar-companies` instance). Renders nothing when omitted — Figma shows no fallback glyph for this slot. */
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
  /** Engagement/role title (Figma's `Title`). Supports multiline per the PRD. */
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
  className?: string;
}

/** A Contract card — identity, terms, progress, and a primary action for one active/upcoming work agreement. Figma: `contract-card`. */
function ContractCard({
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
  className,
  ...props
}: ContractCardProps) {
  return (
    <div
      data-slot="contract-card"
      className={cn(
        "flex w-[376px] flex-col items-start gap-4 rounded-card border border-border bg-card p-6 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]",
        className,
      )}
      {...props}
    >
      <div className="flex w-full items-start justify-between">
        {logoSrc && <img src={logoSrc} alt={logoAlt ?? ""} className="size-12 shrink-0 object-contain" />}
        {statusLabel && <Badge tone={statusTone} label={statusLabel} size="sm" />}
      </div>
      <div className="flex w-full flex-col items-start gap-3">
        <div className="flex w-full flex-col items-start gap-1.5">
          <Typography
            as="h3"
            size="xl"
            weight="semibold"
            className="text-foreground"
          >
            {title}
          </Typography>
          <Typography size="xl" className="text-foreground">
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
              {duration && <> · {duration}</>}
            </Typography>
          </div>
        </div>
      </div>
      {(instructions || progress) && (
        <div className="flex w-full flex-col items-start gap-2.5">
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
              className="flex w-full flex-col items-start gap-1.5"
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
        </div>
      )}
      {primaryActionLabel && (
        <Button
          size="sm"
          {...primaryActionProps}
          className={cn(
            "bg-tone-brand text-white hover:bg-[color-mix(in_srgb,var(--tone-brand)_90%,black)]",
            primaryActionProps?.className,
          )}
        >
          {primaryActionLabel}
        </Button>
      )}
    </div>
  );
}

export { ContractCard, type ContractCardProps, type ContractCardProgress };

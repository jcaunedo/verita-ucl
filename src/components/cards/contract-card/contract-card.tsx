import * as React from "react";

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
  /** e.g. "40%" — shown alongside the metric, never standing in for it. */
  percentageLabel: string;
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
 */
interface ContractCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Partner/profile logo. Optional, with a neutral fallback tile — Figma's `Profile Image Container`. */
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
  /** Work arrangement label, e.g. "Project-based" (Figma's `work-arrangement`). */
  workArrangement: string;
  /** Partner name or approved fallback (Figma's `partner-name`). */
  partnerName: string;
  /** Progress metric + bar. Omit the whole group when no verified progress data exists (PRD §3.1.2). */
  progress?: ContractCardProgress;
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
  workArrangement,
  partnerName,
  progress,
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
      <div className="flex w-full flex-col items-start gap-3">
        <div className="flex w-full items-start justify-between">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f9f1f2]">
            {logoSrc && (
              <img
                src={logoSrc}
                alt={logoAlt ?? ""}
                className="size-8 object-contain"
              />
            )}
          </div>
          {statusLabel && (
            <Badge tone={statusTone} label={statusLabel} size="sm" />
          )}
        </div>
        <div className="flex w-full flex-col items-start gap-0.5">
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
        <div className="flex min-h-[66px] w-full flex-col items-start gap-1.5">
          <Typography size="base" className="text-foreground">
            {workArrangement} · {partnerName}
          </Typography>
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
                <Typography size="sm" className="text-foreground">
                  {progress.metricLabel}
                </Typography>
                <Typography size="sm" className="text-foreground-muted">
                  {progress.percentageLabel}
                </Typography>
              </div>
            </div>
          )}
        </div>
      </div>
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

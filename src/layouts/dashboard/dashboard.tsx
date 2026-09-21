import * as React from "react";
import { AnimatePresence } from "motion/react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Sidebar, type SidebarProps } from "@/components/navigation/sidebar";
import { Typography } from "@/components/typography";
import { Hyperlink } from "@/components/buttons/hyperlink";
import { NextStepCard } from "@/components/cards/next-step-card";
import { OfferCard } from "@/components/cards/offer-card";
import { ContractCard } from "@/components/cards/contract-card";
import { ApplicationCard } from "@/components/cards/application-card";
import { MatchCard } from "@/components/cards/match-card";
import { CalloutCard } from "@/components/cards/callout-card";

/**
 * `dismissible: true` only for `Recommended` tasks — per
 * `product-specs/next-steps-card.md` §2.1/§2.3, `Required now`/`Required
 * later` cards cannot be dismissed while applicable.
 */
const NEXT_STEPS = [
  {
    key: "upload-document",
    badgeTone: "destructive",
    label: "Required now",
    title: "Upload document",
    description: "Restorative Sleep Institute requested an updated document for your contract.",
    buttonLabel: "Upload document",
    dismissible: false,
  },
  {
    key: "submit-availability",
    badgeTone: "warning",
    label: "Required later",
    title: "Submit availability",
    description: "Contracts need your planned hours by Monday to schedule your work.",
    buttonLabel: "Submit availability",
    dismissible: false,
  },
  {
    key: "complete-training",
    badgeTone: "warning",
    label: "Required later",
    title: "Complete training",
    description: "Required before your contract starts on Oct 1, no rush yet.",
    buttonLabel: "Start training",
    dismissible: false,
  },
  {
    key: "linkedin",
    badgeTone: "info",
    label: "Recommended",
    title: "LinkedIn Profile",
    description: "Strengthen your profile and improve match quality.",
    buttonLabel: "Connect LinkedIn",
    dismissible: true,
  },
] as const;

type NextStepKey = (typeof NEXT_STEPS)[number]["key"];

/** Active/upcoming work agreements (Figma's "Active work" section, `contract-card` instances). */
const ACTIVE_WORK = [
  {
    key: "backend-integration",
    title: "Backend Integration Engineer",
    compensation: "$85/hour",
    partnerName: "Verita partner",
    engagementTerms: "Up to 40 hrs/week",
    duration: "3 months",
    progress: { metricLabel: "10 of 40 hours used this week", percentageLabel: "25%", percentage: 25 },
    primaryActionLabel: "Open work",
  },
  {
    key: "compensation-benchmarking",
    title: "Compensation Benchmarking Report",
    compensation: "$4,500/project",
    partnerName: "Amazon Health",
    engagementTerms: "6 weeks",
    primaryActionLabel: "Resume work",
  },
  {
    key: "clinical-expert-survey",
    title: "Clinical Expert, In-Home Health Evaluation Survey",
    compensation: "$2,000/task",
    partnerName: "Amazon Health",
    engagementTerms: "Up to 40 hrs/week",
    duration: "3 months",
    progress: { metricLabel: "4 of 5 deliverables submitted", percentageLabel: "80%", percentage: 80 },
    primaryActionLabel: "Resume work",
  },
] as const;

/** Active applications (Figma's "Active Applications" section, stacked `application-card` rows). */
const ACTIVE_APPLICATIONS = [
  {
    key: "senior-financial-analyst",
    title: "Senior Financial Analyst",
    partnerName: "Verita partner",
    compensation: "$95–115k/yr",
    engagementTerms: "32 hrs/week",
    duration: "1 year",
    statusLabel: "Not submitted",
    statusTone: "neutral",
    supportingText: "2 of 4 steps completed",
  },
  {
    key: "clinical-data-coordinator",
    title: "Clinical Data Coordinator",
    partnerName: "Verita partner",
    compensation: "$48/hr",
    engagementTerms: "20 hrs/week",
    duration: "1 month",
    statusLabel: "In review · Action required",
    statusTone: "warning",
    supportingText: "Complete your assessment (2 of 4 steps completed)",
  },
  {
    key: "movement-physical-activity-expert",
    title: "Movement & Physical Activity Expert Annotator",
    partnerName: "Verita partner",
    compensation: "$50/hr",
    engagementTerms: "40 hours per week",
    duration: "8 weeks",
    statusLabel: "In review",
    statusTone: "success",
  },
  {
    key: "search-quality-analyst",
    title: "Search Quality Analyst",
    partnerName: "Google",
    compensation: "$60/hr",
    engagementTerms: "Up to 25 hrs/week",
    duration: "3 months",
    statusLabel: "Applied",
    statusTone: "info",
  },
] as const;

/** Most recent matches (Figma's "Matches" section, stacked `match-card` rows). */
const RECENT_MATCHES = [
  {
    key: "clinical-expert-sleep",
    title: "Clinical Expert, In-Home Health Evaluation Survey",
    partnerName: "Verita partner",
    compensation: "56/hr",
    engagementTerms: "35 hours per week",
    duration: "5 months",
    matchTier: "Strong match",
  },
  {
    key: "strategic-finance-expert",
    title: "Strategic Finance Expert",
    partnerName: "Apple",
    compensation: "$85/hr",
    engagementTerms: "15 hrs/week",
    matchTier: "Good match",
  },
  {
    key: "retail-operations-contractor",
    title: "Retail Operations Contractor",
    partnerName: "Verita partner",
    compensation: "$42/hr",
    engagementTerms: "Up to 30 hrs/week",
    duration: "5 months",
    matchTier: "Relevant match",
  },
] as const;

const CALLOUTS = [
  {
    key: "qualify",
    title: "Qualify for more work",
    description: "Complete assessments to validate your skills and qualify for more opportunities.",
    href: "#",
  },
  {
    key: "refer",
    title: "Refer and earn",
    description: "Refer talented professionals and earn rewards when they join the network.",
    href: "#",
  },
] as const;

interface DashboardProps {
  /**
   * Passed through to the internal `Sidebar`'s `navHrefOverrides` — this
   * repo has no router, so there's nothing to wire by default. Exists so a
   * Storybook story can turn this layout into a clickable prototype without
   * forking the component to hardcode a demo-only link.
   */
  navHrefOverrides?: SidebarProps["navHrefOverrides"];
}

/**
 * Full-page reference layout — the provider portal's home dashboard fully
 * populated with real work-in-progress content (an offer alert, next steps,
 * active work, active applications, recent matches, and callout cards).
 * Figma: Verita → `Dashboard` (`node-id=5642-2263`). A separate layout from
 * `dashboard-empty-state` (which covers the same page with no active work
 * yet) per that layout's own JSDoc — this is the "fully-populated dashboard"
 * variant it anticipated.
 *
 * Reuses `dashboard-empty-state`'s sidebar-collapse/responsive-breakpoint
 * shell verbatim (same `Sidebar` auto-collapse-below-`lg` behavior, same
 * Next Steps grid column-capping/queueing pattern) — only the section
 * content below the header differs: `SectionEmptyState` is replaced with the
 * offer alert, active-work grid, active-applications list, and
 * recent-matches list Figma shows once the professional has real activity.
 *
 * The "Active Applications"/"Matches" sections are plain bordered containers
 * of stacked `ApplicationCard`/`MatchCard` rows (`divide-y`-style borders
 * already built into each card) — Figma's `table-application-listing`/
 * `table-match-listing` instances are not real data-table components, just
 * this same stacking pattern already used by `ApplicationCard`'s own
 * `AllVariants` story.
 */
function Dashboard({ navHrefOverrides }: DashboardProps = {}) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  /**
   * Below `lg` (1024px) the sidebar auto-collapses — including on initial
   * load at a narrow width, not only when resizing into that range. Crossing
   * back above `lg` restores whatever state the sidebar was in *before* the
   * auto-collapse, but only if the current collapse was the automatic one:
   * if the user manually collapsed it themselves while already below `lg`,
   * that's their own choice and must stick even after crossing back above
   * `lg` — `wasAutoCollapsedRef` distinguishes the two so the restore only
   * ever undoes this effect's own action, never a manual one. `Sidebar`'s
   * own toggle (via `onCollapsedChange` below) clears the flag the moment
   * the user interacts with it, so any manual toggle — collapse or expand —
   * immediately "promotes" the current state to user-owned.
   */
  const isLgUp = useMediaQuery("(min-width: 1024px)");
  const wasAutoCollapsedRef = React.useRef(false);
  const preCollapseStateRef = React.useRef(false);
  React.useEffect(() => {
    if (!isLgUp) {
      setSidebarCollapsed((current) => {
        if (!current) {
          preCollapseStateRef.current = current;
          wasAutoCollapsedRef.current = true;
        }
        return true;
      });
    } else if (wasAutoCollapsedRef.current) {
      setSidebarCollapsed(preCollapseStateRef.current);
      wasAutoCollapsedRef.current = false;
    }
  }, [isLgUp]);
  /**
   * Per `product-specs/next-steps-card.md` §2.1, dismissal is immediate with
   * no confirmation step — clicking the X removes the card right away. This
   * reference layout has no backend, so "dismissed" is just local UI state;
   * a real consumer would also persist the dismissal so the task doesn't
   * re-surface on reload (the PRD's only re-surface trigger is the task's
   * requirement level changing, never a page refresh).
   */
  const [dismissedKeys, setDismissedKeys] = React.useState<Set<NextStepKey>>(new Set());
  const eligibleNextSteps = NEXT_STEPS.filter((step) => !dismissedKeys.has(step.key));
  /**
   * The Next Steps grid caps its column count in two tiers — below `xl`
   * (1280px) it's 2-up, from `xl` to below `2xl` (1536px) it's 3-up, and at
   * `2xl`+ it's the full 4-up. Rather than wrapping the overflow to a second
   * row, any card beyond the current tier's column count is queued and only
   * mounted once a dismiss/completion frees a slot within the visible tier.
   */
  const isXlUp = useMediaQuery("(min-width: 1280px)");
  const is2xlUp = useMediaQuery("(min-width: 1536px)");
  const maxVisible = is2xlUp ? Infinity : isXlUp ? 3 : 2;
  const visibleNextSteps = eligibleNextSteps.slice(0, maxVisible);
  /**
   * Tracks each card's `key` the first time it appears in `visibleNextSteps`
   * — a key already seen mounts as a plain fade-in (or is on true first
   * render, skipped below); a key seen for the first time on a *later*
   * render (i.e. a queued card newly revealed by a slot opening up) mounts
   * with `enterFromRight` instead, so only the actual newly-surfaced card
   * gets the directional entrance, not the whole grid on initial load.
   */
  const seenKeysRef = React.useRef<Set<NextStepKey> | null>(null);
  if (seenKeysRef.current === null) {
    seenKeysRef.current = new Set(visibleNextSteps.map((step) => step.key));
  }
  const newlyRevealedKeys = new Set(
    visibleNextSteps
      .filter((step) => !seenKeysRef.current!.has(step.key))
      .map((step) => step.key),
  );
  React.useEffect(() => {
    for (const step of visibleNextSteps) {
      seenKeysRef.current!.add(step.key);
    }
  });
  /**
   * Separate from `visibleNextSteps.length === 0` so the "Next steps"
   * section (heading + grid) stays mounted long enough for the last card's
   * exit animation to finish — `AnimatePresence`'s `onExitComplete` flips
   * this only once every exiting card has actually left, rather than the
   * section vanishing mid-animation the instant the last card is filtered
   * out of `visibleNextSteps`.
   */
  const [nextStepsSectionVisible, setNextStepsSectionVisible] = React.useState(true);

  const handleSidebarCollapsedChange = (collapsed: boolean) => {
    // A manual toggle always promotes the current state to user-owned —
    // even a manual re-collapse while already below `lg` should stick
    // through a later crossing back above `lg`, per `wasAutoCollapsedRef`'s
    // own comment above.
    wasAutoCollapsedRef.current = false;
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex min-h-screen w-full items-start bg-white">
      <div className="sticky top-0 shrink-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={handleSidebarCollapsedChange}
          navHrefOverrides={navHrefOverrides}
        />
      </div>
      <div
        className={cn(
          "flex min-w-px flex-1 flex-col items-center px-12 xl:pr-30",
          sidebarCollapsed ? "xl:pl-30" : "xl:pl-12",
        )}
      >
        <div className="flex w-full max-w-[1400px] flex-1 flex-col items-start gap-8 pt-10 pb-[104px]">
          <div className="flex w-full items-center justify-between">
            <div className="flex min-w-px flex-1 flex-col items-start gap-1.5">
              <Typography size="3xl" weight="semibold">
                Welcome back, Theresa
              </Typography>
              <Typography size="lg">Let’s make today count.</Typography>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-12">
            <div className="flex w-full flex-col items-start gap-4">
              <Typography size="xl" weight="semibold">
                You have a new offer
              </Typography>
              <OfferCard
                title="Sleep Specialist, Behavioral Sleep Medicine Professional"
                partnerName="Verita partner"
                compensation="$75 - $95 / hour"
                engagementTerms="Up to 30 hr per week"
                duration="Ongoing"
                expirationDate="Expires on Sep 10"
                onCtaPress={() => {}}
                dismissLabel="Dismiss offer"
                onDismiss={() => {}}
                className="w-full rounded-card border border-border shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]"
              />
            </div>

            {nextStepsSectionVisible && (
              <div className="flex w-full flex-col items-start gap-4">
                <div className="flex w-full flex-col items-start gap-0.5">
                  <Typography size="xl" weight="semibold">
                    Next steps
                  </Typography>
                  <Typography size="sm" className="text-foreground-muted">
                    Complete these to unlock more opportunities and improve your matches.
                  </Typography>
                </div>
                <div className="grid h-[248px] w-full grid-cols-2 gap-5 xl:grid-cols-3 2xl:grid-cols-4">
                  <AnimatePresence
                    onExitComplete={() => {
                      if (eligibleNextSteps.length === 0) {
                        setNextStepsSectionVisible(false);
                      }
                    }}
                  >
                    {visibleNextSteps.map(({ key, ...step }) => (
                      <NextStepCard
                        key={key}
                        {...step}
                        enterFromRight={newlyRevealedKeys.has(key)}
                        onDismiss={
                          step.dismissible
                            ? () => setDismissedKeys((prev) => new Set(prev).add(key))
                            : undefined
                        }
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            <div className="flex w-full flex-col items-start gap-4">
              <Typography size="xl" weight="semibold">
                Active work
              </Typography>
              <div className="grid w-full grid-cols-3 items-start gap-x-5 gap-y-4">
                {ACTIVE_WORK.map(({ key, ...contract }) => (
                  <ContractCard key={key} {...contract} primaryActionProps={{ onPress: () => {} }} />
                ))}
              </div>
            </div>

            <div className="flex w-full flex-col items-start gap-4">
              <Typography size="xl" weight="semibold">
                Active Applications
              </Typography>
              <div className="flex w-full flex-col items-start overflow-hidden rounded-card border border-border shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]">
                {ACTIVE_APPLICATIONS.map(({ key, ...application }) => (
                  <ApplicationCard key={key} {...application} className="border-b border-border last:border-b-0" />
                ))}
              </div>
              <div className="flex items-start gap-5">
                <Hyperlink href="#" showArrow>
                  View All
                </Hyperlink>
                <Hyperlink href="#" showArrow>
                  Discover more opportunities
                </Hyperlink>
              </div>
            </div>

            <div className="flex w-full flex-col items-start gap-4">
              <Typography size="xl" weight="semibold">
                Most recent matches
              </Typography>
              <div className="flex w-full flex-col items-start overflow-hidden rounded-card border border-border shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]">
                {RECENT_MATCHES.map(({ key, ...match }) => (
                  <MatchCard key={key} {...match} className="border-b border-border last:border-b-0" />
                ))}
              </div>
              <Hyperlink href="#" showArrow>
                View more matches
              </Hyperlink>
            </div>

            <div className="flex w-full items-start gap-5">
              {CALLOUTS.map(({ key, ...callout }) => (
                <CalloutCard key={key} {...callout} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Dashboard };

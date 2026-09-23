import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlignLeft, Share06, XCircle } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { partnerLogos } from "@/assets/logos";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { cardDismissVariants, reflowTransition, useMotionPreference } from "@/lib/motion";
import { Sidebar, type SidebarProps } from "@/components/navigation/sidebar";
import { Typography } from "@/components/typography";
import { Hyperlink } from "@/components/buttons/hyperlink";
import { NextStepsSection } from "@/layouts/shared/next-steps-section";
import { OfferCard } from "@/components/cards/offer-card";
import { ContractCard } from "@/components/cards/contract-card";
import { ApplicationCard } from "@/components/cards/application-card";
import { MatchCard } from "@/components/cards/match-card";
import { CalloutCard } from "@/components/cards/callout-card";
import { MenuItem, MenuSeparator } from "@/components/overlays/menu";

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
    // Opens LinkedIn sign-in in a new tab — the CTA and the whole card (which clicks the CTA) both follow this link.
    buttonProps: { href: "https://www.linkedin.com/uas/login", target: "_blank", rel: "noopener noreferrer" },
    dismissible: true,
  },
] as const;

/** Active/upcoming work agreements (Figma's "Active work" section, `contract-card` instances). */
const ACTIVE_WORK = [
  {
    key: "backend-integration",
    company: "verita",
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
    company: "verita",
    title: "Compensation Benchmarking Report",
    compensation: "$4,500/project",
    partnerName: "Amazon Health",
    engagementTerms: "6 weeks",
    primaryActionLabel: "Resume work",
  },
  {
    key: "clinical-expert-survey",
    company: "amazon",
    logoSrc: partnerLogos.amazon,
    logoAlt: "Amazon",
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
    company: "verita",
    partnerName: "Verita partner",
    compensation: "$95–115k/yr",
    engagementTerms: "32 hrs/week",
    duration: "1 year",
    statusLabel: "Action required",
    statusTone: "warning",
    supportingText: "Complete your assessment (2 of 4 steps completed)",
  },
  {
    key: "clinical-data-coordinator",
    title: "Clinical Data Coordinator",
    company: "verita",
    partnerName: "Verita partner",
    compensation: "$48/hr",
    engagementTerms: "20 hrs/week",
    duration: "1 month",
    statusLabel: "Action required",
    statusTone: "warning",
    supportingText: "Verify your work authorization",
  },
  {
    key: "movement-physical-activity-expert",
    title: "Movement & Physical Activity Expert Annotator",
    company: "verita",
    partnerName: "Verita partner",
    compensation: "$50/hr",
    engagementTerms: "40 hours per week",
    duration: "8 weeks",
    statusLabel: "Applied",
    statusTone: "info",
  },
  {
    key: "search-quality-analyst",
    title: "Search Quality Analyst",
    company: "google",
    logoSrc: partnerLogos.google,
    logoAlt: "Google",
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
    company: "verita",
    partnerName: "Verita partner",
    compensation: "56/hr",
    engagementTerms: "35 hours per week",
    duration: "5 months",
    matchTier: "Strong match",
  },
  {
    key: "strategic-finance-expert",
    title: "Strategic Finance Expert",
    company: "apple",
    logoSrc: partnerLogos.apple,
    logoAlt: "Apple",
    partnerName: "Apple",
    compensation: "$85/hr",
    engagementTerms: "15 hrs/week",
    matchTier: "Good match",
  },
  {
    key: "retail-operations-contractor",
    title: "Retail Operations Contractor",
    company: "verita",
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
   * Dismissing the offer (its X) removes it with the same exit as a dismissed
   * Next Steps card — `cardDismissVariants` (fade + soft scale-down) inside
   * `AnimatePresence`, opacity-only under reduced motion. The section
   * (heading + card) stays mounted until that exit finishes, then unmounts via
   * `onExitComplete` — same pattern as `NextStepsSection`'s last card. Local UI
   * state only; a real consumer would persist the dismissal.
   */
  const { prefersReducedMotion } = useMotionPreference();
  const [offerDismissed, setOfferDismissed] = React.useState(false);
  const [offerSectionVisible, setOfferSectionVisible] = React.useState(true);

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
            {offerSectionVisible && (
              <div className="flex w-full flex-col items-start gap-4">
                <Typography size="xl" weight="semibold">
                  You have a new offer
                </Typography>
                <AnimatePresence onExitComplete={() => setOfferSectionVisible(false)}>
                  {!offerDismissed && (
                    <motion.div
                      key="offer"
                      className="w-full"
                      variants={cardDismissVariants}
                      initial={false}
                      animate="animate"
                      exit={prefersReducedMotion ? { opacity: 0, transition: { duration: 0.01 } } : "exit"}
                    >
                      <OfferCard
                        company="verita"
                        title="Sleep Specialist, Behavioral Sleep Medicine Professional"
                        partnerName="Verita partner"
                        compensation="$75 - $95 / hour"
                        engagementTerms="Up to 30 hr per week"
                        duration="Ongoing"
                        expirationDate="Expires on Sep 10"
                        onCtaPress={() => {}}
                        rowProps={{ onClick: () => {} }}
                        dismissLabel="Dismiss offer"
                        onDismiss={() => setOfferDismissed(true)}
                        className="w-full rounded-card border border-border shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Everything below the offer glides up into the space its section frees, instead of snapping —
                `layout="position"` gated by `layoutDependency` so it only runs when the offer section unmounts
                (not on sidebar toggles), on the slow `reflowTransition`. Reduced motion: no glide. */}
            <motion.div
              layout={prefersReducedMotion ? false : "position"}
              layoutDependency={offerSectionVisible}
              transition={reflowTransition}
              className="flex w-full flex-col items-start gap-12"
            >
              <NextStepsSection steps={NEXT_STEPS} />

              <div className="flex w-full flex-col items-start gap-4">
                <Typography size="xl" weight="semibold">
                  Active work
                </Typography>
                {/* 2-up below `xl`, 3-up from `xl` — unlike Next steps, every contract stays visible, so extras wrap to a new row (Figma's 16px row gap) rather than queueing. */}
                <div className="grid w-full grid-cols-2 items-start gap-x-5 gap-y-4 xl:grid-cols-3">
                  {ACTIVE_WORK.map(({ key, ...contract }) => (
                    <ContractCard
                      key={key}
                      {...contract}
                      className="w-full"
                      rowProps={{ onClick: () => {} }}
                      primaryActionProps={{ onPress: () => {} }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex w-full flex-col items-start gap-4">
                <Typography size="xl" weight="semibold">
                  Active Applications
                </Typography>
                <div className="flex w-full flex-col items-start overflow-hidden rounded-card border border-border shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]">
                  {ACTIVE_APPLICATIONS.map(({ key, ...application }) => (
                    <ApplicationCard
                      key={key}
                      {...application}
                      actionsMenuLabel={`More actions for ${application.title}`}
                      actionsMenu={
                      <>
                        <MenuItem icon={AlignLeft} onAction={() => {}}>View Details</MenuItem>
                        <MenuItem icon={Share06} onAction={() => {}}>Share</MenuItem>
                        <MenuSeparator />
                        <MenuItem icon={XCircle} tone="destructive" onAction={() => {}}>Withdraw</MenuItem>
                      </>
                    }
                      rowProps={{ onClick: () => {} }}
                      className="border-b border-border last:border-b-0"
                    />
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
                    <MatchCard
                      key={key}
                      {...match}
                      rowProps={{ onClick: () => {} }}
                      className="border-b border-border last:border-b-0"
                    />
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
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Dashboard };

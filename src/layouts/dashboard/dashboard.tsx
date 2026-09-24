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
import { layoutCanvasPaddingClassName } from "@/layouts/shared/layout-canvas";
import { prototypeAccountMenu } from "@/layouts/shared/prototype-account-menu";
import { OfferCard } from "@/components/cards/offer-card";
import { ContractCard } from "@/components/cards/contract-card";
import { ApplicationCard, ApplicationCardGroup } from "@/components/cards/application-card";
import { MatchCard } from "@/components/cards/match-card";
import { CalloutCard } from "@/components/cards/callout-card";
import { MenuItem, MenuSeparator } from "@/components/overlays/menu";
import { DEMO_APPLICATIONS, DEMO_CONTRACTS, DEMO_OFFERS } from "@/layouts/shared/demo-engagements";
import {
  applyWithdrawnApplications,
  readSidebarCollapsed,
  saveSidebarCollapsed,
  useDeclinedOffers,
  useWithdrawnApplications,
} from "@/layouts/shared/demo-state";

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
    description: "Amazon Health requested an updated document for your contract.",
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

/**
 * Active work, Active Applications, and the offer alert come from the shared
 * demo data (`src/layouts/shared/demo-engagements.ts`), so they match what
 * the `Engagements` layout lists: "Active work" is the `Open` contracts, and
 * "Active Applications" is the top of Engagements → Applications → `Open`,
 * in that filter's default sort (`engagements.md` §3.1).
 */
const ACTIVE_WORK = DEMO_CONTRACTS.filter((contract) => contract.filter === "open");

/** Max rows in "Active Applications" (`applications-card.md` §5 "Home preview"). The rest are one click away via "View All". */
const ACTIVE_APPLICATIONS_LIMIT = 3;


/**
 * Most recent matches (Figma's "Matches" section, stacked `match-card` rows).
 * None of them is already an application, offer, or contract in the shared
 * demo data: a match the professional acted on would have left this list.
 */
const RECENT_MATCHES = [
  {
    key: "clinical-documentation-reviewer",
    title: "Clinical Documentation Reviewer",
    company: "verita",
    partnerName: "Verita partner",
    compensation: "$58/hr",
    engagementTerms: "Up to 20 hrs/week",
    duration: "4 months",
    matchTier: "Strong match",
  },
  {
    key: "healthcare-data-annotator",
    title: "Healthcare Data Annotator",
    company: "amazon",
    logoSrc: partnerLogos.amazon,
    logoAlt: "Amazon Health",
    partnerName: "Amazon Health",
    compensation: "$52/hr",
    engagementTerms: "15 hrs/week",
    matchTier: "Good match",
  },
  {
    key: "behavioral-health-survey-expert",
    title: "Behavioral Health Survey Expert",
    company: "verita",
    partnerName: "Verita partner",
    compensation: "$45/hr",
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
  /**
   * Target for "Active Applications" → "View All": Engagements → Applications,
   * `Open` filter. Same no-router reason as `navHrefOverrides`; defaults to `#`.
   */
  viewAllApplicationsHref?: string;
  /**
   * Target for "Active work" → "View All": Engagements → Contracts, `Open`
   * filter. Same no-router reason as `navHrefOverrides`; defaults to `#`.
   */
  viewAllContractsHref?: string;
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
function Dashboard({
  navHrefOverrides,
  viewAllApplicationsHref = "#",
  viewAllContractsHref = "#",
}: DashboardProps = {}) {
  // Starts as the professional last left it on another page (prototype pages remount on every sidebar link).
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(readSidebarCollapsed);
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
  /**
   * "Active work" stays one row: as many contracts as the grid has columns
   * (2 below `xl`, 3 from `xl`), with the rest behind "View All". Same
   * breakpoint-driven cap as `NextStepsSection`, so "Showing # of {total}"
   * always matches what's on screen.
   */
  const isXlUp = useMediaQuery("(min-width: 1280px)");
  const visibleActiveWork = ACTIVE_WORK.slice(0, isXlUp ? 3 : 2);
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
   * The offer's X declines it: the offer moves to Engagements → Offers →
   * `Declined` (`engagements.md` §4.1), via the prototype's shared
   * `useDeclinedOffers` state, so it's there after clicking through to
   * Engagements and stays gone from Home. The card leaves with the same exit
   * as a dismissed Next Steps card — `cardDismissVariants` (fade + soft
   * scale-down) inside `AnimatePresence`, opacity-only under reduced motion.
   * The section (heading + card) stays mounted until that exit finishes, then
   * unmounts via `onExitComplete` — same pattern as `NextStepsSection`'s last
   * card. `newOffer` is read once on mount so declining doesn't unmount the
   * section before its exit animation runs.
   */
  const { prefersReducedMotion } = useMotionPreference();
  const { declined, decline } = useDeclinedOffers();
  // Withdraw (row `···` menu) moves the application to Engagements → `Not moving forward`, so it drops off
  // "Active Applications" and the next open one takes its place — see `useWithdrawnApplications`.
  const { withdrawn, withdraw } = useWithdrawnApplications();
  const openApplications = applyWithdrawnApplications(DEMO_APPLICATIONS, withdrawn).filter(
    (application) => application.filter === "open",
  );
  const activeApplications = openApplications.slice(0, ACTIVE_APPLICATIONS_LIMIT);
  const [newOffer] = React.useState(() =>
    DEMO_OFFERS.find((offer) => offer.filter === "open" && !declined.has(offer.key)),
  );
  const [offerDismissed, setOfferDismissed] = React.useState(false);
  const [offerSectionVisible, setOfferSectionVisible] = React.useState(true);

  const handleDeclineOffer = () => {
    if (newOffer) decline(newOffer.key);
    setOfferDismissed(true);
  };

  const handleSidebarCollapsedChange = (collapsed: boolean) => {
    // A manual toggle always promotes the current state to user-owned —
    // even a manual re-collapse while already below `lg` should stick
    // through a later crossing back above `lg`, per `wasAutoCollapsedRef`'s
    // own comment above.
    wasAutoCollapsedRef.current = false;
    setSidebarCollapsed(collapsed);
    saveSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex min-h-screen w-full items-start bg-white">
      <div className="sticky top-0 shrink-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={handleSidebarCollapsedChange}
          navHrefOverrides={navHrefOverrides}
          accountMenu={prototypeAccountMenu}
        />
      </div>
      <div className={cn("flex min-w-px flex-1 flex-col items-center", layoutCanvasPaddingClassName(sidebarCollapsed))}>
        <div className="flex w-full max-w-[1400px] flex-1 flex-col items-start gap-8 pt-10 pb-[104px]">
          <div className="flex w-full items-center justify-between">
            <div className="flex min-w-px flex-1 flex-col items-start gap-1.5">
              {/* Figma `3xl -bold`, 1% letter-spacing (0.3px). */}
              <Typography size="3xl" weight="bold" className="tracking-[0.01em]">
                Welcome back, Theresa
              </Typography>
              <Typography size="lg" className="leading-6.5">Let’s make today count.</Typography>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-12">
            {newOffer && offerSectionVisible && (
              <div className="flex w-full flex-col items-start gap-3">
                <Typography size="lg" weight="bold" className="leading-6.5">
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
                        company={newOffer.company}
                        title={newOffer.title}
                        partnerName={newOffer.partnerName}
                        compensation={newOffer.compensation}
                        engagementTerms={newOffer.engagementTerms}
                        duration={newOffer.duration}
                        expirationDate={newOffer.expirationDate}
                        onCtaPress={() => {}}
                        rowProps={{ onClick: () => {} }}
                        dismissLabel="Decline offer"
                        onDismiss={handleDeclineOffer}
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

              <div className="flex w-full flex-col items-start gap-3">
                <div className="flex w-full flex-col items-start gap-0.5">
                  <Typography size="lg" weight="bold" className="leading-6.5">
                    Active work
                  </Typography>
                  <Typography size="sm" className="text-foreground-muted">
                    Showing {visibleActiveWork.length} of {ACTIVE_WORK.length}
                  </Typography>
                </div>
                {/* 2-up below `xl`, 3-up from `xl`, one row only (`visibleActiveWork`). */}
                <div className="grid w-full grid-cols-2 items-start gap-x-5 xl:grid-cols-3">
                  {visibleActiveWork.map(({ key, filter: _filter, ...contract }) => (
                    <ContractCard
                      key={key}
                      {...contract}
                      className="w-full"
                      rowProps={{ onClick: () => {} }}
                      primaryActionProps={{ onPress: () => {} }}
                    />
                  ))}
                </div>
                <Hyperlink href={viewAllContractsHref} showArrow>
                  View All
                </Hyperlink>
              </div>

              <div className="flex w-full flex-col items-start gap-3">
                {/* Figma: title + `sm` muted subtitle, 2px apart — same header as `NextStepsSection`. */}
                <div className="flex w-full flex-col items-start gap-0.5">
                  <Typography size="lg" weight="bold" className="leading-6.5">
                    Active Applications
                  </Typography>
                  <Typography size="sm" className="text-foreground-muted">
                    Showing {activeApplications.length} of {openApplications.length}
                  </Typography>
                </div>
                <div className="flex w-full flex-col items-start overflow-hidden rounded-card border border-border shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]">
                  {/* One supporting-text position for the whole list (`ApplicationCardGroup`). */}
                  <ApplicationCardGroup>
                    {activeApplications.map(({ key, filter: _filter, ...application }) => (
                      <ApplicationCard
                        key={key}
                        {...application}
                        actionsMenuLabel={`More actions for ${application.title}`}
                        actionsMenu={
                        <>
                          <MenuItem icon={AlignLeft} onAction={() => {}}>View Details</MenuItem>
                          <MenuItem icon={Share06} onAction={() => {}}>Share</MenuItem>
                          <MenuSeparator />
                          <MenuItem icon={XCircle} tone="destructive" onAction={() => withdraw(key)}>
                            Withdraw
                          </MenuItem>
                        </>
                      }
                        rowProps={{ onClick: () => {} }}
                        className="border-b border-border last:border-b-0"
                      />
                    ))}
                  </ApplicationCardGroup>
                </div>
                <div className="flex items-start gap-5">
                  <Hyperlink href={viewAllApplicationsHref} showArrow>
                    View All
                  </Hyperlink>
                  <Hyperlink href="#" showArrow>
                    Discover more opportunities
                  </Hyperlink>
                </div>
              </div>

              <div className="flex w-full flex-col items-start gap-3">
                <Typography size="lg" weight="bold" className="leading-6.5">
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

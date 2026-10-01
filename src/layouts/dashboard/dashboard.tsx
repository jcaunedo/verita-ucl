import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, UsersRight, XCircle } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { partnerLogos } from "@/assets/logos";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { mediaAbove } from "@/lib/breakpoints";
import { cardDismissVariants, reflowTransition, useMotionPreference } from "@/lib/motion";
import { Sidebar, type SidebarProps } from "@/components/navigation/sidebar";
import { Typography } from "@/components/typography";
import { Hyperlink } from "@/components/buttons/hyperlink";
import { Alert } from "@/components/feedback/alert";
import { NextStepsSection, type NextStep } from "@/layouts/shared/next-steps-section";
import { layoutCanvasPaddingClassName } from "@/layouts/shared/layout-canvas";
import { PageTitle } from "@/layouts/shared/page-title";
import { prototypeAccountMenu } from "@/layouts/shared/prototype-account-menu";
import { useLayoutSidebar } from "@/layouts/shared/use-layout-sidebar";
import { navigatePrototype } from "@/layouts/shared/prototype-navigation";
import { ContractCard } from "@/components/cards/contract-card";
import { ApplicationCard, ApplicationCardGroup } from "@/components/cards/application-card";
import { MatchCard } from "@/components/cards/match-card";
import { CalloutCard } from "@/components/cards/callout-card";
import { MenuItem } from "@/components/overlays/menu";
import { DEMO_APPLICATIONS, DEMO_CONTRACTS, DEMO_OFFERS, offerDaysLeft } from "@/layouts/shared/demo-engagements";
import {
  applyWithdrawnApplications,
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

/** "in 3 days" / "tomorrow" / "today", for the offer card's expiration line. */
function expiresIn(daysLeft: number) {
  if (daysLeft <= 0) return "today";
  if (daysLeft === 1) return "tomorrow";
  return `in ${daysLeft} days`;
}

/**
 * The Next steps Offer card (`next-steps-card.md` §2.4): one card for every open offer awaiting a response, first in
 * the section. Counts the offers ("1 new offer", "2 new offers") and names the soonest expiration. Card and CTA open
 * Engagements → Offers → `Awaiting response`. Dismissible: it only leaves Home for this visit, nothing is declined.
 */
function offerNextStep(offers: readonly { expiresAt: string }[], viewOffersHref: string): NextStep {
  const count = offers.length;
  const plural = count > 1;
  const nextExpiry = expiresIn(Math.min(...offers.map((offer) => offerDaysLeft(offer.expiresAt))));
  return {
    key: "offers",
    variant: "offer",
    label: `${count} new ${plural ? "offers" : "offer"}`,
    title: `You have ${count} new ${plural ? "offers" : "offer"} waiting for your response.`,
    description: plural
      ? `Review your offers before they expire. Next offer expires ${nextExpiry}`
      : `Review your offer before it expires. It expires ${nextExpiry}`,
    buttonLabel: "View offers",
    buttonProps: { href: viewOffersHref },
    dismissible: true,
  };
}

/**
 * Current contracts, Applications, and the offer card come from the shared
 * demo data (`src/layouts/shared/demo-engagements.ts`), so they match what
 * the `Engagements` layout lists: "Current contracts" is the `Open` contracts, and
 * "Applications" is the top of Engagements → Applications → `In progress`,
 * in that filter's default sort (`engagements.md` §3.1).
 */
const ACTIVE_WORK = DEMO_CONTRACTS.filter((contract) => contract.filter === "open");

/** Max rows in "Applications" (`applications-card.md` §5 "Home preview"). The rest are one click away via "View All". */
const ACTIVE_APPLICATIONS_LIMIT = 3;


/**
 * Top matches for you (Figma's "Matches" section, stacked `match-card` rows).
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
   * Target for "Applications" → "View All": Engagements → Applications,
   * `In progress` filter. Same no-router reason as `navHrefOverrides`; defaults to `#`.
   */
  viewAllApplicationsHref?: string;
  /**
   * Target for "Current contracts" → "View All": Engagements → Contracts, `Current`
   * filter. Same no-router reason as `navHrefOverrides`; defaults to `#`.
   */
  viewAllContractsHref?: string;
  /**
   * How many of the demo's open offers this scenario has, soonest expiration first. Defaults to 1; the "2 offers"
   * story passes 2 to preview the plural copy.
   */
  offerLimit?: number;
  /**
   * How the open offers are shown. `next-step` (default): the Offer card, first in Next steps
   * (`next-steps-card.md` §2.4). `banner`: one info `Alert` above Next steps instead — an exploration, Figma:
   * Verita → `Dashboard` (`node-id=6095-2350`), previewed by the "Offer alert banner" story (account menu).
   */
  offerDisplay?: "next-step" | "banner";
  /** Target for the offer card / banner: Engagements → Offers → `Awaiting response`. Same no-router reason as `navHrefOverrides`; defaults to `#`. */
  viewOffersHref?: string;
}

/**
 * Full-page reference layout — the provider portal's home dashboard fully
 * populated with real work-in-progress content (next steps led by the offer card,
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
 * active-work grid, active-applications list, and
 * recent-matches list Figma shows once the professional has real activity.
 *
 * The "Applications"/"Matches" sections are plain bordered containers
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
  offerLimit = 1,
  offerDisplay = "next-step",
  viewOffersHref = "#",
}: DashboardProps = {}) {
  const { sidebarCollapsed, handleSidebarCollapsedChange } = useLayoutSidebar();
  /**
   * "Current contracts" stays one row: as many contracts as the grid has columns
   * (2 at `xl` and below, 3 above `xl`), with the rest behind "View All". Same
   * breakpoint-driven cap as `NextStepsSection`, so "Showing # of {total}"
   * always matches what's on screen.
   */
  const isXlUp = useMediaQuery(mediaAbove("xl"));
  const visibleActiveWork = ACTIVE_WORK.slice(0, isXlUp ? 3 : 2);

  /**
   * Open offers the professional hasn't declined (declining happens in Engagements → Offers, `engagements.md` §4.1;
   * the prototype's shared `useDeclinedOffers` state carries it back here). Read once on mount, so the Next steps
   * array stays stable for `NextStepsSection`'s memo.
   */
  const { prefersReducedMotion } = useMotionPreference();
  const { declined } = useDeclinedOffers();
  // Withdraw (row `···` menu) moves the application to Engagements → `Not moving forward`, so it drops off
  // "Applications" and the next open one takes its place — see `useWithdrawnApplications`.
  const { withdrawn, withdraw } = useWithdrawnApplications();
  const openApplications = applyWithdrawnApplications(DEMO_APPLICATIONS, withdrawn).filter(
    (application) => application.filter === "open",
  );
  const activeApplications = openApplications.slice(0, ACTIVE_APPLICATIONS_LIMIT);
  const [shownOffers] = React.useState(() =>
    DEMO_OFFERS.filter((offer) => offer.filter === "open" && !declined[offer.key]).slice(0, offerLimit),
  );
  const nextSteps = React.useMemo(
    () =>
      offerDisplay === "next-step" && shownOffers.length > 0
        ? [offerNextStep(shownOffers, viewOffersHref), ...NEXT_STEPS]
        : NEXT_STEPS,
    [offerDisplay, shownOffers, viewOffersHref],
  );
  const [offerSectionVisible, setOfferSectionVisible] = React.useState(true);
  const [offerBannerDismissed, setOfferBannerDismissed] = React.useState(false);

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
              <PageTitle>Welcome back, Theresa</PageTitle>
              <Typography size="lg">Let’s make today count.</Typography>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-12">
            {/* Banner option: one alert for every shown offer, 48px above Next steps like the list. The × hides it
                for this visit (it doesn't decline anything), with the same exit as the list's last card; the page
                below glides up via the `layoutDependency` below, once the exit completes. */}
            <AnimatePresence initial={false} onExitComplete={() => setOfferSectionVisible(false)}>
              {offerDisplay === "banner" && shownOffers.length > 0 && !offerBannerDismissed && (
                <motion.div
                  key="offer-banner"
                  className="w-full"
                  variants={cardDismissVariants}
                  initial={false}
                  animate="animate"
                  exit={prefersReducedMotion ? { opacity: 0, transition: { duration: 0.01 } } : "exit"}
                >
                  <Alert
                    tone="info"
                    title={
                      // Figma's copy, with a singular form for one offer (never "1 new offers", `dashboard.md` §7.1).
                      shownOffers.length > 1
                        ? `You have ${shownOffers.length} new offers waiting for your response.`
                        : "You have a new offer waiting for your response."
                    }
                    description="Review the details and decide how you’d like to move forward."
                    onClick={() => navigatePrototype(viewOffersHref)}
                    dismissible
                    onDismiss={() => setOfferBannerDismissed(true)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Everything below the banner glides up into the space it frees when dismissed, instead of snapping —
                `layout="position"` gated by `layoutDependency` so it only runs then (not on sidebar toggles), on the
                slow `reflowTransition`. Reduced motion: no glide. */}
            <motion.div
              layout={prefersReducedMotion ? false : "position"}
              layoutDependency={offerSectionVisible}
              transition={reflowTransition}
              className="flex w-full flex-col items-start gap-12"
            >
              <NextStepsSection steps={nextSteps} />

              <div className="flex w-full flex-col items-start gap-3">
                <div className="flex w-full flex-col items-start gap-0.5">
                  <Typography size="xl" weight="semibold">
                    Current contracts
                  </Typography>
                  <Typography size="sm" className="text-foreground-muted">
                    Showing {visibleActiveWork.length} of {ACTIVE_WORK.length}
                  </Typography>
                </div>
                {/* 2-up at `xl` (1280px) and below, 3-up above it, one row only (`visibleActiveWork`). */}
                <div className="grid w-full grid-cols-2 items-start gap-x-5 xl:grid-cols-3">
                  {visibleActiveWork.map(({ key, filter: _filter, ...contract }) => (
                    <ContractCard
                      key={key}
                      {...contract}
                      className="w-full"
                      rowProps={{ onClick: () => {} }}
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
                  <Typography size="xl" weight="semibold">
                    Applications
                  </Typography>
                  <Typography size="sm" className="text-foreground-muted">
                    Showing {activeApplications.length} of {openApplications.length}
                  </Typography>
                </div>
                <div className="flex w-full flex-col items-start overflow-hidden rounded-card border border-border shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]">
                  {/* One supporting-text position for the whole list (`ApplicationCardGroup`). */}
                  <ApplicationCardGroup>
                    {activeApplications.map(({ key, filter: _filter, nextActionOwner: _owner, lastActivityAt: _lastActivityAt, ...application }) => (
                      <ApplicationCard
                        key={key}
                        {...application}
                        actionsMenuLabel={`More actions for ${application.title}`}
                        actionsMenu={
                        <>
                          <MenuItem icon={ArrowUpRight} onAction={() => {}}>View Details</MenuItem>
                          <MenuItem icon={UsersRight} onAction={() => {}}>Refer</MenuItem>
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
                <Typography size="xl" weight="semibold">
                  Top matches for you
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

              {/* One column at `lg` (1024px) and below, two side by side above it; side by side, `items-stretch` keeps both cards
    the same height however their text wraps. */}
              <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-stretch">
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

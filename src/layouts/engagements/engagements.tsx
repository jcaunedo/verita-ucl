import * as React from "react";
import { AlignLeft, SearchMd, Share06, XCircle } from "@untitledui/icons";

import { partnerLogos } from "@/assets/logos";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Sidebar, type SidebarProps } from "@/components/navigation/sidebar";
import {
  MetricTab,
  MetricTabList,
  MetricTabPanel,
  MetricTabs,
} from "@/components/navigation/metric-tab";
import {
  TabButton,
  TabButtonList,
  TabButtonPanel,
  TabButtons,
} from "@/components/navigation/tab-button";
import { Typography } from "@/components/typography";
import { Button } from "@/components/buttons/button";
import {
  ApplicationCard,
  type ApplicationCardProps,
} from "@/components/cards/application-card";
import { MenuItem, MenuSeparator } from "@/components/overlays/menu";
import { ContractCard } from "@/components/cards/contract-card";

type ApplicationFilter = "open" | "moving-forward" | "not-moving-forward";

type ApplicationRow = Pick<
  ApplicationCardProps,
  | "title"
  | "company"
  | "logoSrc"
  | "logoAlt"
  | "partnerName"
  | "compensation"
  | "engagementTerms"
  | "duration"
  | "statusLabel"
  | "statusTone"
  | "supportingText"
> & { key: string; filter: ApplicationFilter };

/**
 * Applications grouped by filter, per `product-specs/engagements.md` §3.1
 * (Open: Applied, Action required, On hold; Moving forward: Interview
 * scheduled, Interview · Action required, In review; Not moving forward: Not
 * selected, Withdrawn, Closed). An application with an offer leaves this view
 * for Offers (§2), so there are no `Offer received` rows. The five
 * Open rows are Figma's; the Moving forward rows come from verita.ds's
 * `table-application-listing` examples and the `ApplicationCard` stories. Statuses and supporting text follow
 * the specs where the Figma frame drifts from them — `applications-card.md`
 * §2.4.1's status matrix and approved `Action required` examples.
 */
const APPLICATIONS: ApplicationRow[] = [
  {
    key: "senior-financial-analyst",
    filter: "open",
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
    filter: "open",
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
    filter: "open",
    title: "Movement & Physical Activity Expert Annotator",
    company: "verita",
    partnerName: "Verita partner",
    compensation: "$50/hr",
    engagementTerms: "40 hrs/week",
    duration: "8 weeks",
    statusLabel: "Applied",
    statusTone: "info",
  },
  {
    key: "search-quality-analyst",
    filter: "open",
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
  {
    key: "developer-relations-contractor",
    filter: "open",
    title: "Developer Relations Contractor",
    company: "verita",
    partnerName: "Verita partner",
    compensation: "$85/hr",
    engagementTerms: "Up to 40 hrs/week",
    duration: "Ongoing",
    statusLabel: "On hold",
    statusTone: "purple",
  },
  {
    key: "amazon-clinical-data-coordinator",
    filter: "moving-forward",
    title: "Clinical Data Coordinator",
    company: "amazon",
    logoSrc: partnerLogos.amazon,
    logoAlt: "Amazon Health",
    partnerName: "Amazon Health",
    compensation: "$85/hr",
    engagementTerms: "15 hrs/week",
    duration: "2 weeks",
    statusLabel: "Interview scheduled",
    statusTone: "success",
    supportingText: "Sep 30 at 2 PM EDT",
  },
  {
    key: "retail-operations-contractor",
    filter: "moving-forward",
    title: "Retail Operations Contractor",
    company: "apple",
    logoSrc: partnerLogos.apple,
    logoAlt: "Apple",
    partnerName: "Apple",
    compensation: "$42/hr",
    engagementTerms: "Up to 30 hrs/week",
    duration: "5 months",
    statusLabel: "Interview · Action required",
    statusTone: "warning",
    supportingText: "Schedule your interview by Sep 30",
  },
  {
    key: "strategic-finance-expert",
    filter: "moving-forward",
    title: "Strategic Finance Expert",
    company: "verita",
    partnerName: "Verita partner",
    compensation: "$56/hour",
    engagementTerms: "Up to 30 hrs/week",
    duration: "3 months",
    statusLabel: "In review",
    statusTone: "success",
    supportingText: "Awaiting partner review after your Sep 18 interview",
  },
];

/**
 * Contracts view (`engagements.md` §2 "Contracts"), filtered by `Open` /
 * `Completed` (§5.2). No Figma design yet for this view — reuses
 * `Dashboard`'s first two "Active work" contracts (one with a progress bar,
 * one without) in the same grid.
 */
type ContractFilter = "open" | "completed";

const CONTRACTS = [
  {
    key: "backend-integration",
    filter: "open",
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
    filter: "open",
    company: "verita",
    title: "Compensation Benchmarking Report",
    compensation: "$4,500/project",
    partnerName: "Amazon Health",
    engagementTerms: "6 weeks",
    primaryActionLabel: "Resume work",
  },
] as const;

const CONTRACT_FILTERS: { id: ContractFilter; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "completed", label: "Completed" },
];

/**
 * Offers view filters (`engagements.md` §4.1): `Open` (awaiting a response or
 * still in contracting) / `Declined` (the Offers history). No offer rows yet —
 * the Offers view has no Figma design.
 */
type OfferFilter = "open" | "declined";

const OFFER_FILTERS: { id: OfferFilter; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "declined", label: "Declined" },
];

const OFFERS: { key: string; filter: OfferFilter }[] = [];

const offerCountFor = (filter: OfferFilter) =>
  OFFERS.filter((offer) => offer.filter === filter).length;

const FILTERS: { id: ApplicationFilter; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "moving-forward", label: "Moving forward" },
  { id: "not-moving-forward", label: "Not moving forward" },
];

const countFor = (filter: ApplicationFilter) =>
  APPLICATIONS.filter((application) => application.filter === filter).length;

type EngagementView = "applications" | "offers" | "contracts" | "assessments" | "talent-network";

/**
 * The search button + filter tabs row shared by every filtered view
 * (`engagements.md` §3.1). Search is the icon button only — no expand yet.
 * A filter with a zero count keeps its tab but hides its counter.
 */
function FilterBar({
  searchLabel,
  filtersLabel,
  filters,
}: {
  searchLabel: string;
  filtersLabel: string;
  filters: { id: string; label: string; count: number }[];
}) {
  return (
    <div className="flex items-center gap-4">
      <Button color="secondary" size="md" iconLeading={SearchMd} aria-label={searchLabel} />
      <TabButtonList aria-label={filtersLabel}>
        {filters.map(({ id, label, count }) => (
          <TabButton key={id} id={id} label={label} count={count > 0 ? count : undefined} />
        ))}
      </TabButtonList>
    </div>
  );
}

interface EngagementsProps {
  /** Passed through to the internal `Sidebar` — see `Dashboard`'s same prop. */
  navHrefOverrides?: SidebarProps["navHrefOverrides"];
  /** View tab selected on first render. Defaults to `"applications"`. */
  defaultView?: EngagementView;
}

/**
 * Full-page reference layout — Engagements → Applications. Figma: Verita →
 * `Engagements` (`node-id=5672-4301`). Specs:
 * `product-specs/engagements.md` §2 (view tabs), §3 (row interaction), §3.1
 * (filters, counts, search) and `product-specs/applications-card.md`.
 *
 * - View tabs: `MetricTabs` in the §2 tab order. Only the Applications
 *   panel is designed. Contracts reuses `Dashboard`'s contract cards; Offers
 *   has its filter row (§4.1) but no rows; the other panels are empty
 *   placeholders.
 * - Applications total = `Open` + `Moving forward` (§3.1 "Counts"). A filter
 *   with zero applications keeps its tab but hides its counter.
 * - Search: icon-only button, no expand behavior yet — the expanded input has
 *   no design and UCL has no `Input` component (§3.1 "Search").
 * - Rows: `ApplicationCard` with the hover-revealed `···` menu (§3 "Row
 *   interaction", `applications-card.md` §4.1), stacked in the same bordered
 *   container as `Dashboard`'s Active Applications list.
 *
 * Reuses `Dashboard`'s sidebar auto-collapse below `lg`.
 */
function Engagements({ navHrefOverrides, defaultView = "applications" }: EngagementsProps = {}) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  // Same auto-collapse-below-`lg` behavior as `Dashboard` — see its comment for the full rationale.
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

  const handleSidebarCollapsedChange = (collapsed: boolean) => {
    wasAutoCollapsedRef.current = false;
    setSidebarCollapsed(collapsed);
  };

  const applicationsTotal = countFor("open") + countFor("moving-forward");

  return (
    <div className="flex min-h-screen w-full items-start bg-white">
      <div className="sticky top-0 shrink-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={handleSidebarCollapsedChange}
          navHrefOverrides={navHrefOverrides}
          defaultActiveNavKey="engagements"
        />
      </div>
      {/* Figma `Canvas`: 64px left / 160px right padding at desktop. */}
      <div className="flex min-w-px flex-1 flex-col items-center px-12 xl:pr-40 xl:pl-16">
        <div className="flex w-full max-w-[1400px] flex-1 flex-col items-start gap-8 pt-14 pb-[104px]">
          <div className="flex w-full flex-col items-start gap-1.5">
            <Typography as="h1" size="3xl" weight="semibold">
              Engagements
            </Typography>
            <Typography className="text-foreground-muted">
              Track your applications, offers, contracts, assessments, and talent network as you move from
              opportunity to work.
            </Typography>
          </div>

          <MetricTabs defaultSelectedKey={defaultView} className="flex w-full flex-col gap-8">
            <MetricTabList aria-label="Engagement views">
              <MetricTab id="applications" label="Applications" value={applicationsTotal} />
              {/* Offers total = `Open` only (§4.1). */}
              <MetricTab id="offers" label="Offers" value={offerCountFor("open")} />
              <MetricTab id="contracts" label="Contracts" value={CONTRACTS.length} />
              <MetricTab id="assessments" label="Assessments" value={0} />
              <MetricTab id="talent-network" label="Talent Network" value={0} />
            </MetricTabList>

            <MetricTabPanel id="applications" className="outline-none">
              <TabButtons defaultSelectedKey="open" className="flex w-full flex-col gap-8">
                <FilterBar
                  searchLabel="Search applications"
                  filtersLabel="Application filters"
                  filters={FILTERS.map(({ id, label }) => ({ id, label, count: countFor(id) }))}
                />

                {FILTERS.map(({ id }) => {
                  const rows = APPLICATIONS.filter((application) => application.filter === id);
                  return (
                    <TabButtonPanel key={id} id={id} className="w-full outline-none">
                      {/* Zero-state for an empty filter isn't designed yet — the panel renders nothing. */}
                      {rows.length > 0 && (
                        <div className="flex w-full flex-col items-start overflow-hidden rounded-card border border-border shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]">
                          {rows.map(({ key, filter: _filter, ...application }) => (
                            <ApplicationCard
                              key={key}
                              {...application}
                              actionsMenuLabel={`More actions for ${application.title}`}
                              actionsMenu={
                                <>
                                  <MenuItem icon={AlignLeft} onAction={() => {}}>View Details</MenuItem>
                                  <MenuItem icon={Share06} onAction={() => {}}>Share</MenuItem>
                                  <MenuSeparator />
                                  <MenuItem icon={XCircle} tone="destructive" onAction={() => {}}>
                                    Withdraw
                                  </MenuItem>
                                </>
                              }
                              rowProps={{ onClick: () => {} }}
                              className="border-b border-border last:border-b-0"
                            />
                          ))}
                        </div>
                      )}
                    </TabButtonPanel>
                  );
                })}
              </TabButtons>
            </MetricTabPanel>
            <MetricTabPanel id="offers" className="outline-none">
              <TabButtons defaultSelectedKey="open" className="flex w-full flex-col gap-8">
                <FilterBar
                  searchLabel="Search offers"
                  filtersLabel="Offer filters"
                  filters={OFFER_FILTERS.map(({ id, label }) => ({ id, label, count: offerCountFor(id) }))}
                />
                {/* Offer rows aren't designed yet — each filter panel renders nothing. */}
                {OFFER_FILTERS.map(({ id }) => (
                  <TabButtonPanel key={id} id={id} className="w-full outline-none" />
                ))}
              </TabButtons>
            </MetricTabPanel>
            {/* Assessments / Talent Network views aren't designed yet. */}
            <MetricTabPanel id="contracts" className="outline-none">
              <TabButtons defaultSelectedKey="open" className="flex w-full flex-col gap-8">
                <FilterBar
                  searchLabel="Search contracts"
                  filtersLabel="Contract filters"
                  filters={CONTRACT_FILTERS.map(({ id, label }) => ({
                    id,
                    label,
                    count: CONTRACTS.filter((contract) => contract.filter === id).length,
                  }))}
                />
                {CONTRACT_FILTERS.map(({ id }) => {
                  const contracts = CONTRACTS.filter((contract) => contract.filter === id);
                  return (
                    <TabButtonPanel key={id} id={id} className="w-full outline-none">
                      {/* Zero-state for an empty filter isn't designed yet — the panel renders nothing. */}
                      {contracts.length > 0 && (
                        // Same 2-up / 3-up-from-`xl` grid as `Dashboard`'s "Active work".
                        <div className="grid w-full grid-cols-2 items-start gap-x-5 gap-y-4 xl:grid-cols-3">
                          {contracts.map(({ key, filter: _filter, ...contract }) => (
                            <ContractCard
                              key={key}
                              {...contract}
                              className="w-full"
                              rowProps={{ onClick: () => {} }}
                              primaryActionProps={{ onPress: () => {} }}
                            />
                          ))}
                        </div>
                      )}
                    </TabButtonPanel>
                  );
                })}
              </TabButtons>
            </MetricTabPanel>
            <MetricTabPanel id="assessments" />
            <MetricTabPanel id="talent-network" />
          </MetricTabs>
        </div>
      </div>
    </div>
  );
}

export { Engagements };

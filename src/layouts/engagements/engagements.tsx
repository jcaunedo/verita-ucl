import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlignLeft, Share06, XCircle } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { cardDismissVariants, rowDismissVariants, standardTransition, useMotionPreference } from "@/lib/motion";
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
import { SearchField } from "@/components/forms/search-field";
import { ApplicationCard, ApplicationCardGroup } from "@/components/cards/application-card";
import { MenuItem } from "@/components/overlays/menu";
import { ContractCard } from "@/components/cards/contract-card";
import { OfferCard } from "@/components/cards/offer-card";
import { EmptyState, type EmptyStateProps } from "@/components/feedback/empty-state";
import { layoutCanvasPaddingClassName } from "@/layouts/shared/layout-canvas";
import { PageTitle } from "@/layouts/shared/page-title";
import { prototypeAccountMenu } from "@/layouts/shared/prototype-account-menu";
import {
  DEMO_APPLICATIONS,
  DEMO_CONTRACTS,
  DEMO_OFFERS,
  DEMO_TODAY,
  closedOfferOutcome,
  offerClosedAt,
  offerExpiration,
  type ApplicationFilter,
  type ContractFilter,
  type OfferFilter,
} from "@/layouts/shared/demo-engagements";
import {
  applyDeclinedOffers,
  applyWithdrawnApplications,
  readSidebarCollapsed,
  saveSidebarCollapsed,
  useDeclinedOffers,
  useWithdrawnApplications,
} from "@/layouts/shared/demo-state";

/**
 * Rows come from `DEMO_APPLICATIONS` / `DEMO_OFFERS` / `DEMO_CONTRACTS`
 * (`src/layouts/shared/demo-engagements.ts`), the same data `Dashboard`
 * previews, so the two layouts tell one story. Offers and Contracts have no
 * Figma design yet: they reuse `Dashboard`'s `OfferCard` and `ContractCard`
 * treatments.
 */
const CONTRACTS = DEMO_CONTRACTS;

// `Current` (not `Open`, and not `Active`, which is also a contract status) — `engagements.md` §5.2. The id stays
// `open` so the shared filter-row rules (no counter on the default filter) apply as in Applications and Offers.
const CONTRACT_FILTERS: { id: ContractFilter; label: string }[] = [
  { id: "open", label: "Current" },
  { id: "completed", label: "Completed" },
];

/**
 * Offers view filters (`engagements.md` §4.1): `Open` (awaiting a response or
 * still in contracting) / `Closed` (the Offers history: declined, expired, or
 * withdrawn).
 */
const OFFER_FILTERS: { id: OfferFilter; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "closed", label: "Closed" },
];

const FILTERS: { id: ApplicationFilter; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "not-moving-forward", label: "Not moving forward" },
];

/**
 * `Open` is split into sections that answer "what deserves my attention first?" (`engagements.md` §3.1 "Sections").
 * Figma: `Engagements` (`node-id=5672-4301`). The row's status label still says where each application stands.
 */
type OpenSection = "action-needed" | "recent" | "older";

// Figma's label reads "Last 15 day"; the spec's "Last 15 days" is used.
const OPEN_SECTIONS: { id: OpenSection; label: string }[] = [
  { id: "action-needed", label: "Action needed" },
  { id: "recent", label: "Last 15 days" },
  { id: "older", label: "Older" },
];

const RECENT_ACTIVITY_DAYS = 15;
const DAY_MS = 24 * 60 * 60 * 1000;

/** `recent` when `iso` is 15 days ago or less (measured from `DEMO_TODAY`), else `older`. */
function recencyOf(iso: string): "recent" | "older" {
  const daysSince = (Date.parse(DEMO_TODAY) - Date.parse(iso)) / DAY_MS;
  return daysSince <= RECENT_ACTIVITY_DAYS ? "recent" : "older";
}

/**
 * History lists (`Applications` → `Not moving forward`, `Offers` → `Closed`) use only the recency sections: nothing
 * there needs action, so there is no `Action needed` (`engagements.md` §3.1, §4.1 "Sections").
 */
const HISTORY_SECTIONS = OPEN_SECTIONS.filter(
  (section): section is { id: "recent" | "older"; label: string } => section.id !== "action-needed",
);

/**
 * Action needed overrides recency: an application waiting on the professional sits in `Action needed` however old its
 * last activity is. Every other open application goes by its last meaningful update, measured from `DEMO_TODAY`.
 */
function openSectionOf({
  nextActionOwner,
  lastActivityAt,
}: Pick<(typeof DEMO_APPLICATIONS)[number], "nextActionOwner" | "lastActivityAt">): OpenSection {
  if (nextActionOwner === "professional") return "action-needed";
  return recencyOf(lastActivityAt);
}

/**
 * Talent Network view filters. Figma: Verita → `Talent Network` (`node-id=5702-7522`): `Active` / `Completed`. The
 * prototype has no memberships yet, so both show their empty state.
 */
type TalentNetworkFilter = "active" | "completed";

/** The professional's Talent Network memberships. None in the prototype, so the view shows only its empty state. */
const TALENT_NETWORK_MEMBERSHIPS: { key: string }[] = [];

const TALENT_NETWORK_FILTERS: { id: TalentNetworkFilter; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
];

/**
 * What each view or filter shows when it has nothing to list: the shared `EmptyState` layout, with its own copy (and
 * optional CTA). Figma copy: Contracts → Completed (`node-id=5701-7251`). Talent Network → Active uses the copy updated
 * on 2026-09-25, which replaces the Figma frame's (`node-id=5702-7522`). Every other entry is draft copy written in the
 * same voice, pending product/design review.
 */
type EmptyStateCopy = Pick<EmptyStateProps, "title" | "description" | "buttonLabel" | "buttonProps">;

const APPLICATION_EMPTY_STATES: Record<ApplicationFilter, EmptyStateCopy> = {
  open: {
    title: "No open applications",
    description: "Applications you submit will appear here while they're in progress.",
    buttonLabel: "Discover opportunities",
    buttonProps: { onPress: () => {} },
  },
  "not-moving-forward": {
    title: "No past applications",
    description: "Applications that don't move forward will appear here.",
  },
};

const OFFER_EMPTY_STATES: Record<OfferFilter, EmptyStateCopy> = {
  open: {
    title: "No open offers",
    description: "Offers you receive will appear here for you to review.",
  },
  closed: {
    title: "No closed offers",
    description: "Offers you decline, or that expire or are withdrawn, will appear here.",
  },
};

const CONTRACT_EMPTY_STATES: Record<ContractFilter, EmptyStateCopy> = {
  open: {
    title: "No current contracts",
    description: "Contracts will appear here once an offer you accept is finalized.",
  },
  completed: {
    title: "No completed contracts",
    description: "Contracts will appear here when your work is complete.",
  },
};

const ASSESSMENTS_EMPTY_STATE: EmptyStateCopy = {
  title: "No assessments yet",
  description: "Page in progress",
};

const TALENT_NETWORK_EMPTY_STATES: Record<TalentNetworkFilter, EmptyStateCopy> = {
  active: {
    title: "You haven’t joined a talent network yet",
    description: "Apply to a talent network that matches your expertise to be considered for future opportunities.",
    buttonLabel: "Discover talent networks",
    buttonProps: { onPress: () => {} },
  },
  completed: {
    title: "No completed talent networks",
    description: "Talent networks you're no longer part of will appear here.",
  },
};


type EngagementView = "applications" | "offers" | "contracts" | "assessments" | "talent-network";

/**
 * Search matches the opportunity title or the partner name, case-insensitively, within the selected filter
 * (`engagements.md` §3.1 "Search"). Each view keeps its own query, which stays as the professional switches filters.
 */
function matchesSearch({ title, partnerName }: { title: string; partnerName?: string }, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return title.toLowerCase().includes(needle) || (partnerName ?? "").toLowerCase().includes(needle);
}

/** What a filter shows when it has items but none match the search. Draft copy, pending product/design review. */
const noSearchResults = (query: string): EmptyStateCopy => ({
  title: `No results for “${query.trim()}”`,
  description: "Try a different search term.",
});

/**
 * The search button + filter tabs row shared by every filtered view
 * (`engagements.md` §3.1). Search is a `SearchField`: a search button that
 * expands into an input and filters the selected filter's rows.
 * `Open` never shows a counter: the view tab's `MetricTab` value already
 * carries that number. Any other filter with a zero count keeps its tab but
 * hides its counter.
 */
function FilterBar({
  searchLabel,
  searchQuery,
  onSearchChange,
  filtersLabel,
  filters,
}: {
  searchLabel: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filtersLabel: string;
  /** `count` omitted → no counter for that filter (e.g. Applications → Not moving forward). */
  filters: { id: string; label: string; count?: number }[];
}) {
  return (
    <div className="flex items-center gap-4">
      {/* Collapsed until pressed; collapses again when left empty (`SearchField`). */}
      <SearchField aria-label={searchLabel} value={searchQuery} onChange={onSearchChange} />
      {/* Figma `Tab Group Button`: `spacing/0_5` (2px) between tabs, tighter than the list's default gap. */}
      <TabButtonList aria-label={filtersLabel} className="gap-0.5">
        {filters.map(({ id, label, count }) => (
          <TabButton
            key={id}
            id={id}
            label={label}
            size="sm"
            count={id !== "open" && count != null && count > 0 ? count : undefined}
          />
        ))}
      </TabButtonList>
    </div>
  );
}

/** A labeled group within a filter (e.g. `Action needed`, `Last 15 days`): muted title, 8px above its list. */
function ListSection({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  const headingId = `${id}-heading`;
  return (
    <section aria-labelledby={headingId} className="flex w-full flex-col items-start gap-2">
      <Typography as="h2" id={headingId} size="sm" className="text-foreground-muted">
        {label}
      </Typography>
      {children}
    </section>
  );
}

/**
 * A filter's rows split into labeled sections — but only when at least two sections have rows (DESIGN.md "Show
 * section headings only when two sections have rows"). With one, its list renders alone, with no heading. Sections with
 * no rows are skipped.
 */
function GroupedList<T>({
  idPrefix,
  groups,
  renderList,
}: {
  idPrefix: string;
  groups: { id: string; label: string; rows: T[] }[];
  renderList: (rows: T[]) => React.ReactNode;
}) {
  const filled = groups.filter((group) => group.rows.length > 0);
  if (filled.length === 1) return <>{renderList(filled[0].rows)}</>;
  return (
    <div className="flex w-full flex-col items-start gap-8">
      {filled.map((group) => (
        <ListSection key={group.id} id={`${idPrefix}-${group.id}`} label={group.label}>
          {renderList(group.rows)}
        </ListSection>
      ))}
    </div>
  );
}

/** Application rows stacked in one bordered list — the same container as `Dashboard`'s Open applications. */
function ApplicationList({
  rows,
  onWithdraw,
}: {
  rows: (typeof DEMO_APPLICATIONS)[number][];
  onWithdraw: (key: string) => void;
}) {
  return (
    <div className="flex w-full flex-col items-start overflow-hidden rounded-card border border-border shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]">
      {rows.map(({ key, filter, nextActionOwner: _owner, lastActivityAt: _lastActivityAt, ...application }) => (
        <ApplicationCard
          key={key}
          {...application}
          actionsMenuLabel={`More actions for ${application.title}`}
          actionsMenu={
            <>
              <MenuItem icon={AlignLeft} onAction={() => {}}>View Details</MenuItem>
              <MenuItem icon={Share06} onAction={() => {}}>Share</MenuItem>
              {/* Withdraw only while the application is still open (`applications-card.md` §4.1). */}
              {filter === "open" && (
                <MenuItem icon={XCircle} tone="destructive" onAction={() => onWithdraw(key)}>
                  Withdraw
                </MenuItem>
              )}
            </>
          }
          rowProps={{ onClick: () => {} }}
          className="border-b border-border last:border-b-0"
        />
      ))}
    </div>
  );
}

interface EngagementsProps {
  /** Passed through to the internal `Sidebar` — see `Dashboard`'s same prop. */
  navHrefOverrides?: SidebarProps["navHrefOverrides"];
  /** View tab selected on first render. Defaults to `"applications"`. */
  defaultView?: EngagementView;
  /**
   * Offers already `Closed` before the professional arrives, listed after any they declined this session. The
   * "2 offers" story passes `DEMO_CLOSED_OFFERS` (one per outcome); defaults to none.
   */
  closedOffers?: readonly (typeof DEMO_OFFERS)[number][];
}

/**
 * Full-page reference layout — Engagements → Applications. Figma: Verita →
 * `Engagements` (`node-id=5672-4301`). Specs:
 * `product-specs/engagements.md` §2 (view tabs), §3 (row interaction), §3.1
 * (filters, counts, search) and `product-specs/applications-card.md`.
 *
 * - View tabs: `MetricTabs` in the §2 tab order. Only the Applications
 *   panel is designed. Offers and Contracts reuse `Dashboard`'s offer and
 *   contract cards; the other panels are empty placeholders.
 * - Applications total = the `Open` count (§3.1 "Counts"), so the `Open`
 *   filter shows no counter of its own. Any other filter with zero
 *   applications keeps its tab but hides its counter.
 * - Search: `SearchField` expands on press and narrows the selected filter's
 *   rows by opportunity title or partner name (§3.1 "Search"). Each view keeps
 *   its own query across filter switches.
 * - Rows: `ApplicationCard` with the hover-revealed `···` menu (§3 "Row
 *   interaction", `applications-card.md` §4.1), stacked in the same bordered
 *   container as `Dashboard`'s Open applications list.
 * - `Open` sections (§3.1 "Sections"): `Action needed` → `Last 15 days` →
 *   `Older`, each its own list under a label. Empty sections are hidden.
 *
 * Reuses `Dashboard`'s sidebar auto-collapse below `lg`.
 */
function Engagements({
  navHrefOverrides,
  defaultView = "applications",
  closedOffers: seededClosedOffers = [],
}: EngagementsProps = {}) {
  // Starts as the professional last left it on another page (prototype pages remount on every sidebar link).
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(readSidebarCollapsed);
  // An offer declined from its `···` menu, here or on `Dashboard`, shows under `Closed` — see `useDeclinedOffers`.
  const { declined, decline } = useDeclinedOffers();
  const { prefersReducedMotion, resolve } = useMotionPreference();
  const offers = [...applyDeclinedOffers(DEMO_OFFERS, declined), ...seededClosedOffers];
  const openOffers = offers.filter((offer) => offer.filter === "open");
  // Most recent closure first, across the professional's own declines and any seeded closed offers.
  const closedOffers = offers
    .filter((offer) => offer.filter === "closed")
    .sort((a, b) => offerClosedAt(b).localeCompare(offerClosedAt(a)));
  const offerCountFor = (filter: OfferFilter) => offers.filter((offer) => offer.filter === filter).length;
  // Withdraw (row `···` menu), here or on `Dashboard`, moves an application to `Not moving forward` — see `useWithdrawnApplications`.
  const { withdrawn, withdraw } = useWithdrawnApplications();
  const applications = applyWithdrawnApplications(DEMO_APPLICATIONS, withdrawn);
  const countFor = (filter: ApplicationFilter) =>
    applications.filter((application) => application.filter === filter).length;
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
    saveSidebarCollapsed(collapsed);
  };

  const applicationsTotal = countFor("open");

  const [searchQueries, setSearchQueries] = React.useState<Record<EngagementView, string>>({
    applications: "",
    offers: "",
    contracts: "",
    assessments: "",
    "talent-network": "",
  });
  const visibleOpenOffers = openOffers.filter((offer) => matchesSearch(offer, searchQueries.offers));
  const visibleClosedOffers = closedOffers.filter((offer) => matchesSearch(offer, searchQueries.offers));
  const searchProps = (view: EngagementView) => ({
    searchQuery: searchQueries[view],
    onSearchChange: (query: string) => setSearchQueries((current) => ({ ...current, [view]: query })),
  });

  /**
   * One offer row. Open: the expiration countdown and "View offer". Closed: no countdown, no CTA; the badge and
   * supporting text say how it closed, and an expired offer opens nothing (`closedOfferOutcome`).
   */
  const renderOfferCard = (demoOffer: (typeof offers)[number], className?: string) => {
    const { key, filter, expiresAt, declinedAt: _declinedAt, withdrawnBy: _withdrawnBy, withdrawnAt: _withdrawnAt, ...offer } =
      demoOffer;
    const { opensDetail, ...outcome } = filter === "closed" ? closedOfferOutcome(demoOffer) : { opensDetail: true };
    return (
      <OfferCard
        {...offer}
        {...(filter === "open" ? offerExpiration(expiresAt) : outcome)}
        showCta={filter === "open"}
        onCtaPress={() => {}}
        // Opens the offer detail (no page yet in the prototype).
        rowProps={opensDetail ? { onClick: () => {} } : undefined}
        actionsMenuLabel={`More actions for ${offer.title}`}
        // A closed offer's menu would hold only View details, so the card shows no `···`
        // (DESIGN.md "Hide a `···` menu with only one item"); the row itself opens the detail.
        actionsMenu={
          <>
            <MenuItem icon={AlignLeft} onAction={() => {}}>
              View details
            </MenuItem>
            {/* Same Decline as `Dashboard`'s offer: moves it to `Closed`. A closed offer can't be declined. */}
            {filter === "open" && (
              <MenuItem icon={XCircle} tone="destructive" onAction={() => decline(key)}>
                Decline
              </MenuItem>
            )}
          </>
        }
        className={className}
      />
    );
  };

  return (
    <div className="flex min-h-screen w-full items-start bg-white">
      <div className="sticky top-0 shrink-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={handleSidebarCollapsedChange}
          navHrefOverrides={navHrefOverrides}
          accountMenu={prototypeAccountMenu}
          defaultActiveNavKey="engagements"
        />
      </div>
      {/* Figma `Canvas`: 64px left / 160px right padding at desktop. */}
      <div className={cn("flex min-w-px flex-1 flex-col items-center self-stretch", layoutCanvasPaddingClassName(sidebarCollapsed))}>
        <div className="flex w-full max-w-[1400px] flex-1 flex-col items-start gap-8 pt-10 pb-[104px]">
          <div className="flex w-full flex-col items-start gap-1.5">
            <PageTitle>Engagements</PageTitle>
            <Typography className="text-foreground-muted">
              Track your applications, offers, contracts, assessments, and talent network as you move from
              opportunity to work.
            </Typography>
          </div>

          {/* `flex-1` down to each filter panel so an `EmptyState` can center itself in the space left below the filters. */}
          <MetricTabs defaultSelectedKey={defaultView} className="flex w-full flex-1 flex-col gap-8">
            <MetricTabList aria-label="Engagement views">
              <MetricTab id="applications" label="Applications" value={applicationsTotal} />
              {/* Offers total = `Open` only (§4.1). */}
              <MetricTab id="offers" label="Offers" value={offerCountFor("open")} />
              <MetricTab id="contracts" label="Contracts" value={CONTRACTS.length} />
              <MetricTab id="assessments" label="Assessments" value={0} />
              <MetricTab id="talent-network" label="Talent Network" value={0} />
            </MetricTabList>

            <MetricTabPanel id="applications" className="flex flex-1 flex-col outline-none">
              {/* Nothing under any filter: just the default filter's empty state, no search or filters
                  (DESIGN.md "Hide search and filters when a view is empty"). */}
              {applications.length === 0 ? (
                <EmptyState {...APPLICATION_EMPTY_STATES.open} className="flex-1" />
              ) : (
                <TabButtons defaultSelectedKey="open" className="flex w-full flex-1 flex-col gap-8">
                  <FilterBar
                    searchLabel="Search applications"
                    {...searchProps("applications")}
                    filtersLabel="Application filters"
                    // No counters on Applications filters: `Open` repeats the view-tab count, and `Not moving forward` has
                    // none by design direction (`engagements.md` §3.1 "Counts").
                    filters={FILTERS.map(({ id, label }) => ({ id, label }))}
                  />

                  {FILTERS.map(({ id }) => {
                    const filterRows = applications.filter((application) => application.filter === id);
                    const rows = filterRows.filter((application) => matchesSearch(application, searchQueries.applications));
                    return (
                      <TabButtonPanel key={id} id={id} className="flex w-full flex-1 flex-col outline-none">
                        {filterRows.length === 0 && <EmptyState {...APPLICATION_EMPTY_STATES[id]} className="flex-1" />}
                        {filterRows.length > 0 && rows.length === 0 && (
                          <EmptyState {...noSearchResults(searchQueries.applications)} className="flex-1" />
                        )}
                        {/* One supporting-text position for the whole filter, across sections (`ApplicationCardGroup`).
                            Open: Action needed → Last 15 days → Older. Not moving forward: Last 15 days → Older, by when
                            each application ended (`lastActivityAt`). */}
                        {rows.length > 0 && (
                          <ApplicationCardGroup>
                            <GroupedList
                              idPrefix={`applications-${id}`}
                              groups={(id === "open" ? OPEN_SECTIONS : HISTORY_SECTIONS).map((section) => ({
                                ...section,
                                rows: rows.filter(
                                  (application) =>
                                    (id === "open" ? openSectionOf(application) : recencyOf(application.lastActivityAt)) ===
                                    section.id,
                                ),
                              }))}
                              renderList={(sectionRows) => <ApplicationList rows={sectionRows} onWithdraw={withdraw} />}
                            />
                          </ApplicationCardGroup>
                        )}
                      </TabButtonPanel>
                    );
                  })}
                </TabButtons>
              )}
            </MetricTabPanel>
            <MetricTabPanel id="offers" className="flex flex-1 flex-col outline-none">
              {/* Nothing under any filter: just the default filter's empty state, no search or filters
                  (DESIGN.md "Hide search and filters when a view is empty"). */}
              {offers.length === 0 ? (
                <EmptyState {...OFFER_EMPTY_STATES.open} className="flex-1" />
              ) : (
                <TabButtons defaultSelectedKey="open" className="flex w-full flex-1 flex-col gap-8">
                  <FilterBar
                    searchLabel="Search offers"
                    {...searchProps("offers")}
                    filtersLabel="Offer filters"
                    filters={OFFER_FILTERS.map(({ id, label }) => ({ id, label, count: offerCountFor(id) }))}
                  />
                  {/* Open: one table list (DESIGN.md "Lists of rows are one table list"). Declining a row collapses it while
                      others remain; declining the last one removes the whole table, and the empty state fades in once that
                      exit finishes (`mode="wait"`), so the two never overlap. */}
                  <TabButtonPanel id="open" className="flex w-full flex-1 flex-col outline-none">
                    <AnimatePresence initial={false} mode="wait">
                      {visibleOpenOffers.length === 0 ? (
                        <motion.div
                          // No open offers at all, or none matching the search.
                          key={openOffers.length === 0 ? "empty" : "no-results"}
                          className="flex w-full flex-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, transition: resolve(standardTransition) }}
                          exit={{ opacity: 0, transition: { duration: 0 } }}
                        >
                          <EmptyState
                            {...(openOffers.length === 0 ? OFFER_EMPTY_STATES.open : noSearchResults(searchQueries.offers))}
                            className="flex-1"
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="list"
                          className="flex w-full flex-col items-start overflow-hidden rounded-card border border-border shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]"
                          variants={cardDismissVariants}
                          initial={false}
                          animate="animate"
                          exit={prefersReducedMotion ? { opacity: 0, transition: { duration: 0.01 } } : "exit"}
                        >
                          <AnimatePresence initial={false}>
                            {visibleOpenOffers.map((offer) => (
                              <motion.div
                                key={offer.key}
                                className="w-full overflow-hidden border-b border-border last:border-b-0"
                                variants={rowDismissVariants}
                                initial={false}
                                animate="animate"
                                exit={
                                  prefersReducedMotion ? { opacity: 0, height: 0, transition: { duration: 0.01 } } : "exit"
                                }
                              >
                                {renderOfferCard(offer)}
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </TabButtonPanel>
                  {/* Closed: `Last 15 days` → `Older` by when each offer closed, most recent first, each its own table list
                      (headings only when both have offers). Rows never leave `Closed`, so there's no exit motion here. */}
                  <TabButtonPanel id="closed" className="flex w-full flex-1 flex-col outline-none">
                    {closedOffers.length === 0 ? (
                      <EmptyState {...OFFER_EMPTY_STATES.closed} className="flex-1" />
                    ) : visibleClosedOffers.length === 0 ? (
                      <EmptyState {...noSearchResults(searchQueries.offers)} className="flex-1" />
                    ) : (
                      <GroupedList
                        idPrefix="offers-closed"
                        groups={HISTORY_SECTIONS.map((section) => ({
                          ...section,
                          rows: visibleClosedOffers.filter((offer) => recencyOf(offerClosedAt(offer)) === section.id),
                        }))}
                        renderList={(sectionOffers) => (
                          <div className="flex w-full flex-col items-start overflow-hidden rounded-card border border-border shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]">
                            {sectionOffers.map((offer) => (
                              <React.Fragment key={offer.key}>
                                {renderOfferCard(offer, "border-b border-border last:border-b-0")}
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                      />
                    )}
                  </TabButtonPanel>
                </TabButtons>
              )}
            </MetricTabPanel>
            <MetricTabPanel id="contracts" className="flex flex-1 flex-col outline-none">
              {/* Nothing under any filter: just the default filter's empty state, no search or filters
                  (DESIGN.md "Hide search and filters when a view is empty"). */}
              {CONTRACTS.length === 0 ? (
                <EmptyState {...CONTRACT_EMPTY_STATES.open} className="flex-1" />
              ) : (
                <TabButtons defaultSelectedKey="open" className="flex w-full flex-1 flex-col gap-8">
                  <FilterBar
                    searchLabel="Search contracts"
                    {...searchProps("contracts")}
                    filtersLabel="Contract filters"
                    filters={CONTRACT_FILTERS.map(({ id, label }) => ({
                      id,
                      label,
                      count: CONTRACTS.filter((contract) => contract.filter === id).length,
                    }))}
                  />
                  {CONTRACT_FILTERS.map(({ id }) => {
                    const filterContracts = CONTRACTS.filter((contract) => contract.filter === id);
                    const contracts = filterContracts.filter((contract) => matchesSearch(contract, searchQueries.contracts));
                    return (
                      <TabButtonPanel key={id} id={id} className="flex w-full flex-1 flex-col outline-none">
                        {filterContracts.length === 0 && <EmptyState {...CONTRACT_EMPTY_STATES[id]} className="flex-1" />}
                        {filterContracts.length > 0 && contracts.length === 0 && (
                          <EmptyState {...noSearchResults(searchQueries.contracts)} className="flex-1" />
                        )}
                        {contracts.length > 0 && (
                          // Same 2-up / 3-up-from-`xl` grid as `Dashboard`'s "Current contracts".
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
              )}
            </MetricTabPanel>
            {/* Assessments has no filters or rows designed yet — just its empty state. */}
            <MetricTabPanel id="assessments" className="flex flex-1 flex-col outline-none">
              <EmptyState {...ASSESSMENTS_EMPTY_STATE} className="flex-1" />
            </MetricTabPanel>
            {/* Talent Network (Figma `node-id=5702-7522`): `Active` / `Completed` filters once there is a membership. */}
            <MetricTabPanel id="talent-network" className="flex flex-1 flex-col outline-none">
              {/* Nothing under any filter: just the default filter's empty state, no search or filters
                  (DESIGN.md "Hide search and filters when a view is empty"). */}
              {TALENT_NETWORK_MEMBERSHIPS.length === 0 ? (
                <EmptyState {...TALENT_NETWORK_EMPTY_STATES.active} className="flex-1" />
              ) : (
                <TabButtons defaultSelectedKey="active" className="flex w-full flex-1 flex-col gap-8">
                  <FilterBar
                    searchLabel="Search talent network"
                    {...searchProps("talent-network")}
                    filtersLabel="Talent network filters"
                    filters={TALENT_NETWORK_FILTERS.map(({ id, label }) => ({ id, label, count: 0 }))}
                  />
                  {TALENT_NETWORK_FILTERS.map(({ id }) => (
                    <TabButtonPanel key={id} id={id} className="flex w-full flex-1 flex-col outline-none">
                      <EmptyState {...TALENT_NETWORK_EMPTY_STATES[id]} className="flex-1" />
                    </TabButtonPanel>
                  ))}
                </TabButtons>
              )}
            </MetricTabPanel>
          </MetricTabs>
        </div>
      </div>
    </div>
  );
}

export { Engagements };

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlignLeft, SearchMd, Share06, XCircle } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { cardDismissVariants, reflowTransition, standardTransition, useMotionPreference } from "@/lib/motion";
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
 * still in contracting) / `Declined` (the Offers history).
 */
const OFFER_FILTERS: { id: OfferFilter; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "declined", label: "Declined" },
];

const FILTERS: { id: ApplicationFilter; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "not-moving-forward", label: "Not moving forward" },
];

/**
 * `Open` is split into sections that answer "what deserves my attention first?" (`engagements.md` §3.1 "Sections").
 * Figma: `Engagements` (`node-id=5672-4301`). The row's status label still says where each application stands.
 */
type OpenSection = "need-action" | "recent" | "older";

// Figma's label reads "Last 15 day"; the spec's "Last 15 days" is used.
const OPEN_SECTIONS: { id: OpenSection; label: string }[] = [
  { id: "need-action", label: "Need action" },
  { id: "recent", label: "Last 15 days" },
  { id: "older", label: "Older" },
];

const RECENT_ACTIVITY_DAYS = 15;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Need action overrides recency: an application waiting on the professional sits in `Need action` however old its
 * last activity is. Every other open application goes by its last meaningful update, measured from `DEMO_TODAY`.
 */
function openSectionOf({
  nextActionOwner,
  lastActivityAt,
}: Pick<(typeof DEMO_APPLICATIONS)[number], "nextActionOwner" | "lastActivityAt">): OpenSection {
  if (nextActionOwner === "professional") return "need-action";
  const daysSinceActivity = (Date.parse(DEMO_TODAY) - Date.parse(lastActivityAt)) / DAY_MS;
  return daysSinceActivity <= RECENT_ACTIVITY_DAYS ? "recent" : "older";
}

/**
 * Talent Network view filters. Figma: Verita → `Talent Network` (`node-id=5702-7522`): `Active` / `Completed`. The
 * prototype has no memberships yet, so both show their empty state.
 */
type TalentNetworkFilter = "active" | "completed";

const TALENT_NETWORK_FILTERS: { id: TalentNetworkFilter; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
];

/**
 * What each view or filter shows when it has nothing to list: the shared `EmptyState` layout, with its own copy (and
 * optional CTA). Figma copy: Contracts → Completed (`node-id=5701-7251`) and Talent Network → Active (`node-id=5702-7522`).
 * Every other entry is draft copy written in the same voice, pending product/design review.
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
  declined: {
    title: "No declined offers",
    description: "Offers you decline will appear here.",
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
  description: "Assessments assigned to you will appear here.",
};

const TALENT_NETWORK_EMPTY_STATES: Record<TalentNetworkFilter, EmptyStateCopy> = {
  active: {
    title: "No talent network applied yet",
    description: "Apply to roles that match your expertise and get considered for future projects.",
    buttonLabel: "Browse roles",
    buttonProps: { onPress: () => {} },
  },
  completed: {
    title: "No completed talent networks",
    description: "Talent networks you're no longer part of will appear here.",
  },
};


type EngagementView = "applications" | "offers" | "contracts" | "assessments" | "talent-network";

/**
 * The search button + filter tabs row shared by every filtered view
 * (`engagements.md` §3.1). Search is the icon button only — no expand yet.
 * `Open` never shows a counter: the view tab's `MetricTab` value already
 * carries that number. Any other filter with a zero count keeps its tab but
 * hides its counter.
 */
function FilterBar({
  searchLabel,
  filtersLabel,
  filters,
}: {
  searchLabel: string;
  filtersLabel: string;
  /** `count` omitted → no counter for that filter (e.g. Applications → Not moving forward). */
  filters: { id: string; label: string; count?: number }[];
}) {
  return (
    <div className="flex items-center gap-4">
      <Button color="secondary" size="sm" iconLeading={SearchMd} aria-label={searchLabel} />
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
 * - Search: icon-only button, no expand behavior yet — the expanded input has
 *   no design and UCL has no `Input` component (§3.1 "Search").
 * - Rows: `ApplicationCard` with the hover-revealed `···` menu (§3 "Row
 *   interaction", `applications-card.md` §4.1), stacked in the same bordered
 *   container as `Dashboard`'s Open applications list.
 * - `Open` sections (§3.1 "Sections"): `Need action` → `Last 15 days` →
 *   `Older`, each its own list under a label. Empty sections are hidden.
 *
 * Reuses `Dashboard`'s sidebar auto-collapse below `lg`.
 */
function Engagements({ navHrefOverrides, defaultView = "applications" }: EngagementsProps = {}) {
  // Starts as the professional last left it on another page (prototype pages remount on every sidebar link).
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(readSidebarCollapsed);
  // An offer declined with its X, here or on `Dashboard`, shows under `Declined` — see `useDeclinedOffers`.
  const { declined, decline } = useDeclinedOffers();
  const { prefersReducedMotion, resolve } = useMotionPreference();
  const offers = applyDeclinedOffers(DEMO_OFFERS, declined);
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
              <TabButtons defaultSelectedKey="open" className="flex w-full flex-1 flex-col gap-8">
                <FilterBar
                  searchLabel="Search applications"
                  filtersLabel="Application filters"
                  // No counters on Applications filters: `Open` repeats the view-tab count, and `Not moving forward` has
                  // none by design direction (`engagements.md` §3.1 "Counts").
                  filters={FILTERS.map(({ id, label }) => ({ id, label }))}
                />

                {FILTERS.map(({ id }) => {
                  const rows = applications.filter((application) => application.filter === id);
                  return (
                    <TabButtonPanel key={id} id={id} className="flex w-full flex-1 flex-col outline-none">
                      {rows.length === 0 && <EmptyState {...APPLICATION_EMPTY_STATES[id]} className="flex-1" />}
                      {/* One supporting-text position for the whole filter, across sections (`ApplicationCardGroup`). */}
                      {rows.length > 0 && id === "open" && (
                        <ApplicationCardGroup>
                          <div className="flex w-full flex-col items-start gap-8">
                            {OPEN_SECTIONS.map((section) => {
                              const sectionRows = rows.filter((application) => openSectionOf(application) === section.id);
                              if (sectionRows.length === 0) return null;
                              const headingId = `applications-open-${section.id}`;
                              return (
                                <section
                                  key={section.id}
                                  aria-labelledby={headingId}
                                  className="flex w-full flex-col items-start gap-2"
                                >
                                  <Typography as="h2" id={headingId} size="sm" className="text-foreground-muted">
                                    {section.label}
                                  </Typography>
                                  <ApplicationList rows={sectionRows} onWithdraw={withdraw} />
                                </section>
                              );
                            })}
                          </div>
                        </ApplicationCardGroup>
                      )}
                      {rows.length > 0 && id !== "open" && (
                        <ApplicationCardGroup>
                          <ApplicationList rows={rows} onWithdraw={withdraw} />
                        </ApplicationCardGroup>
                      )}
                    </TabButtonPanel>
                  );
                })}
              </TabButtons>
            </MetricTabPanel>
            <MetricTabPanel id="offers" className="flex flex-1 flex-col outline-none">
              <TabButtons defaultSelectedKey="open" className="flex w-full flex-1 flex-col gap-8">
                <FilterBar
                  searchLabel="Search offers"
                  filtersLabel="Offer filters"
                  filters={OFFER_FILTERS.map(({ id, label }) => ({ id, label, count: offerCountFor(id) }))}
                />
                {OFFER_FILTERS.map(({ id }) => {
                  const filterOffers = offers.filter((offer) => offer.filter === id);
                  return (
                    <TabButtonPanel key={id} id={id} className="flex w-full flex-1 flex-col outline-none">
                      <div className="flex w-full flex-1 flex-col items-start gap-4">
                        <AnimatePresence initial={false}>
                          {/* Fades in once the last offer's exit (after Decline) finishes, so the two never overlap. */}
                          {filterOffers.length === 0 && (
                            <motion.div
                              key="empty"
                              className="flex w-full flex-1"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1, transition: resolve(standardTransition) }}
                              exit={{ opacity: 0, transition: { duration: 0 } }}
                            >
                              <EmptyState {...OFFER_EMPTY_STATES[id]} className="flex-1" />
                            </motion.div>
                          )}
                          {filterOffers.map(({ key, filter, expirationDate, ...offer }) => (
                            <motion.div
                              key={key}
                              className="w-full"
                              variants={cardDismissVariants}
                              initial={false}
                              animate="animate"
                              exit={prefersReducedMotion ? { opacity: 0, transition: { duration: 0.01 } } : "exit"}
                              // Remaining offers glide into a declined one's slot — only when the list changes, not on sidebar toggles.
                              layout={prefersReducedMotion ? false : "position"}
                              layoutDependency={filterOffers.length}
                              transition={reflowTransition}
                            >
                              <OfferCard
                                {...offer}
                                // A declined offer no longer expires; only open offers show the countdown.
                                expirationDate={filter === "open" ? expirationDate : undefined}
                                onCtaPress={() => {}}
                                rowProps={{ onClick: () => {} }}
                                actionsMenuLabel={`More actions for ${offer.title}`}
                                actionsMenu={
                                  <>
                                    <MenuItem icon={AlignLeft} onAction={() => {}}>
                                      View details
                                    </MenuItem>
                                    {/* Same Decline as `Dashboard`'s offer: moves it to `Declined`. A declined offer can't be declined again. */}
                                    {filter === "open" && (
                                      <MenuItem icon={XCircle} tone="destructive" onAction={() => decline(key)}>
                                        Decline
                                      </MenuItem>
                                    )}
                                  </>
                                }
                                className="w-full rounded-card border border-border shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]"
                              />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </TabButtonPanel>
                  );
                })}
              </TabButtons>
            </MetricTabPanel>
            <MetricTabPanel id="contracts" className="flex flex-1 flex-col outline-none">
              <TabButtons defaultSelectedKey="open" className="flex w-full flex-1 flex-col gap-8">
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
                    <TabButtonPanel key={id} id={id} className="flex w-full flex-1 flex-col outline-none">
                      {contracts.length === 0 && <EmptyState {...CONTRACT_EMPTY_STATES[id]} className="flex-1" />}
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
            </MetricTabPanel>
            {/* Assessments has no filters or rows designed yet — just its empty state. */}
            <MetricTabPanel id="assessments" className="flex flex-1 flex-col outline-none">
              <EmptyState {...ASSESSMENTS_EMPTY_STATE} className="flex-1" />
            </MetricTabPanel>
            {/* Talent Network (Figma `node-id=5702-7522`): `Active` / `Completed` filters, both empty in the prototype. */}
            <MetricTabPanel id="talent-network" className="flex flex-1 flex-col outline-none">
              <TabButtons defaultSelectedKey="active" className="flex w-full flex-1 flex-col gap-8">
                <FilterBar
                  searchLabel="Search talent network"
                  filtersLabel="Talent network filters"
                  filters={TALENT_NETWORK_FILTERS.map(({ id, label }) => ({ id, label, count: 0 }))}
                />
                {TALENT_NETWORK_FILTERS.map(({ id }) => (
                  <TabButtonPanel key={id} id={id} className="flex w-full flex-1 flex-col outline-none">
                    <EmptyState {...TALENT_NETWORK_EMPTY_STATES[id]} className="flex-1" />
                  </TabButtonPanel>
                ))}
              </TabButtons>
            </MetricTabPanel>
          </MetricTabs>
        </div>
      </div>
    </div>
  );
}

export { Engagements };

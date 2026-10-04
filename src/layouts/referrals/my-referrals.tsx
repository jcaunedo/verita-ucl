import * as React from "react";
import { Select, SelectValue } from "react-aria-components";
import { ChevronDown, HelpCircle, Link02 } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { clickableRowProps } from "@/lib/clickable-row";
import { TabUnderlinePanel } from "@/components/navigation/tab-underline";
import { TabButtonPanel, TabButtons } from "@/components/navigation/tab-button";
import { Avatar } from "@/components/data-display/avatar";
import { Badge } from "@/components/data-display/badge";
import { Typography } from "@/components/typography";
import { Button } from "@/components/buttons/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { SelectContent, SelectItem } from "@/components/forms/select";
import { FilterBar } from "@/layouts/shared/filter-bar";
import {
  DEMO_REFERRALS_TODAY,
  REFERRAL_STAGE_TONES,
  isQualifiedStage,
  type DemoReferral,
  type ReferralStage,
} from "@/layouts/shared/demo-referrals";

import { currency, initialsOf, type EmptyStateCopy } from "./referrals-format";

/**
 * The period the page covers (Figma: the "All time" button link at the right of the tabs, Untitled UI's "Dropdowns /
 * Button link"). It narrows the summary and the table to referrals made in that period, measured from the demo's
 * "today". Defaults to `All time`.
 */
type ReferralPeriod = "all" | "today" | "7d" | "30d" | "12m";

const PERIODS: { id: ReferralPeriod; label: string; days?: number }[] = [
  { id: "all", label: "All time" },
  // `days: 0`: referrals made today only (the demo dates count back from the real date).
  { id: "today", label: "Today", days: 0 },
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "12m", label: "Last 12 months", days: 365 },
];

const DAY_MS = 24 * 60 * 60 * 1000;

function inPeriod(referral: DemoReferral, period: ReferralPeriod) {
  const days = PERIODS.find(({ id }) => id === period)?.days;
  if (days === undefined) return true;
  return Date.parse(DEMO_REFERRALS_TODAY) - Date.parse(referral.referredAt) <= days * DAY_MS;
}

/**
 * The five summary figures, in the spec's order (`product-specs/referrals.md` §5.1), worked out from the referrals.
 * The three counts mirror the filters (design direction, 2026-10-03): `Referral sent` (and its filter: the `Referred` stage, not joined yet),
 * `In progress` (Joined, Applied, Hired), and `Qualifying`. The two reward totals cover the stages after that:
 * `Rewards earned` = paid + `Pending payout` (§9.1). All zero until the first referral. Figma's `My referrals` frame
 * shows sample figures that don't match its own rows; these follow the rows.
 */
function summaryOf(referrals: readonly DemoReferral[]) {
  const countFor = (filter: ReferralFilter) => {
    const stages = FILTERS.find(({ id }) => id === filter)?.stages ?? [];
    return String(referrals.filter((referral) => stages.includes(referral.stage)).length);
  };
  const qualified = referrals.filter((referral) => isQualifiedStage(referral.stage));
  const total = (rows: readonly DemoReferral[]) => rows.reduce((sum, referral) => sum + referral.reward, 0);
  return [
    { label: "Referral sent", value: countFor("referred") },
    { label: "In progress", value: countFor("in-progress") },
    { label: "Qualifying", value: countFor("qualifying") },
    { label: "Rewards earned", value: currency.format(total(qualified)) },
    { label: "Pending payout", value: currency.format(total(qualified.filter((r) => r.stage === "Reward earned"))) },
  ];
}

/**
 * My referrals filters (Figma `Tab Group Button`): one per stage group, so each referral is under exactly one besides
 * `All`. `Referred` is people who haven't joined Verita yet; `In progress` is the stages after that and before
 * `Qualifying` (design direction, 2026-10-03).
 */
type ReferralFilter = "all" | "referred" | "in-progress" | "qualifying" | "reward-earned" | "paid";

const FILTERS: { id: ReferralFilter; label: string; stages?: readonly ReferralStage[] }[] = [
  { id: "all", label: "All" },
  { id: "referred", label: "Referral sent", stages: ["Referred"] },
  { id: "in-progress", label: "In progress", stages: ["Joined", "Applied", "Hired"] },
  { id: "qualifying", label: "Qualifying", stages: ["Qualifying"] },
  { id: "reward-earned", label: "Reward earned", stages: ["Reward earned"] },
  { id: "paid", label: "Paid", stages: ["Paid"] },
];

/** A filter with no referrals. Draft copy, in the voice of the Engagements empty states, pending review. */
const FILTER_EMPTY_STATES: Record<Exclude<ReferralFilter, "all">, EmptyStateCopy> = {
  referred: {
    title: "No one waiting to join",
    description: "People you refer appear here until they join Verita.",
  },
  "in-progress": {
    title: "No referrals in progress",
    description: "Referrals appear here once the person joins Verita, while they apply and get hired.",
  },
  qualifying: {
    title: "No one is qualifying yet",
    description: "Referrals appear here once the person starts working toward the qualifying milestone.",
  },
  "reward-earned": {
    title: "No rewards earned yet",
    description: "Referrals appear here when the person meets the qualifying milestone.",
  },
  paid: {
    title: "No rewards paid yet",
    description: "Referrals appear here once their reward has been paid.",
  },
};

const noSearchResults = (query: string): EmptyStateCopy => ({
  title: `No results for “${query.trim()}”`,
  description: "Try a different name, email, or opportunity.",
});

/** `Referred for` (§5.1): the opportunity title, or "General referral". Set when the referral is made and never changes. */
function referredFor(referral: DemoReferral) {
  return referral.opportunityTitle ?? "General referral";
}

/** Search matches the person's name or email, or what they were referred for. */
function matchesSearch(referral: DemoReferral, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [referral.name, referral.email, referredFor(referral)].some((text) => text.toLowerCase().includes(needle));
}

/** The Reward column (§5.1): the amount and where it stands — potential, pending payout, or paid (§9.1). */
function rewardLabel({ reward, stage }: DemoReferral) {
  if (stage === "Paid") return `${currency.format(reward)} paid`;
  if (stage === "Reward earned") return `${currency.format(reward)} pending payout`;
  return `${currency.format(reward)} potential`;
}

/** "Oct 1": month and day, read as a calendar date (no timezone shift). */
function formatShortDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

/**
 * Column tracks shared by the header and every row so the columns line up. Figma (`node-id=6118-25784`, 1324px
 * table): Name 300px, Status 152px, Referred for taking the rest (244px there), Last activity 178px, and Reward 224px,
 * with 48px between columns (24px at `xl` and below, where 48px gaps don't fit). The widths are used as proportions,
 * so the table matches Figma at its width and every column shrinks together below it: Referred for keeps about a
 * fifth of the row instead of being the only column that gives up space. Status never goes below 120px, the
 * widest badge ("Reward earned"), since a badge can't truncate.
 */
const COLUMNS =
  "grid grid-cols-[minmax(0,300fr)_minmax(120px,152fr)_minmax(0,244fr)_minmax(0,178fr)_minmax(0,224fr)] items-center gap-x-6 px-4 2xl:gap-x-12";

/**
 * Figma `Table`: the referrals as one table list (DESIGN.md "Lists of rows are one table list"), with a `card/soft`
 * header row. Each row will open the referral details (no design yet), so it's a clickable row with the `hover-row`
 * fill, like `ApplicationCard`.
 */
function ReferralTable({ rows }: { rows: readonly DemoReferral[] }) {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-card border border-border shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]">
      <div aria-hidden="true" className={cn(COLUMNS, "h-10 bg-tone-neutral-subtle")}>
        {["Name", "Status", "Referred for", "Last activity", "Reward"].map((column) => (
          <Typography key={column} as="span" size="sm" weight="medium" className="truncate">
            {column}
          </Typography>
        ))}
      </div>
      {rows.map((referral) => (
        <div
          key={referral.key}
          className={cn(
            COLUMNS,
            "border-t border-border bg-background py-3.5 outline-none transition-colors duration-160 ease-in-out hover:bg-hover-row focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
          )}
          {...clickableRowProps({ onClick: () => {} })}
        >
          {/* Figma: 40px avatar, 12px gap, then name (`sm -medium`) over email (`sm`, muted). */}
          <div className="flex min-w-0 items-center gap-3">
            <Avatar
              size="lg"
              src={referral.avatarSrc}
              alt=""
              initials={initialsOf(referral.name)}
              className={referral.avatarClassName}
            />
            <div className="flex min-w-0 flex-col">
              <Typography as="span" size="sm" weight="medium" className="truncate">
                {referral.name}
              </Typography>
              <Typography as="span" size="sm" className="truncate text-foreground-muted">
                {referral.email}
              </Typography>
            </div>
          </div>
          {/* Figma `badge`: `md` (24px), `sm` label. */}
          <div className="flex min-w-0">
            <Badge tone={REFERRAL_STAGE_TONES[referral.stage]} label={referral.stage} size="md" />
          </div>
          {/* Plain text, not a link: the whole row opens the details. Long titles truncate to one line (§5.1). */}
          <Typography as="span" size="sm" className="truncate">
            {referredFor(referral)}
          </Typography>
          <Typography as="span" size="sm" className="truncate tabular-nums">
            {formatShortDate(referral.lastActivityAt)}
          </Typography>
          <Typography as="span" size="sm" className="truncate tabular-nums">
            {rewardLabel(referral)}
          </Typography>
        </div>
      ))}
    </div>
  );
}

/**
 * Figma `Metric Tab Group Container`: the summary as one bordered row of figures, divided by 1px rules, each a
 * `sm -medium` label over an `xl -semibold` value (12/16px padding, 7px gap). They're figures, not tabs, so this is a
 * description list rather than `MetricTab`s. A zero value reads in `foreground/subtle`, like an empty `MetricTab`.
 *
 * Each label has a 14px `help-circle` (`icon/subtle`) 4px after it (Figma, 2026-10-03), where a tooltip explaining the
 * figure will go. Until that copy exists the icon is decorative (`aria-hidden`, not focusable); when tooltips land, wrap
 * it in a focusable trigger so keyboard and screen-reader users get the explanation too.
 */
function ReferralSummary({ figures }: { figures: { label: string; value: string }[] }) {
  return (
    <dl className="flex w-full overflow-hidden rounded-card border border-border bg-card shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]">
      {figures.map(({ label, value }) => (
        <div
          key={label}
          className="flex min-w-0 flex-1 flex-col items-start justify-center gap-[7px] border-l border-border px-4 py-3 first:border-l-0"
        >
          <Typography as="dt" size="sm" weight="medium" className="flex max-w-full items-center gap-1">
            <span className="truncate">{label}</span>
            <HelpCircle aria-hidden="true" className="size-3.5 shrink-0 text-icon-subtle" />
          </Typography>
          <Typography
            as="dd"
            size="xl"
            weight="semibold"
            className={cn("tabular-nums", /^\$?0$/.test(value) && "text-foreground-subtle")}
          >
            {value}
          </Typography>
        </div>
      ))}
    </dl>
  );
}

/**
 * The period dropdown (Figma: the "All time" button link at the right of the tabs, Untitled UI's "Dropdowns / Button
 * link"). The page renders it in the tab row and owns its state, since it sits outside the My referrals panel. Figma
 * `button` (link style): `sm -medium` label in `foreground/foreground` with a trailing chevron, no padding. UCL's
 * `link-color` is the same shape in `primary`, so the label color is overridden; it fades to `foreground/muted` on hover
 * like the share modal's links.
 */
function ReferralPeriodSelect({
  period,
  onPeriodChange,
}: {
  period: ReferralPeriod;
  onPeriodChange: (period: ReferralPeriod) => void;
}) {
  return (
    <Select
      aria-label="Referral period"
      selectedKey={period}
      onSelectionChange={(key) => onPeriodChange(key as ReferralPeriod)}
    >
      <Button
        color="link-color"
        size="sm"
        iconTrailing={ChevronDown}
        className="text-foreground hover:text-foreground-muted"
      >
        <SelectValue />
      </Button>
      <SelectContent placement="bottom end">
        {PERIODS.map(({ id, label }) => (
          <SelectItem key={id} id={id}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface MyReferralsPanelProps {
  referrals: readonly DemoReferral[];
  /** The period from the page's `ReferralPeriodSelect`. */
  period: ReferralPeriod;
  onPeriodChange: (period: ReferralPeriod) => void;
  /** Kept by the page, so the query survives switching tabs. */
  searchQuery: string;
  onSearchChange: (query: string) => void;
  /** The empty state's "Share your referral link". */
  onShare: () => void;
  /** The empty state's "or start with your network". */
  onGoToNetwork: () => void;
}

/**
 * Referrals → My referrals (Figma `My referrals`, `node-id=6118-25784`; `My referrals Empty State`, `node-id=6100-5893`;
 * `referrals.md` §5.1): the summary (worked out from the referrals), then search, the `All` / `Referral sent` /
 * `In progress` / `Qualifying` / `Reward earned` / `Paid` filters, and the referrals table. With no referrals, the summary
 * reads zero and the empty state takes the place of the search, filters, and table (DESIGN.md "Hide search and filters
 * when a view is empty"); its "or start with your network" switches to My network. Renders its own tab panel.
 */
function MyReferralsPanel({
  referrals,
  period,
  onPeriodChange,
  searchQuery,
  onSearchChange,
  onShare,
  onGoToNetwork,
}: MyReferralsPanelProps) {
  const periodReferrals = referrals.filter((referral) => inPeriod(referral, period));

  return (
    <TabUnderlinePanel id="referrals" className="flex w-full flex-1 flex-col gap-8 outline-none">
      <ReferralSummary figures={summaryOf(periodReferrals)} />
      {referrals.length > 0 && periodReferrals.length === 0 ? (
        // Referrals exist, just none in this period: the period dropdown above stays, so it can be widened.
        <EmptyState
          title="No referrals in this period"
          description="Choose a longer period to see more of your referrals."
          buttonLabel="Show all time"
          buttonProps={{ onPress: () => onPeriodChange("all") }}
          className="flex-1"
        />
      ) : referrals.length > 0 ? (
        <TabButtons defaultSelectedKey="all" className="flex w-full flex-1 flex-col gap-8">
          {/* Figma `Tab Group Container`: the search, then the filters, 16px apart. No counters. */}
          <FilterBar
            searchLabel="Search referrals"
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            filtersLabel="Referral filters"
            filters={FILTERS.map(({ id, label }) => ({ id, label }))}
          />
          {FILTERS.map(({ id, stages }) => {
            const filterRows = stages
              ? periodReferrals.filter((referral) => stages.includes(referral.stage))
              : periodReferrals;
            const rows = filterRows.filter((referral) => matchesSearch(referral, searchQuery));
            return (
              <TabButtonPanel key={id} id={id} className="flex w-full flex-1 flex-col outline-none">
                {filterRows.length === 0 && id !== "all" && (
                  <EmptyState {...FILTER_EMPTY_STATES[id]} className="flex-1" />
                )}
                {filterRows.length > 0 && rows.length === 0 && (
                  <EmptyState {...noSearchResults(searchQuery)} className="flex-1" />
                )}
                {rows.length > 0 && <ReferralTable rows={rows} />}
              </TabButtonPanel>
            );
          })}
        </TabButtons>
      ) : (
        // Figma: the text group, CTA, and network link stacked 24px apart, centered in the space left below the
        // summary; the text group is 680px wide.
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-6">
          <EmptyState
            title="No referrals yet"
            description="Invite someone to Verita or refer them to a specific opportunity. You’ll be able to track their progress and any rewards here."
            buttonLabel="Share your referral link"
            buttonProps={{ iconLeading: Link02, onPress: onShare }}
            className="max-w-[680px] gap-6"
          />
          {/* Figma `button` (link style, 2026-10-02): `sm -medium` label in `state/link`, no padding. UCL's
            `link-color` is the same shape but in `primary`, so the label color is overridden to `text-link`. */}
          <Button color="link-color" size="sm" onPress={onGoToNetwork} className="text-link">
            or start with your network
          </Button>
        </div>
      )}
    </TabUnderlinePanel>
  );
}

export { MyReferralsPanel, ReferralPeriodSelect, type MyReferralsPanelProps, type ReferralPeriod };

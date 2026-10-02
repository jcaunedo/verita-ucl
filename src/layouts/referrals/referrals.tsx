import * as React from "react";
import { Select, SelectValue, type Key } from "react-aria-components";
import { ChevronDown, HelpCircle, Link02, UploadCloud02 } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { clickableRowProps } from "@/lib/clickable-row";
import { Sidebar, type SidebarProps } from "@/components/navigation/sidebar";
import {
  TabUnderline,
  TabUnderlineList,
  TabUnderlinePanel,
  TabUnderlines,
} from "@/components/navigation/tab-underline";
import { TabButtonPanel, TabButtons } from "@/components/navigation/tab-button";
import { Avatar } from "@/components/data-display/avatar";
import { Badge } from "@/components/data-display/badge";
import { Typography } from "@/components/typography";
import { LinkedInLogo } from "@/components/branding/linkedin-logo";
import { Button } from "@/components/buttons/button";
import { ShareReferralLinkModal } from "@/components/overlays/share-referral-link-modal";
import { Toaster } from "@/components/feedback/toast";
import { EmptyState, type EmptyStateProps } from "@/components/feedback/empty-state";
import { SelectContent, SelectItem } from "@/components/forms/select";
import { FilterBar } from "@/layouts/shared/filter-bar";
import { layoutCanvasPaddingClassName } from "@/layouts/shared/layout-canvas";
import { PageTitle } from "@/layouts/shared/page-title";
import { prototypeAccountMenu } from "@/layouts/shared/prototype-account-menu";
import { useLayoutSidebar } from "@/layouts/shared/use-layout-sidebar";
import {
  DEMO_REFERRAL_LINK,
  DEMO_REFERRALS,
  DEMO_REFERRALS_TODAY,
  REFERRAL_STAGE_TONES,
  isQualifiedStage,
  type DemoReferral,
  type ReferralStage,
} from "@/layouts/shared/demo-referrals";

type ReferralsView = "referrals" | "network";

/** Figma `avatar-users` ×3 on My network: the network → refer → reward story, exported as-is (gradient fill + shadow). */
const NETWORK_ILLUSTRATION = [
  new URL("./images/network-person.svg", import.meta.url).href,
  new URL("./images/network-refer.svg", import.meta.url).href,
  new URL("./images/network-reward.svg", import.meta.url).href,
];

/**
 * One of My network's two import options (Figma: 340px card, `radius/card`, 32px padding, 24px gaps): an icon, a
 * `base -semibold` title over an `sm` description (both `foreground`), and the option's button. Not clickable itself —
 * the button is the action — so it gets no hover or Lift (DESIGN.md "Row hover").
 */
function ImportOption({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex w-[340px] flex-col items-center justify-center gap-6 overflow-hidden rounded-card border border-border bg-background p-8 text-center shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]">
      {/* Figma: the 40px icon sits in an 8px-padded slot. */}
      <div className="flex py-2">{icon}</div>
      <div className="flex w-full flex-col items-center gap-2">
        <Typography as="h3" weight="semibold">
          {title}
        </Typography>
        <Typography size="sm">{description}</Typography>
      </div>
      {action}
    </div>
  );
}

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

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/**
 * The five summary figures, in the spec's order (`product-specs/referrals.md` §5.1), worked out from the referrals:
 * counts by stage, then the reward totals (`Rewards earned` = paid + `Pending payout`, §9.1). All zero until the
 * first referral. Figma's `My referrals` frame shows sample figures that don't match its own rows; these follow the
 * rows.
 */
function summaryOf(referrals: readonly DemoReferral[]) {
  const qualified = referrals.filter((referral) => isQualifiedStage(referral.stage));
  const total = (rows: readonly DemoReferral[]) => rows.reduce((sum, referral) => sum + referral.reward, 0);
  return [
    { label: "Total referrals", value: String(referrals.length) },
    { label: "In progress", value: String(referrals.length - qualified.length) },
    { label: "Qualified", value: String(qualified.length) },
    { label: "Rewards earned", value: currency.format(total(qualified)) },
    { label: "Pending payout", value: currency.format(total(qualified.filter((r) => r.stage === "Reward earned"))) },
  ];
}

/**
 * My referrals filters (Figma `Tab Group Button`): one per stage group, so each referral is under exactly one besides
 * `All`. `In progress` is the stages before `Qualifying`.
 */
type ReferralFilter = "all" | "in-progress" | "qualifying" | "reward-earned" | "paid";

const FILTERS: { id: ReferralFilter; label: string; stages?: readonly ReferralStage[] }[] = [
  { id: "all", label: "All" },
  { id: "in-progress", label: "In progress", stages: ["Referred", "Joined", "Applied", "Hired"] },
  { id: "qualifying", label: "Qualifying", stages: ["Qualifying"] },
  { id: "reward-earned", label: "Reward earned", stages: ["Reward earned"] },
  { id: "paid", label: "Paid", stages: ["Paid"] },
];

type EmptyStateCopy = Pick<EmptyStateProps, "title" | "description">;

/** A filter with no referrals. Draft copy, in the voice of the Engagements empty states, pending review. */
const FILTER_EMPTY_STATES: Record<Exclude<ReferralFilter, "all">, EmptyStateCopy> = {
  "in-progress": {
    title: "No referrals in progress",
    description: "People you refer appear here while they join, apply, and get hired.",
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

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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
          {/* Figma `badge`: `md` (26px), `sm` label. */}
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
 */
function ReferralSummary({ figures }: { figures: { label: string; value: string }[] }) {
  return (
    <dl className="flex w-full overflow-hidden rounded-card border border-border bg-card shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]">
      {figures.map(({ label, value }) => (
        <div
          key={label}
          className="flex min-w-0 flex-1 flex-col items-start justify-center gap-[7px] border-l border-border px-4 py-3 first:border-l-0"
        >
          <Typography as="dt" size="sm" weight="medium" className="truncate">
            {label}
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

interface ReferralsProps {
  /** Passed through to the internal `Sidebar` — see `Dashboard`'s same prop. */
  navHrefOverrides?: SidebarProps["navHrefOverrides"];
  /** The professional's referrals. Defaults to `DEMO_REFERRALS`; the Empty story passes none. */
  referrals?: readonly DemoReferral[];
  /** Tab selected on first render. Defaults to `"referrals"`. */
  defaultView?: ReferralsView;
}

/**
 * Full-page reference layout — Referrals. Figma: Verita → `My referrals` (`node-id=6118-25784`), `My referrals Empty
 * State` (`node-id=6100-5893`), and `My network` (`node-id=6129-12391`). Spec: `product-specs/referrals.md` §5.
 *
 * - Header: title, description, `How it works` (no design yet) and `Share your referral link`, which opens
 *   `ShareReferralLinkModal`. The empty state's `Share your referral link` opens the same modal.
 * - Tabs: `My referrals` (default) and `My network`, as underline tabs (Figma `Tab Group Underline`).
 * - Period: the "All time" dropdown at the right of the tabs (All time / Today / Last 7 days / Last 30 days /
 *   Last 12 months) narrows the summary and the table by referred date. Shown on My referrals once there are
 *   referrals.
 * - My referrals: the summary (worked out from the referrals), then search, the `All` / `In progress` / `Qualifying` /
 *   `Reward earned` / `Paid` filters, and the referrals table. With no referrals, the summary reads zero and the empty
 *   state takes the place of the search, filters, and table (DESIGN.md "Hide search and filters when a view is
 *   empty"); its "or start with your network" switches to My network.
 * - My network: the import options (LinkedIn, or a contact list) under the network illustration. Neither import is
 *   designed yet, so both buttons are stubs.
 */
function Referrals({ navHrefOverrides, referrals = DEMO_REFERRALS, defaultView = "referrals" }: ReferralsProps = {}) {
  const { sidebarCollapsed, handleSidebarCollapsedChange } = useLayoutSidebar();
  const [view, setView] = React.useState<Key>(defaultView);
  // "Upload connections" opens the system file picker through this hidden input. What happens after a file is chosen
  // isn't designed yet, so the choice is dropped (and the input cleared, so the same file can be picked again).
  const csvInputRef = React.useRef<HTMLInputElement>(null);
  const [shareOpen, setShareOpen] = React.useState(false);
  const openShare = () => setShareOpen(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [period, setPeriod] = React.useState<ReferralPeriod>("all");
  const periodReferrals = referrals.filter((referral) => inPeriod(referral, period));

  return (
    <div className="flex min-h-screen w-full items-start bg-white">
      <div className="sticky top-0 shrink-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={handleSidebarCollapsedChange}
          navHrefOverrides={navHrefOverrides}
          accountMenu={prototypeAccountMenu}
          defaultActiveNavKey="referrals"
        />
      </div>
      <div
        className={cn(
          "flex min-w-px flex-1 flex-col items-center self-stretch",
          layoutCanvasPaddingClassName(sidebarCollapsed),
        )}
      >
        <div className="flex w-full max-w-[1400px] flex-1 flex-col items-start gap-8 pt-10 pb-[104px]">
          {/* Figma `Header`: the text group and both actions on one row, `spacing/2` (8px) apart. */}
          <div className="flex w-full items-center gap-2">
            <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
              <PageTitle>Referrals</PageTitle>
              <Typography className="text-foreground-muted">
                Everyone you've referred and where they are on the way to a reward.
              </Typography>
            </div>
            <Button color="secondary" size="sm" iconLeading={HelpCircle} onPress={() => {}}>
              How it works
            </Button>
            <Button size="sm" iconLeading={Link02} onPress={openShare}>
              Share your referral link
            </Button>
          </div>

          <TabUnderlines selectedKey={view} onSelectionChange={setView} className="flex w-full flex-1 flex-col gap-8">
            {/* Figma: the tabs on the left and the period dropdown on the right of one row. */}
            <div className="flex w-full items-center justify-between gap-4">
              {/* Figma `Tab Group Underline`: 4px top padding, 24px between tabs. */}
              <TabUnderlineList aria-label="Referrals views" className="pt-1">
                <TabUnderline id="referrals" label="My referrals" />
                <TabUnderline id="network" label="My network" />
              </TabUnderlineList>
              {/* Only on My referrals, and only once there's something to narrow (DESIGN.md "Hide search and filters
                  when a view is empty"). Figma `button` (link style): `sm -medium` label in `foreground/foreground` with
                  a trailing chevron, no padding. UCL's `link-color` is the same shape in `primary`, so the label color
                  is overridden; it fades to `foreground/muted` on hover like the share modal's links. */}
              {view === "referrals" && referrals.length > 0 && (
                <Select
                  aria-label="Referral period"
                  selectedKey={period}
                  onSelectionChange={(key) => setPeriod(key as ReferralPeriod)}
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
              )}
            </div>

            <TabUnderlinePanel id="referrals" className="flex w-full flex-1 flex-col gap-8 outline-none">
              <ReferralSummary figures={summaryOf(periodReferrals)} />
              {referrals.length > 0 && periodReferrals.length === 0 ? (
                // Referrals exist, just none in this period: the period dropdown above stays, so it can be widened.
                <EmptyState
                  title="No referrals in this period"
                  description="Choose a longer period to see more of your referrals."
                  buttonLabel="Show all time"
                  buttonProps={{ onPress: () => setPeriod("all") }}
                  className="flex-1"
                />
              ) : referrals.length > 0 ? (
                <TabButtons defaultSelectedKey="all" className="flex w-full flex-1 flex-col gap-8">
                  {/* Figma `Tab Group Container`: the search, then the filters, 16px apart. No counters. */}
                  <FilterBar
                    searchLabel="Search referrals"
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
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
                    buttonProps={{ iconLeading: Link02, onPress: openShare }}
                    className="max-w-[680px] gap-6"
                  />
                  {/* Figma `button` (link style, 2026-10-02): `sm -medium` label in `state/link`, no padding. UCL's
                    `link-color` is the same shape but in `primary`, so the label color is overridden to `text-link`. */}
                  <Button color="link-color" size="sm" onPress={() => setView("network")} className="text-link">
                    or start with your network
                  </Button>
                </div>
              )}
            </TabUnderlinePanel>

            {/* Figma `My network`: illustration, text group, and the import options stacked 32px apart, centered in the space
                below the tabs, lifted by 96px of bottom padding. */}
            <TabUnderlinePanel
              id="network"
              className="flex w-full flex-1 flex-col items-center justify-center gap-8 pb-24 outline-none"
            >
              {/* Three 72px circles overlapping by 8px. Each SVG is 80px: the circle plus 4px of drop shadow on every side. */}
              <div aria-hidden="true" className="flex items-start">
                {NETWORK_ILLUSTRATION.map((src) => (
                  <span key={src} className="relative -mr-2 size-[72px] shrink-0 last:mr-0">
                    <img src={src} alt="" className="absolute -inset-1 size-20 max-w-none" />
                  </span>
                ))}
              </div>
              <div className="flex max-w-[680px] flex-col items-center gap-2 text-center">
                <Typography as="h2" size="lg" weight="semibold">
                  Build your network, refer, and earn rewards
                </Typography>
                <Typography className="text-foreground-muted">
                  Import your professional network to find potential matches. You choose who to refer, and no one is
                  contacted automatically. You stay in control of every referral.
                </Typography>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                <ImportOption
                  icon={<LinkedInLogo mark />}
                  title="Import from LinkedIn"
                  description="Bring in your professional network from LinkedIn to get started."
                  action={
                    // Figma: a primary button filled with LinkedIn's blue (`--social-linkedin`), darkened on hover like the
                    // other filled buttons. Opens LinkedIn's "Download your data" page in a new window, where the
                    // professional exports their connections.
                    <Button
                      size="sm"
                      href="https://www.linkedin.com/mypreferences/d/download-my-data"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-social-linkedin hover:bg-[color-mix(in_srgb,var(--social-linkedin)_90%,black)]"
                    >
                      Get my LinkedIn connections
                    </Button>
                  }
                />
                <ImportOption
                  icon={<UploadCloud02 aria-hidden="true" className="size-10 text-foreground" />}
                  title="Upload a contact list"
                  description="Upload connections from another source using a CSV file."
                  action={
                    <>
                      <Button size="sm" onPress={() => csvInputRef.current?.click()}>
                        Upload connections
                      </Button>
                      <input
                        ref={csvInputRef}
                        type="file"
                        accept=".csv,text/csv"
                        aria-label="Upload a CSV file of your connections"
                        tabIndex={-1}
                        className="sr-only"
                        onChange={(event) => {
                          event.currentTarget.value = "";
                        }}
                      />
                    </>
                  }
                />
              </div>
            </TabUnderlinePanel>
          </TabUnderlines>
        </div>
      </div>
      {/* Opened by either "Share your referral link". Focus returns to the button that opened it when it closes. */}
      <ShareReferralLinkModal isOpen={shareOpen} onOpenChange={setShareOpen} link={DEMO_REFERRAL_LINK} />
      {/* Confirms "Copy referral link": bottom right on desktop, bottom center on mobile (the `Toaster` default). */}
      <Toaster />
    </div>
  );
}

export { Referrals, type ReferralsProps };

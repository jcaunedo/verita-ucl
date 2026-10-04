import * as React from "react";
import { Select, SelectValue } from "react-aria-components";
import { ChevronDown, UploadCloud02 } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { clickableRowProps } from "@/lib/clickable-row";
import { TabUnderlinePanel } from "@/components/navigation/tab-underline";
import { TabButtonPanel, TabButtons } from "@/components/navigation/tab-button";
import { Avatar } from "@/components/data-display/avatar";
import { Typography } from "@/components/typography";
import { LinkedInLogo } from "@/components/branding/linkedin-logo";
import { Button } from "@/components/buttons/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { SelectContent, SelectItem } from "@/components/forms/select";
import { FilterBar } from "@/layouts/shared/filter-bar";
import { CONNECTION_ACTIVITIES, type ConnectionActivity, type DemoConnection } from "@/layouts/shared/demo-connections";

import { currency, initialsOf, type EmptyStateCopy } from "./referrals-format";

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
 * My network quick filters (Figma `Tab Group Button`, `referrals.md` §5.2). Unlike My referrals, they aren't exclusive
 * stages: a connection can be both `Referred` and in `New matches`. They're different views of the same network.
 */
type NetworkFilter = "all" | "matches" | "new-matches" | "referred";

const NETWORK_FILTERS: { id: NetworkFilter; label: string; includes: (connection: DemoConnection) => boolean }[] = [
  { id: "all", label: "All", includes: () => true },
  { id: "matches", label: "Matches", includes: (connection) => connection.matches > 0 },
  { id: "new-matches", label: "New matches", includes: (connection) => Boolean(connection.newMatch) },
  { id: "referred", label: "Referred", includes: (connection) => connection.referrals > 0 },
];

/** A network filter with no connections. Draft copy, in the voice of the My referrals empty states, pending review. */
const NETWORK_FILTER_EMPTY_STATES: Record<Exclude<NetworkFilter, "all">, EmptyStateCopy> = {
  matches: {
    title: "No current matches",
    description: "Connections appear here when they match an open opportunity.",
  },
  "new-matches": {
    title: "No new matches",
    description: "Connections appear here when a new opportunity matches them.",
  },
  referred: {
    title: "No one referred yet",
    description: "Connections you refer appear here, with their referrals and what they’ve earned.",
  },
};

/** The activity dropdown (§5.2): `All activity` (no restriction), then each activity event (§8). */
type ActivityFilter = "all" | ConnectionActivity;

const ACTIVITY_FILTERS: { id: ActivityFilter; label: string }[] = [
  { id: "all", label: "All activity" },
  ...CONNECTION_ACTIVITIES.map((activity) => ({ id: activity, label: activity })),
];

/** Search by name, job title, and email as a fallback (§5.2). */
function connectionMatchesSearch(connection: DemoConnection, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [connection.name, connection.jobTitle, connection.email].some((text) => text.toLowerCase().includes(needle));
}

/** `Matches` (§5.2): a neutral count of current opportunities, never a "best match". */
function matchesLabel(matches: number) {
  if (matches === 0) return "No current matches";
  return `${matches} ${matches === 1 ? "opportunity" : "opportunities"}`;
}

/**
 * Figma (`node-id=6156-5828`, 1324px table): Name 300px, Matches 198px, Last activity 179px, Referrals 80px, and Earned
 * and Potential sharing the rest (147px each there), with 48px between columns (24px at `xl` and below). Used as
 * proportions, like the referrals table, so every column shrinks together below Figma's width. Matches never goes below
 * 132px, Last activity below 144px, and Referrals below 68px, so "No current matches", "New match surfaced", and the
 * "Referrals" header always fit on one line.
 */
const NETWORK_COLUMNS =
  "grid grid-cols-[minmax(0,300fr)_minmax(132px,198fr)_minmax(144px,179fr)_minmax(68px,80fr)_minmax(0,147fr)_minmax(0,147fr)] items-center gap-x-6 px-4 2xl:gap-x-12";

/**
 * Figma `Table` on `My network`: one row per connection (§5.2), as one table list (DESIGN.md "Lists of rows are one
 * table list"). Text columns are left aligned and number columns right aligned, with tabular figures. Each row will
 * open the connection detail (no design yet), so it's a clickable row with the `hover-row` fill. A connection with no
 * current matches shows `—` for Potential (an open decision in §5.2: `—` or `$0`), and one with no activity yet shows `—`
 * for Last activity.
 */
function ConnectionTable({
  rows,
  loadingRows = 0,
}: {
  rows: readonly DemoConnection[];
  /** Skeleton rows at the end while the next page loads. */
  loadingRows?: number;
}) {
  return (
    <div
      aria-busy={loadingRows > 0 || undefined}
      className="flex w-full flex-col overflow-hidden rounded-card border border-border shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]"
    >
      <div aria-hidden="true" className={cn(NETWORK_COLUMNS, "h-10 bg-tone-neutral-subtle")}>
        {["Name", "Matches", "Last activity", "Referrals", "Earned", "Potential"].map((column, index) => (
          <Typography
            key={column}
            as="span"
            size="sm"
            weight="medium"
            className={cn("truncate", index >= 3 && "text-right")}
          >
            {column}
          </Typography>
        ))}
      </div>
      {rows.map((connection) => (
        <div
          key={connection.key}
          className={cn(
            NETWORK_COLUMNS,
            "border-t border-border bg-background py-3.5 outline-none transition-colors duration-160 ease-in-out hover:bg-hover-row focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
          )}
          {...clickableRowProps({ onClick: () => {} })}
        >
          {/* Figma: 40px avatar, 12px gap, then name (`sm -medium`) over job title (`sm`, muted). */}
          <div className="flex min-w-0 items-center gap-3">
            <Avatar
              size="lg"
              src={connection.avatarSrc}
              alt=""
              initials={initialsOf(connection.name)}
              className={connection.avatarClassName}
            />
            <div className="flex min-w-0 flex-col">
              <Typography as="span" size="sm" weight="medium" className="truncate">
                {connection.name}
              </Typography>
              <Typography as="span" size="sm" className="truncate text-foreground-muted">
                {connection.jobTitle}
              </Typography>
            </div>
          </div>
          <Typography as="span" size="sm" className="truncate">
            {matchesLabel(connection.matches)}
          </Typography>
          <Typography as="span" size="sm" className="truncate">
            {connection.lastActivity ?? "—"}
          </Typography>
          <Typography as="span" size="sm" className="truncate text-right tabular-nums">
            {connection.referrals}
          </Typography>
          <Typography as="span" size="sm" className="truncate text-right tabular-nums">
            {currency.format(connection.earned)}
          </Typography>
          <Typography as="span" size="sm" className="truncate text-right tabular-nums">
            {connection.matches > 0 ? currency.format(connection.potential) : "—"}
          </Typography>
        </div>
      ))}
      {Array.from({ length: loadingRows }, (_, index) => (
        <ConnectionSkeletonRow key={index} />
      ))}
    </div>
  );
}

/**
 * A placeholder row while more connections load: the table row's layout (40px avatar, two lines, then each column's
 * value) in `muted` shapes, with a subtle opacity pulse (CLAUDE.md "Skeletons and Loading States"). The pulse stops
 * under reduced motion; the screen-reader status in `ConnectionList` still announces the load.
 */
function ConnectionSkeletonRow() {
  const bar = "h-3.5 rounded-full bg-muted";
  return (
    <div
      aria-hidden="true"
      data-slot="connection-skeleton"
      className={cn(
        NETWORK_COLUMNS,
        "animate-pulse border-t border-border bg-background py-3.5 motion-reduce:animate-none",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="size-10 shrink-0 rounded-full bg-muted" />
        <div className="flex min-w-0 flex-1 flex-col gap-2 py-1">
          <div className={cn(bar, "w-28 max-w-full")} />
          <div className={cn(bar, "w-36 max-w-full")} />
        </div>
      </div>
      <div className={cn(bar, "w-24 max-w-full")} />
      <div className={cn(bar, "w-28 max-w-full")} />
      <div className={cn(bar, "ml-auto w-6")} />
      <div className={cn(bar, "ml-auto w-12")} />
      <div className={cn(bar, "ml-auto w-14")} />
    </div>
  );
}

/** Connections shown per page of the simulated infinite scroll. */
const PAGE_SIZE = 20;
/** How long the prototype pretends the next page takes to load. */
const SIMULATED_LOAD_MS = 800;
/** Skeleton rows shown while a page loads. */
const LOADING_ROWS = 3;

/**
 * The connection table with a simulated infinite scroll (design direction, 2026-10-03): the first `PAGE_SIZE` rows,
 * then, when the end of the list comes within 200px of the viewport, `LOADING_ROWS` skeleton rows for
 * `SIMULATED_LOAD_MS` before the next page appends, until every row is shown. A real app would fetch the next page
 * here. Remount it (a `key`) to start again from the first page, e.g. when the filters or search change.
 */
function ConnectionList({ rows }: { rows: readonly DemoConnection[] }) {
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);
  const [isLoading, setLoading] = React.useState(false);
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const hasMore = visibleCount < rows.length;

  // Watch the end of the list; reaching it starts loading the next page. Re-armed after each page.
  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isLoading) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setLoading(true);
      },
      { rootMargin: "0px 0px 200px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, visibleCount]);

  // The simulated fetch: after the delay, the next page appends.
  React.useEffect(() => {
    if (!isLoading) return;
    const timer = window.setTimeout(() => {
      setVisibleCount((count) => count + PAGE_SIZE);
      setLoading(false);
    }, SIMULATED_LOAD_MS);
    return () => window.clearTimeout(timer);
  }, [isLoading]);

  return (
    <div className="flex w-full flex-col">
      <ConnectionTable rows={rows.slice(0, visibleCount)} loadingRows={isLoading ? LOADING_ROWS : 0} />
      {/* What the scroll watches: the end of the list. */}
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />
      <span role="status" className="sr-only">
        {isLoading ? "Loading more connections" : ""}
      </span>
    </div>
  );
}

interface MyNetworkPanelProps {
  /** The professional's network. Empty shows the import options. */
  connections: readonly DemoConnection[];
  /** "Upload connections" on the empty state. The prototype imports the demo network. */
  onImport: () => void;
  /** Kept by the page, so they survive switching tabs. */
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activity: ActivityFilter;
  onActivityChange: (activity: ActivityFilter) => void;
}

/**
 * Referrals → My network (`referrals.md` §5.2). Renders its own tab panel.
 *
 * - No connections (Figma `My network`, `node-id=6129-12391`): the import options (LinkedIn, or a contact list) under
 *   the network illustration. "Get my LinkedIn connections" opens LinkedIn's data download page; "Upload connections"
 *   calls `onImport` (the import itself isn't designed yet).
 * - With connections (Figma `My network`, `node-id=6156-5828`): no summary figures (the tab counter carries the network
 *   size), straight to search, the `All` / `Matches` / `New matches` / `Referred` filters and the `All activity`
 *   dropdown, then one row per connection (`ConnectionTable`).
 */
function MyNetworkPanel({
  connections,
  onImport,
  searchQuery,
  onSearchChange,
  activity,
  onActivityChange,
}: MyNetworkPanelProps) {
  return connections.length > 0 ? (
    <TabUnderlinePanel id="network" className="flex w-full flex-1 flex-col outline-none">
      {/* Figma `My network` (`node-id=6156-5828`): no summary figures (the tab counter carries the network
          size), straight to search, the quick filters, and the activity dropdown, then the table (§5.2). */}
      <TabButtons defaultSelectedKey="all" className="flex w-full flex-1 flex-col gap-8">
        {/* Figma `Tab Group Container`: search and filters on the left, the activity dropdown on the right. */}
        <div className="flex w-full items-center justify-between gap-4">
          <FilterBar
            searchLabel="Search connections"
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            filtersLabel="Connection filters"
            filters={NETWORK_FILTERS.map(({ id, label }) => ({ id, label }))}
          />
          {/* Secondary to the filters (§5.2). The same link-style dropdown as My referrals' period dropdown. */}
          <Select
            aria-label="Activity"
            selectedKey={activity}
            onSelectionChange={(key) => onActivityChange(key as ActivityFilter)}
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
              {ACTIVITY_FILTERS.map(({ id, label }) => (
                <SelectItem key={id} id={id}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {NETWORK_FILTERS.map(({ id, includes }) => {
          const filterRows = connections.filter(includes);
          const activityRows = filterRows.filter(
            (connection) => activity === "all" || connection.lastActivity === activity,
          );
          const rows = activityRows.filter((connection) => connectionMatchesSearch(connection, searchQuery));
          return (
            <TabButtonPanel key={id} id={id} className="flex w-full flex-1 flex-col outline-none">
              {filterRows.length === 0 && id !== "all" && (
                <EmptyState {...NETWORK_FILTER_EMPTY_STATES[id]} className="flex-1" />
              )}
              {filterRows.length > 0 && activityRows.length === 0 && (
                <EmptyState
                  title="No connections with this activity"
                  description="Choose another activity, or show all activity."
                  buttonLabel="Show all activity"
                  buttonProps={{ onPress: () => onActivityChange("all") }}
                  className="flex-1"
                />
              )}
              {activityRows.length > 0 && rows.length === 0 && (
                <EmptyState
                  title={`No results for “${searchQuery.trim()}”`}
                  description="Try a different name, job title, or email."
                  className="flex-1"
                />
              )}
              {rows.length > 0 && (
                // A new filter, activity, or search starts again from the first page.
                <ConnectionList key={`${activity}|${searchQuery.trim().toLowerCase()}`} rows={rows} />
              )}
            </TabButtonPanel>
          );
        })}
      </TabButtons>
    </TabUnderlinePanel>
  ) : (
    /* Figma `My network`: illustration, text group, and the import options stacked 32px apart, centered in the
     space below the tabs, lifted by 96px of bottom padding. */
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
          Import your professional network to find potential matches. You choose who to refer, and no one is contacted
          automatically. You stay in control of every referral.
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
            // Prototype: imports the demo network and shows it (design direction, 2026-10-03).
            <Button size="sm" onPress={onImport}>
              Upload connections
            </Button>
          }
        />
      </div>
    </TabUnderlinePanel>
  );
}

export { MyNetworkPanel, type ActivityFilter, type MyNetworkPanelProps };

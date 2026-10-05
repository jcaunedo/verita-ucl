import * as React from "react";
import { type Key } from "react-aria-components";
import { HelpCircle, Link02 } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { Sidebar, type SidebarProps } from "@/components/navigation/sidebar";
import { TabUnderline, TabUnderlineList, TabUnderlines } from "@/components/navigation/tab-underline";
import { Typography } from "@/components/typography";
import { Button } from "@/components/buttons/button";
import { ShareReferralLinkModal } from "@/components/overlays/share-referral-link-modal";
import { Toaster } from "@/components/feedback/toast";
import { layoutCanvasPaddingClassName } from "@/layouts/shared/layout-canvas";
import { PageTitle } from "@/layouts/shared/page-title";
import { prototypeAccountMenu } from "@/layouts/shared/prototype-account-menu";
import { useLayoutSidebar } from "@/layouts/shared/use-layout-sidebar";
import { DEMO_REFERRAL_LINK, DEMO_REFERRALS, type DemoReferral } from "@/layouts/shared/demo-referrals";
import { DEMO_CONNECTIONS, type DemoConnection } from "@/layouts/shared/demo-connections";

import { MyReferralsPanel, ReferralPeriodSelect, type ReferralPeriod } from "./my-referrals";
import { MyNetworkPanel, type ActivityFilter } from "./my-network";

type ReferralsView = "referrals" | "network";

interface ReferralsProps {
  /** Passed through to the internal `Sidebar` — see `Dashboard`'s same prop. */
  navHrefOverrides?: SidebarProps["navHrefOverrides"];
  /**
   * The professional's referrals on first render. Defaults to none: the page starts on both empty states, and "Upload
   * connections" on My network brings in `DEMO_REFERRALS` with the network.
   */
  defaultReferrals?: readonly DemoReferral[];
  /** Tab selected on first render. Defaults to `"referrals"`. */
  defaultView?: ReferralsView;
  /** The professional's network on first render. Defaults to none, so My network opens on its empty state. */
  defaultConnections?: readonly DemoConnection[];
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
 * - My referrals: `MyReferralsPanel` (`my-referrals.tsx`).
 * - My network: `MyNetworkPanel` (`my-network.tsx`).
 *
 * Both tabs start empty. "Upload connections" on My network's empty state fills both: the demo network
 * (`DEMO_CONNECTIONS`) and the demo referrals (`DEMO_REFERRALS`).
 *
 * The page owns the state the tabs share or keep across tab switches: the selected tab, the period, each tab's search,
 * the activity filter, and the network itself.
 */
function Referrals({
  navHrefOverrides,
  defaultReferrals = [],
  defaultView = "referrals",
  defaultConnections = [],
}: ReferralsProps = {}) {
  const { sidebarCollapsed, handleSidebarCollapsedChange } = useLayoutSidebar();
  const [view, setView] = React.useState<Key>(defaultView);
  // My network's connections. Empty until "Upload connections" imports the demo network (design direction, 2026-10-03):
  // the prototype skips the file picker and the import itself, which aren't designed yet.
  const [connections, setConnections] = React.useState<readonly DemoConnection[]>(defaultConnections);
  // The referrals, empty by default like the network. The import fills both (design direction, 2026-10-03), so the
  // prototype goes from a brand-new professional to one with a network and referrals in one step.
  const [referrals, setReferrals] = React.useState<readonly DemoReferral[]>(defaultReferrals);
  const [networkSearchQuery, setNetworkSearchQuery] = React.useState("");
  const [activity, setActivity] = React.useState<ActivityFilter>("all");
  const [shareOpen, setShareOpen] = React.useState(false);
  const openShare = () => setShareOpen(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [period, setPeriod] = React.useState<ReferralPeriod>("all");

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
                Track your referrals, their progress, and the rewards you earn.
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
                {/* Counters (Figma, 2026-10-03): every referral, whatever the period; and every connection in the network. */}
                <TabUnderline id="referrals" label="My referrals" count={referrals.length} />
                <TabUnderline id="network" label="My network" count={connections.length} />
              </TabUnderlineList>
              {/* Only on My referrals, and only once there's something to narrow (DESIGN.md "Hide search and filters
                  when a view is empty"). */}
              {view === "referrals" && referrals.length > 0 && (
                <ReferralPeriodSelect period={period} onPeriodChange={setPeriod} />
              )}
            </div>

            <MyReferralsPanel
              referrals={referrals}
              period={period}
              onPeriodChange={setPeriod}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onShare={openShare}
              onGoToNetwork={() => setView("network")}
            />
            <MyNetworkPanel
              connections={connections}
              onImport={() => {
                setConnections(DEMO_CONNECTIONS);
                setReferrals(DEMO_REFERRALS);
              }}
              searchQuery={networkSearchQuery}
              onSearchChange={setNetworkSearchQuery}
              activity={activity}
              onActivityChange={setActivity}
            />
          </TabUnderlines>
        </div>
      </div>
      {/* Opened by either "Share your referral link". Focus returns to the button that opened it when it closes. */}
      {/* "Share by email" suggests the professional's network: none until it's imported on My network. */}
      <ShareReferralLinkModal
        isOpen={shareOpen}
        onOpenChange={setShareOpen}
        link={DEMO_REFERRAL_LINK}
        inviterName="Theresa"
        connections={connections}
      />
      {/* Confirms "Copy referral link": bottom right on desktop, bottom center on mobile (the `Toaster` default). */}
      <Toaster />
    </div>
  );
}

export { Referrals, type ReferralsProps };

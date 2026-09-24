import * as React from "react";

import type { DEMO_APPLICATIONS, DEMO_OFFERS } from "@/layouts/shared/demo-engagements";

/**
 * Prototype-only state shared across layouts. Each layout is its own
 * Storybook story, and moving between them reloads the iframe, so plain
 * React state can't carry an action from one page to the next. The
 * professional's choices live in `sessionStorage` instead: they survive
 * clicking between stories in the same tab, and reset when the tab closes.
 * Every storage access is guarded, so a blocked or unavailable storage just
 * falls back to the untouched demo data.
 */

const STORAGE_PREFIX = "verita-prototype:";
const DECLINED_OFFERS_KEY = `${STORAGE_PREFIX}declined-offers`;
const WITHDRAWN_APPLICATIONS_KEY = `${STORAGE_PREFIX}withdrawn-applications`;
const SIDEBAR_COLLAPSED_KEY = `${STORAGE_PREFIX}sidebar-collapsed`;

function readDeclinedOffers(): Set<string> {
  try {
    const raw = window.sessionStorage.getItem(DECLINED_OFFERS_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeDeclinedOffers(keys: Set<string>) {
  try {
    window.sessionStorage.setItem(DECLINED_OFFERS_KEY, JSON.stringify([...keys]));
  } catch {
    // Storage unavailable: the decline still applies on this page, it just won't carry over.
  }
}

/** Offers the professional declined in this tab, plus `decline` to add one. */
function useDeclinedOffers() {
  const [declined, setDeclined] = React.useState(readDeclinedOffers);

  const decline = React.useCallback((key: string) => {
    setDeclined((current) => {
      const next = new Set(current).add(key);
      writeDeclinedOffers(next);
      return next;
    });
  }, []);

  return { declined, decline };
}

type DemoOffer = (typeof DEMO_OFFERS)[number];

/** `offers` with every declined one moved to the `Declined` filter (`engagements.md` §4.1). */
function applyDeclinedOffers<T extends DemoOffer>(offers: readonly T[], declined: Set<string>): T[] {
  return offers.map((offer) => (declined.has(offer.key) ? { ...offer, filter: "declined" } : offer));
}

/** Withdrawn applications, as application key → ISO date it was withdrawn. */
type WithdrawnApplications = Record<string, string>;

function readWithdrawnApplications(): WithdrawnApplications {
  try {
    const raw = window.sessionStorage.getItem(WITHDRAWN_APPLICATIONS_KEY);
    return raw ? (JSON.parse(raw) as WithdrawnApplications) : {};
  } catch {
    return {};
  }
}

/** Applications the professional withdrew in this tab, plus `withdraw` to add one (dated today). */
function useWithdrawnApplications() {
  const [withdrawn, setWithdrawn] = React.useState(readWithdrawnApplications);

  const withdraw = React.useCallback((key: string) => {
    setWithdrawn((current) => {
      const next = { ...current, [key]: new Date().toISOString() };
      try {
        window.sessionStorage.setItem(WITHDRAWN_APPLICATIONS_KEY, JSON.stringify(next));
      } catch {
        // Storage unavailable: the withdrawal still applies on this page, it just won't carry over.
      }
      return next;
    });
  }, []);

  return { withdrawn, withdraw };
}

type DemoApplication = (typeof DEMO_APPLICATIONS)[number];

/**
 * `applications` with every withdrawn one moved to `Not moving forward`
 * (`engagements.md` §3.1) as `Withdrawn` (neutral badge) with "Withdrawn by
 * you on {date}" (`applications-card.md` §2.4.1). Withdrawn rows come first,
 * most recent first — the likely `Not moving forward` sort, still an open
 * decision in §3.1.
 */
function applyWithdrawnApplications<T extends DemoApplication>(
  applications: readonly T[],
  withdrawn: WithdrawnApplications,
): T[] {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const updated = applications.map((application) => {
    const withdrawnAt = withdrawn[application.key];
    if (!withdrawnAt) return application;
    return {
      ...application,
      filter: "not-moving-forward" as const,
      statusLabel: "Withdrawn",
      statusTone: "neutral" as const,
      supportingText: `Withdrawn by you on ${formatDate(withdrawnAt)}`,
    };
  });
  const withdrawnAtOf = (application: T) => withdrawn[application.key] ?? "";
  return [...updated].sort((a, b) => withdrawnAtOf(b).localeCompare(withdrawnAtOf(a)));
}

/**
 * The sidebar's collapsed state as the professional last set it. Every
 * sidebar link opens another page (story), which remounts the layout, so
 * without this a collapsed sidebar re-expanded on each click. Layouts read
 * it for their initial state and save only manual toggles, never their own
 * below-`lg` auto-collapse, so a wide screen doesn't open collapsed just
 * because the last page was narrow.
 */
function readSidebarCollapsed(): boolean {
  try {
    return window.sessionStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
  } catch {
    return false;
  }
}

function saveSidebarCollapsed(collapsed: boolean) {
  try {
    window.sessionStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
  } catch {
    // Storage unavailable: the sidebar just starts expanded on the next page.
  }
}

/**
 * The prototype's starting page: the populated `Dashboard` story, opened
 * full-screen. Relative so it works on any Storybook host (local or Netlify).
 */
const PROTOTYPE_START_HREF = "iframe.html?id=layouts-dashboard--default&viewMode=story";

/**
 * Restarts the prototype from scratch — the account menu's "Restart
 * prototype" item. Clears everything the professional did that outlives a
 * page (declined offers, withdrawn applications, sidebar collapse), then opens the starting page, which also
 * resets in-page state (dismissed next steps, sidebar collapse, selected
 * tabs).
 */
function restartPrototype() {
  try {
    const storage = window.sessionStorage;
    for (const key of Object.keys(storage)) {
      if (key.startsWith(STORAGE_PREFIX)) storage.removeItem(key);
    }
  } catch {
    // Storage unavailable: nothing was persisted, so opening the start page is already a fresh start.
  }
  window.location.assign(PROTOTYPE_START_HREF);
}

export {
  useDeclinedOffers,
  applyDeclinedOffers,
  useWithdrawnApplications,
  applyWithdrawnApplications,
  readSidebarCollapsed,
  saveSidebarCollapsed,
  restartPrototype,
};

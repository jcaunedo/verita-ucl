import * as React from "react";

import type { DEMO_OFFERS } from "@/layouts/shared/demo-engagements";

/**
 * Prototype-only state shared across layouts. Each layout is its own
 * Storybook story, and moving between them reloads the iframe, so plain
 * React state can't carry an action from one page to the next. The
 * professional's choices live in `sessionStorage` instead: they survive
 * clicking between stories in the same tab, and reset when the tab closes.
 * Every storage access is guarded, so a blocked or unavailable storage just
 * falls back to the untouched demo data.
 */

const DECLINED_OFFERS_KEY = "verita-prototype:declined-offers";

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

export { useDeclinedOffers, applyDeclinedOffers };

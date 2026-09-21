import * as React from "react";

/**
 * Tracks whether a CSS media query currently matches, via
 * `useSyncExternalStore` so it stays correct across SSR (server snapshot is
 * always `false` — assumes mobile/no-match until hydration confirms
 * otherwise, avoiding a `window`/`matchMedia` reference during SSR) and
 * concurrent rendering. Re-subscribes if `query` changes.
 */
function useMediaQuery(query: string): boolean {
  const getSnapshot = React.useCallback(() => {
    return window.matchMedia(query).matches;
  }, [query]);

  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", onStoreChange);
      return () => mediaQueryList.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  return React.useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export { useMediaQuery };

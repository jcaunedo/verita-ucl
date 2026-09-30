import * as React from "react";

import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { mediaAbove } from "@/lib/breakpoints";
import { readSidebarCollapsed, saveSidebarCollapsed } from "@/layouts/shared/demo-state";

/**
 * The page shell's sidebar state, shared by every layout (DESIGN.md "Page
 * shell responsiveness"). Pass the result to `Sidebar`'s `collapsed` /
 * `onCollapsedChange` and to `layoutCanvasPaddingClassName`.
 *
 * It starts as the professional last left it on another page (prototype pages
 * remount on every sidebar link). At `lg` (1024px) and below the sidebar
 * auto-collapses — including on initial load at a narrow width, not only when
 * resizing into that range. Crossing back above `lg` restores whatever state
 * the sidebar was in *before* the auto-collapse, but only if the current
 * collapse was the automatic one: if the professional collapsed it themselves
 * while already at or below `lg`, that choice sticks after crossing back above
 * `lg`. `wasAutoCollapsedRef` tells the two apart, so the restore only ever
 * undoes this hook's own action. Any manual toggle — collapse or expand —
 * clears the flag, promoting the current state to user-owned.
 */
function useLayoutSidebar() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(readSidebarCollapsed);
  const isLgUp = useMediaQuery(mediaAbove("lg"));
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

  const handleSidebarCollapsedChange = React.useCallback((collapsed: boolean) => {
    wasAutoCollapsedRef.current = false;
    setSidebarCollapsed(collapsed);
    saveSidebarCollapsed(collapsed);
  }, []);

  return { sidebarCollapsed, handleSidebarCollapsedChange };
}

export { useLayoutSidebar };

import * as React from "react";

import { SearchField } from "@/components/forms/search-field";
import { TabButton, TabButtonList } from "@/components/navigation/tab-button";

/**
 * The search button + filter tabs row shared by every filtered list (Engagements views, Referrals → My referrals;
 * `engagements.md` §3.1). Search is a `SearchField`: a search button that expands into an input and narrows the
 * selected filter's rows. The default filter (id `open`) never shows a counter, because the view's own total already
 * carries that number. Any other filter with a zero count keeps its tab but hides its counter. Render inside the
 * view's `TabButtons`.
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

export { FilterBar };

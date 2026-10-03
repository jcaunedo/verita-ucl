import type { EmptyStateProps } from "@/components/feedback/empty-state";

/** Whole-dollar USD, e.g. "$1,050". Shared by My referrals and My network. */
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/** "Olivia Smith" → "OS", for initials avatars. */
function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** The title and description of a filter or search empty state. */
type EmptyStateCopy = Pick<EmptyStateProps, "title" | "description">;

export { currency, initialsOf, type EmptyStateCopy };

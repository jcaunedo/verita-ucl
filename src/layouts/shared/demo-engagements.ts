import { partnerLogos } from "@/assets/logos";
import type { ApplicationCardProps } from "@/components/cards/application-card";
import type { ContractCardProps } from "@/components/cards/contract-card";
import type { OfferCardProps } from "@/components/cards/offer-card";

/**
 * Demo data for one professional, shared by `Dashboard` and `Engagements` so
 * the prototype tells one story: the applications, offer, and contracts on
 * Home are the same ones the Engagements views list. Dates assume "today" is
 * late September 2026.
 */

type ApplicationFilter = "open" | "not-moving-forward";

/** Who the application is waiting on (`engagements.md` §3, §9). */
type NextActionOwner = "professional" | "verita" | "partner";

/**
 * The fixed "today" the demo's recency groups are measured from, so rows don't drift from `Last 15 days` into
 * `Older` as real time passes.
 */
const DEMO_TODAY = "2026-09-25";

type DemoApplication = Pick<
  ApplicationCardProps,
  | "title"
  | "company"
  | "logoSrc"
  | "logoAlt"
  | "partnerName"
  | "compensation"
  | "engagementTerms"
  | "duration"
  | "statusLabel"
  | "statusTone"
  | "supportingText"
> & {
  key: string;
  filter: ApplicationFilter;
  nextActionOwner: NextActionOwner;
  /** Last meaningful update (`engagements.md` §9), ISO date. Places an `Open` row in `Last 15 days` or `Older`. */
  lastActivityAt: string;
};

/**
 * Applications grouped by filter, per `product-specs/engagements.md` §3.1
 * (Open: Applied, Action required, Interview · Action required, Interview
 * scheduled, In review, On hold; Not moving forward: Not selected, Withdrawn,
 * Closed). An application with an offer leaves Applications for Offers (§2),
 * so there are no `Offer received` rows. Demo mix: one `Action required`, one
 * `Interview scheduled`, the rest `Applied` (plain `Applied` has no supporting
 * text, `applications-card.md` §2.4.1).
 *
 * Listed in `Open`'s default sort (§3.1 "Default sort"): action required,
 * then interview scheduled, then applied. Consumers rely on this order
 * instead of sorting.
 *
 * Activity dates spread the `Open` rows across Engagements' sections (§3.1
 * "Sections"). The `Action required` row is 22 days old on purpose: it still
 * sits in `Action needed`, because Action needed overrides recency.
 */
const DEMO_APPLICATIONS: DemoApplication[] = [
  {
    key: "senior-financial-analyst",
    filter: "open",
    nextActionOwner: "professional",
    lastActivityAt: "2026-09-03",
    title: "Senior Financial Analyst",
    company: "verita",
    partnerName: "Verita partner",
    compensation: "$95–115k/yr",
    engagementTerms: "32 hrs/week",
    duration: "1 year",
    statusLabel: "Action required",
    statusTone: "warning",
    supportingText: "Complete your assessment (2 of 4 steps completed)",
  },
  {
    key: "amazon-clinical-data-coordinator",
    filter: "open",
    nextActionOwner: "partner",
    lastActivityAt: "2026-09-22",
    title: "Clinical Data Coordinator",
    company: "amazon",
    logoSrc: partnerLogos.amazon,
    logoAlt: "Amazon Health",
    partnerName: "Amazon Health",
    compensation: "$85/hr",
    engagementTerms: "15 hrs/week",
    duration: "2 weeks",
    statusLabel: "Interview scheduled",
    statusTone: "success",
    supportingText: "Sep 30 at 2 PM EDT",
  },
  {
    key: "retail-operations-contractor",
    filter: "open",
    nextActionOwner: "verita",
    lastActivityAt: "2026-09-21",
    title: "Retail Operations Contractor",
    company: "verita",
    partnerName: "Verita partner",
    compensation: "$42/hr",
    engagementTerms: "Up to 30 hrs/week",
    duration: "5 months",
    statusLabel: "Applied",
    statusTone: "info",
  },
  {
    key: "clinical-data-coordinator",
    filter: "open",
    nextActionOwner: "verita",
    lastActivityAt: "2026-09-17",
    title: "Clinical Data Coordinator",
    company: "verita",
    partnerName: "Verita partner",
    compensation: "$48/hr",
    engagementTerms: "20 hrs/week",
    duration: "1 month",
    statusLabel: "Applied",
    statusTone: "info",
  },
  {
    key: "strategic-finance-expert",
    filter: "open",
    nextActionOwner: "verita",
    lastActivityAt: "2026-09-12",
    title: "Strategic Finance Expert",
    company: "verita",
    partnerName: "Verita partner",
    compensation: "$56/hr",
    engagementTerms: "Up to 30 hrs/week",
    duration: "3 months",
    statusLabel: "Applied",
    statusTone: "info",
  },
  {
    key: "movement-physical-activity-expert",
    filter: "open",
    nextActionOwner: "verita",
    lastActivityAt: "2026-09-05",
    title: "Movement & Physical Activity Expert Annotator",
    company: "verita",
    partnerName: "Verita partner",
    compensation: "$50/hr",
    engagementTerms: "40 hrs/week",
    duration: "8 weeks",
    statusLabel: "Applied",
    statusTone: "info",
  },
  {
    key: "search-quality-analyst",
    filter: "open",
    nextActionOwner: "partner",
    lastActivityAt: "2026-08-29",
    title: "Search Quality Analyst",
    company: "google",
    logoSrc: partnerLogos.google,
    logoAlt: "Google",
    partnerName: "Google",
    compensation: "$60/hr",
    engagementTerms: "Up to 25 hrs/week",
    duration: "3 months",
    statusLabel: "Applied",
    statusTone: "info",
  },
  {
    key: "developer-relations-contractor",
    filter: "open",
    nextActionOwner: "verita",
    lastActivityAt: "2026-08-14",
    title: "Developer Relations Contractor",
    company: "verita",
    partnerName: "Verita partner",
    compensation: "$85/hr",
    engagementTerms: "Up to 40 hrs/week",
    duration: "Ongoing",
    statusLabel: "Applied",
    statusTone: "info",
  },
];

type OfferFilter = "open" | "closed";

type DemoOffer = Pick<
  OfferCardProps,
  | "company"
  | "logoSrc"
  | "logoAlt"
  | "title"
  | "partnerName"
  | "compensation"
  | "engagementTerms"
  | "duration"
  | "statusLabel"
  | "statusTone"
  | "supportingText"
> & {
  key: string;
  filter: OfferFilter;
  /** Last day to respond, ISO date. Formatted for the card by `offerExpiration`. */
  expiresAt: string;
  /** When the professional declined it (ISO date or timestamp). Set by `applyDeclinedOffers`, or on a seeded closed offer. */
  declinedAt?: string;
  /** Set when the partner withdrew the offer. */
  withdrawnBy?: "partner";
  /** When the partner withdrew it, ISO date. */
  withdrawnAt?: string;
};

/** Days left before an offer's expiration turns urgent (`offer-card.md` §2.3). */
const OFFER_URGENT_DAYS = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * The card's expiration label and tone for an offer expiring on `expiresAt`, counted in calendar days from
 * `DEMO_TODAY`: more than 5 days → "Expires on Oct 9" (muted); 5 days or fewer → "Expires in 3 days", "Expires
 * tomorrow", or "Expires today" (destructive). The wording changes with the color, so color is never the only signal.
 */
function offerExpiration(expiresAt: string): {
  expirationDate: string;
  expirationTone: "muted" | "destructive";
} {
  const daysLeft = Math.round((Date.parse(expiresAt) - Date.parse(DEMO_TODAY)) / DAY_MS);
  if (daysLeft > OFFER_URGENT_DAYS) {
    // `timeZone: "UTC"`: the ISO date parses as UTC midnight, so format it in UTC to keep the same calendar day.
    const date = new Date(expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
    return { expirationDate: `Expires on ${date}`, expirationTone: "muted" };
  }
  const label = daysLeft <= 0 ? "Expires today" : daysLeft === 1 ? "Expires tomorrow" : `Expires in ${daysLeft} days`;
  return { expirationDate: label, expirationTone: "destructive" };
}

/** "Sep 22". A date-only ISO string is formatted in UTC so it keeps its calendar day; a full timestamp in local time. */
function formatOfferDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(iso.length === 10 ? { timeZone: "UTC" } : {}),
  });
}

/**
 * How a `Closed` offer's row reads (`offer-card.md` §3.2), from what happened to it:
 *
 * - Declined by you, before its expiration date: `Declined`, "Declined by you on {date}", opens the detail.
 * - Declined by you, expiration date since passed: `Expired`, "Declined by you on {date}", doesn't open.
 * - Withdrawn by the partner: `Withdrawn`, "Withdrawn by partner", opens the detail.
 * - Expired with no response: `Expired`, "Expired on {date}", doesn't open.
 *
 * An offer counts as expired from the day after `expiresAt` (it can still be answered on its last day).
 */
function closedOfferOutcome({ expiresAt, declinedAt, withdrawnBy }: DemoOffer): {
  statusLabel: string;
  statusTone: "neutral";
  supportingText: string;
  opensDetail: boolean;
} {
  const expired = Date.parse(expiresAt) < Date.parse(DEMO_TODAY);
  if (withdrawnBy) {
    return { statusLabel: "Withdrawn", statusTone: "neutral", supportingText: "Withdrawn by partner", opensDetail: true };
  }
  if (declinedAt) {
    return {
      statusLabel: expired ? "Expired" : "Declined",
      statusTone: "neutral",
      supportingText: `Declined by you on ${formatOfferDate(declinedAt)}`,
      opensDetail: !expired,
    };
  }
  return {
    statusLabel: "Expired",
    statusTone: "neutral",
    supportingText: `Expired on ${formatOfferDate(expiresAt)}`,
    opensDetail: false,
  };
}

/**
 * When a `Closed` offer closed: the day it was declined (even if its expiration date passed later), the day it was
 * withdrawn, or else its expiration date. Places the row in `Last 15 days` or `Older` (`engagements.md` §4.1).
 */
function offerClosedAt({ declinedAt, withdrawnAt, expiresAt }: DemoOffer): string {
  return declinedAt ?? withdrawnAt ?? expiresAt;
}

/**
 * Offers (`engagements.md` §4.1), soonest expiration first — the order Home and Engagements show them in. Home's
 * "New offer for you" shows the first `Open` one (the "2 offers" Dashboard story shows both). One expires within 5
 * days and one after, so both expiration treatments are on screen.
 */
const DEMO_OFFERS: DemoOffer[] = [
  {
    key: "sleep-specialist",
    filter: "open",
    company: "verita",
    title: "Sleep Specialist, Behavioral Sleep Medicine Professional",
    partnerName: "Verita partner",
    compensation: "$75–95/hr",
    engagementTerms: "Up to 30 hrs/week",
    duration: "Ongoing",
    expiresAt: "2026-09-28",
  },
  {
    key: "health-content-evaluator",
    filter: "open",
    company: "amazon",
    logoSrc: partnerLogos.amazon,
    logoAlt: "Amazon Health",
    title: "Health Content Evaluator",
    partnerName: "Amazon Health",
    compensation: "$70/hr",
    engagementTerms: "Up to 20 hrs/week",
    duration: "6 months",
    expiresAt: "2026-10-09",
  },
];

/**
 * Offers already `Closed`, one per outcome `closedOfferOutcome` handles. Only the "2 offers" Engagements story lists
 * them; the default prototype starts with an empty `Closed` filter. Three closed within the last 15 days and one
 * earlier, so both `Closed` sections show.
 */
const DEMO_CLOSED_OFFERS: DemoOffer[] = [
  {
    key: "pharmacy-benefits-analyst",
    filter: "closed",
    company: "verita",
    title: "Pharmacy Benefits Analyst",
    partnerName: "Verita partner",
    compensation: "$65/hr",
    engagementTerms: "Up to 25 hrs/week",
    duration: "3 months",
    expiresAt: "2026-10-02",
    declinedAt: "2026-09-22",
  },
  {
    key: "clinical-guidelines-reviewer",
    filter: "closed",
    company: "google",
    logoSrc: partnerLogos.google,
    logoAlt: "Google",
    title: "Clinical Guidelines Reviewer",
    partnerName: "Google",
    compensation: "$80/hr",
    engagementTerms: "Up to 20 hrs/week",
    duration: "2 months",
    expiresAt: "2026-10-05",
    withdrawnBy: "partner",
    withdrawnAt: "2026-09-18",
  },
  {
    key: "patient-experience-researcher",
    filter: "closed",
    company: "verita",
    title: "Patient Experience Researcher",
    partnerName: "Verita partner",
    compensation: "$55/hr",
    engagementTerms: "15 hrs/week",
    duration: "6 weeks",
    expiresAt: "2026-09-19",
  },
  {
    key: "medical-coding-auditor",
    filter: "closed",
    company: "amazon",
    logoSrc: partnerLogos.amazon,
    logoAlt: "Amazon Health",
    title: "Medical Coding Auditor",
    partnerName: "Amazon Health",
    compensation: "$60/hr",
    engagementTerms: "Up to 30 hrs/week",
    duration: "4 months",
    expiresAt: "2026-09-15",
    declinedAt: "2026-09-08",
  },
];

type ContractFilter = "open" | "completed";

type DemoContract = Pick<
  ContractCardProps,
  | "company"
  | "logoSrc"
  | "logoAlt"
  | "title"
  | "compensation"
  | "partnerName"
  | "engagementTerms"
  | "duration"
  | "progress"
  | "primaryActionLabel"
  | "statusLabel"
  | "statusTone"
  | "instructions"
> & { key: string; filter: ContractFilter };

/**
 * Contracts (`engagements.md` §5.2). Home's "Current contracts" shows the `Open`
 * ones. Compensation follows `contract-card.md` §3.3.1's formats ("$85/hour",
 * "$600/day"), not the application cards' "/hr" shorthand.
 */
const DEMO_CONTRACTS: DemoContract[] = [
  {
    key: "backend-integration",
    filter: "open",
    company: "verita",
    title: "Backend Integration Engineer",
    compensation: "$85/hour",
    partnerName: "Verita partner",
    engagementTerms: "Up to 40 hrs/week",
    duration: "3 months",
    progress: { metricLabel: "10 of 40 hours used this week", percentageLabel: "25%", percentage: 25 },
    primaryActionLabel: "Open work",
  },
  {
    key: "compensation-benchmarking",
    filter: "open",
    company: "verita",
    title: "Compensation Benchmarking Report",
    compensation: "$4,500/project",
    partnerName: "Verita partner",
    engagementTerms: "6 weeks",
    primaryActionLabel: "Resume work",
  },
  {
    key: "clinical-expert-survey",
    filter: "open",
    company: "amazon",
    logoSrc: partnerLogos.amazon,
    logoAlt: "Amazon Health",
    title: "Clinical Expert, In-Home Health Evaluation Survey",
    compensation: "$2,000/task",
    partnerName: "Amazon Health",
    engagementTerms: "Up to 40 hrs/week",
    duration: "3 months",
    progress: { metricLabel: "4 of 5 deliverables submitted", percentageLabel: "80%", percentage: 80 },
    primaryActionLabel: "Resume work",
  },
  {
    // `contract-card.md` §6.1 "Paused": warning badge (§3.1.2 tone table), the resume condition, progress
    // kept as-is, and no primary action — resume-work actions are suppressed while paused.
    key: "clinical-research-advisor",
    filter: "open",
    statusLabel: "Paused",
    statusTone: "warning",
    company: "verita",
    title: "Clinical Research Advisor",
    compensation: "$600/day",
    partnerName: "Verita partner",
    engagementTerms: "Up to 3 days/week",
    duration: "4 months",
    progress: { metricLabel: "6 of 12 days completed", percentageLabel: "50%", percentage: 50 },
    instructions: "Paused until the partner confirms the next study phase",
  },
];

export {
  DEMO_TODAY,
  DEMO_APPLICATIONS,
  DEMO_OFFERS,
  DEMO_CLOSED_OFFERS,
  DEMO_CONTRACTS,
  offerExpiration,
  closedOfferOutcome,
  offerClosedAt,
  type ApplicationFilter,
  type NextActionOwner,
  type OfferFilter,
  type ContractFilter,
};

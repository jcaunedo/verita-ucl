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
> & { key: string; filter: ApplicationFilter };

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
 */
const DEMO_APPLICATIONS: DemoApplication[] = [
  {
    key: "senior-financial-analyst",
    filter: "open",
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

type OfferFilter = "open" | "declined";

type DemoOffer = Pick<
  OfferCardProps,
  "company" | "title" | "partnerName" | "compensation" | "engagementTerms" | "duration" | "expirationDate"
> & { key: string; filter: OfferFilter };

/** Offers (`engagements.md` §4.1). Home's "New offer for you" alert shows the first `Open` one. */
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
    expirationDate: "Expires on Oct 3",
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
  DEMO_APPLICATIONS,
  DEMO_OFFERS,
  DEMO_CONTRACTS,
  type ApplicationFilter,
  type OfferFilter,
  type ContractFilter,
};

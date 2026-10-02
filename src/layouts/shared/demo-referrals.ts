import type { BadgeProps } from "@/components/data-display/badge";

/**
 * Demo referrals for the Referrals layout, as in Figma's `My referrals` frame (Verita, `node-id=6118-25784`). Spec:
 * `product-specs/referrals.md` §5.1 (columns, summary) and §7 (stages).
 *
 * Dates count back from the real current date, so every option in the period selector shows something different:
 * none made today (its empty state), three in the last 7 days, five in the last 30, six in the last 12 months, and one
 * older than that.
 */

/** The referral lifecycle, in order (`referrals.md` §7). */
const REFERRAL_STAGES = ["Referred", "Joined", "Applied", "Hired", "Qualifying", "Reward earned", "Paid"] as const;

type ReferralStage = (typeof REFERRAL_STAGES)[number];

/**
 * Badge tone per stage, as in Figma's table: `info` while the person is getting started, `indigo` while qualifying,
 * `success` once the reward is earned. `Hired` isn't in the frame; it stays `purple` from the earlier table draft.
 */
const REFERRAL_STAGE_TONES: Record<ReferralStage, NonNullable<BadgeProps["tone"]>> = {
  Referred: "info",
  Joined: "info",
  Applied: "info",
  Hired: "purple",
  Qualifying: "indigo",
  "Reward earned": "success",
  Paid: "success",
};

/** Summary grouping (`referrals.md` §5.1): `Reward earned` and `Paid` have qualified; everything before is in progress. */
function isQualifiedStage(stage: ReferralStage) {
  return stage === "Reward earned" || stage === "Paid";
}

interface DemoReferral {
  key: string;
  name: string;
  email: string;
  /** Photo avatar (Figma's photo `Avatar` instances). */
  avatarSrc?: string;
  /** Initials avatar background, when there's no photo. Figma's initials avatars use a per-person sample color. */
  avatarClassName?: string;
  /** The opportunity they were referred to. Omitted for a general referral (`Referred for` → "General referral", §5.1). */
  opportunityTitle?: string;
  stage: ReferralStage;
  /** When the referral was made, ISO date. The period filter narrows by this. */
  referredAt: string;
  /** When the referral last moved (its latest stage change), ISO date (`Last activity` column). */
  lastActivityAt: string;
  /** Reward amount in USD: $50 for a general referral, set by the opportunity otherwise (§9). */
  reward: number;
}

/** The date `days` before today in the viewer's calendar, as an ISO date (e.g. "2026-10-02"). */
function isoDateDaysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** The professional's general referral link, as shown in Figma's `share-referral-link-modal`. Example only. */
const DEMO_REFERRAL_LINK = "https://ref.verita-ai.com/hhd87";

/** The demo's "today", the date the period selector counts back from. */
const DEMO_REFERRALS_TODAY = isoDateDaysAgo(0);

const photo = (file: string) => new URL(`../referrals/images/${file}`, import.meta.url).href;

/** Listed most recent first, the order the table shows them in. */
const DEMO_REFERRALS: DemoReferral[] = [
  // Figma shows the same person referred to two opportunities as two rows (§5.1).
  {
    key: "olivia-smith-senior-financial-analyst",
    name: "Olivia Smith",
    email: "olivia.smith@email.com",
    avatarSrc: photo("avatar-olivia-smith.png"),
    opportunityTitle: "Senior Financial Analyst",
    stage: "Referred",
    referredAt: isoDateDaysAgo(1),
    lastActivityAt: isoDateDaysAgo(1),
    reward: 450,
  },
  {
    key: "olivia-smith-senior-investment-analyst",
    name: "Olivia Smith",
    email: "olivia.smith@email.com",
    avatarSrc: photo("avatar-olivia-smith.png"),
    opportunityTitle: "Senior Investment Analyst",
    stage: "Joined",
    referredAt: isoDateDaysAgo(2),
    lastActivityAt: isoDateDaysAgo(1),
    reward: 450,
  },
  {
    key: "courtney-henry",
    name: "Courtney Henry",
    email: "courtney.henry@email.com",
    avatarSrc: photo("avatar-courtney-henry.png"),
    stage: "Applied",
    referredAt: isoDateDaysAgo(5),
    lastActivityAt: isoDateDaysAgo(2),
    reward: 50,
  },
  {
    key: "leslie-alexander",
    name: "Leslie Alexander",
    email: "leslie.alexander@email.com",
    avatarClassName: "bg-tone-success",
    opportunityTitle: "AI Trainer",
    stage: "Applied",
    referredAt: isoDateDaysAgo(12),
    lastActivityAt: isoDateDaysAgo(4),
    reward: 300,
  },
  {
    key: "albert-flores",
    name: "Albert Flores",
    email: "albert.flores@email.com",
    avatarClassName: "bg-tone-warning",
    opportunityTitle: "Data Analyst",
    stage: "Qualifying",
    referredAt: isoDateDaysAgo(26),
    lastActivityAt: isoDateDaysAgo(8),
    reward: 300,
  },
  {
    key: "jacob-jones",
    name: "Jacob Jones",
    email: "jacob.jones@email.com",
    avatarSrc: photo("avatar-jacob-jones.png"),
    stage: "Reward earned",
    referredAt: isoDateDaysAgo(95),
    lastActivityAt: isoDateDaysAgo(15),
    reward: 50,
  },
  {
    key: "bessie-cooper",
    name: "Bessie Cooper",
    email: "bessie.cooper@email.com",
    avatarClassName: "bg-tone-orange",
    stage: "Paid",
    referredAt: isoDateDaysAgo(400),
    lastActivityAt: isoDateDaysAgo(40),
    reward: 50,
  },
];

export {
  DEMO_REFERRAL_LINK,
  DEMO_REFERRALS,
  DEMO_REFERRALS_TODAY,
  REFERRAL_STAGES,
  REFERRAL_STAGE_TONES,
  isQualifiedStage,
  type DemoReferral,
  type ReferralStage,
};

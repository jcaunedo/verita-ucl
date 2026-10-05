import * as React from "react";

import type { ApplicationCardProps } from "@/components/cards/application-card";
import { Toaster } from "@/components/feedback/toast";
import { ShareReferralLinkModal, type ReferralOpportunity } from "@/components/overlays/share-referral-link-modal";
import { DEMO_REFERRAL_LINK } from "@/layouts/shared/demo-referrals";
import { DEMO_CONNECTIONS } from "@/layouts/shared/demo-connections";

/** An opportunity row the prototype can refer from: an application's own fields, plus its key. */
type ReferableOpportunity = { key: string } & Pick<
  ApplicationCardProps,
  "title" | "partnerName" | "company" | "logoSrc" | "logoAlt" | "compensation" | "engagementTerms" | "duration"
>;

/**
 * Demo referral rewards, set per opportunity (`referrals.md` §9). Senior Financial Analyst's $450 is Figma's
 * (`share-referral-link-modal`, `Opportunity Default`); the rest get $300, like the opportunity referrals on the
 * Referrals page.
 */
const DEMO_OPPORTUNITY_REWARDS: Record<string, number> = { "senior-financial-analyst": 450 };
const DEFAULT_OPPORTUNITY_REWARD = 300;

/**
 * Demo audiences: who each opportunity suits (roles, job titles, industry), for the LinkedIn and X share copy.
 * An opportunity without one falls back to "professionals with {title} experience".
 */
const DEMO_OPPORTUNITY_AUDIENCES: Record<string, string> = {
  "senior-financial-analyst": "financial analysts and FP&A professionals",
  "amazon-clinical-data-coordinator": "clinical research coordinators and healthcare data specialists",
  "retail-operations-contractor": "retail operations and store management professionals",
  "clinical-data-coordinator": "clinical research coordinators and healthcare data specialists",
  "strategic-finance-expert": "CFOs, finance leaders, and strategic finance professionals",
  "movement-physical-activity-expert": "physical therapists, kinesiologists, and fitness professionals",
  "search-quality-analyst": "search quality, content, and linguistics specialists",
  "developer-relations-contractor": "developer advocates and software engineers",
  "health-content-reviewer": "clinicians and medical writers",
};

/**
 * The professional's link for one opportunity: their referral link plus a short code for the opportunity, as in Figma
 * ("https://ref.verita-ai.com/hhd87-yw7e"). The code is derived from the key, so it stays the same between openings.
 */
function opportunityLink(key: string) {
  let hash = 0;
  for (const character of key) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return `${DEMO_REFERRAL_LINK}-${hash.toString(36).slice(-4)}`;
}

/**
 * "Refer someone" from an opportunity's more-actions menu (`referrals.md` §6): opens `ShareReferralLinkModal` for that
 * opportunity. Returns `refer(row)` for the menu item and `modal` to render once on the page (the modal and the
 * `Toaster` its confirmations need). The last opportunity is kept after closing, so the modal fades out with its
 * content instead of going blank.
 */
function useReferOpportunity() {
  const [isOpen, setOpen] = React.useState(false);
  const [opportunity, setOpportunity] = React.useState<{ link: string; details: ReferralOpportunity } | null>(null);

  const refer = React.useCallback(
    ({
      key,
      title,
      partnerName,
      company,
      logoSrc,
      logoAlt,
      compensation,
      engagementTerms,
      duration,
    }: ReferableOpportunity) => {
      setOpportunity({
        link: opportunityLink(key),
        details: {
          title,
          partnerName,
          company,
          logoSrc,
          logoAlt,
          compensation,
          engagementTerms,
          duration,
          reward: DEMO_OPPORTUNITY_REWARDS[key] ?? DEFAULT_OPPORTUNITY_REWARD,
          audience: DEMO_OPPORTUNITY_AUDIENCES[key],
        },
      });
      setOpen(true);
    },
    [],
  );

  const modal = (
    <>
      {opportunity && (
        <ShareReferralLinkModal
          isOpen={isOpen}
          onOpenChange={setOpen}
          link={opportunity.link}
          opportunity={opportunity.details}
          inviterName="Theresa"
          // "Share by email" suggests the demo network, as if it had been imported on Referrals → My network.
          connections={DEMO_CONNECTIONS}
        />
      )}
      {/* Confirms "Copy referral link" and "Send invite": bottom right on desktop, bottom center on mobile. */}
      <Toaster />
    </>
  );

  return { refer, modal };
}

export { useReferOpportunity, type ReferableOpportunity };

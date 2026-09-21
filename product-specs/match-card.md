<!--
Created: Sep 19, 2026
Created by: Julio Caunedo
Last updated: Sep 20, 2026
Scope: Verita AI Dashboard — the Matching opportunities module's card content, split out of the Dashboard PRD (product-specs/dashboard.md) [§6](dashboard.md#6-information-architecture), [§7.3](dashboard.md#73-matching-opportunities)–[§7.4](dashboard.md#74-matching-opportunities-empty-states).
Purpose: Define the Match card's content model, fit/tier presentation, application-readiness states, row-interaction behavior, and visibility rule as both the Home "Matching opportunities" module surface and the Opportunities → Matches view, over the underlying Match object.
-->

# Match Card

**Status:** Draft for product and design alignment

**Figma reference:** ⚠️ **Gap:** no Figma reference yet for the Match card — attach once design has examples.

## 1. What the Match card is

A Match is an opportunity Verita has proactively identified as relevant to a professional, based on their expertise, experience, skills, preferences, availability, compensation expectations, and eligibility ([`dashboard.md` §9.4](dashboard.md#94-match-fields), [§10](dashboard.md#10-profile-and-matching-data)). The Match card is how a professional sees one of these opportunities at a glance — its fit, why it fits, and whether they can act on it yet — without opening the full opportunity detail.

**Key distinction — a Match is a signal, not a commitment:** a Match represents a system-generated relevance judgment layered on top of an Opportunity ([`dashboard.md` §6.3](dashboard.md#63-opportunity-views)'s object model: `Match` → system-identified relevance between a professional and an opportunity). It is never an application, an invitation, an offer, or a guarantee of work. The professional still has to act — apply, complete a requirement, etc. — for a Match to become anything more than a recommendation. This distinction governs everything else in this doc: the card must never present a Match with the confidence or finality of an Applications-card row (`product-specs/applications-card.md`), since nothing has been pursued yet.

The Match card is a reusable component that appears in two places sharing the same content ([`dashboard.md` §7.3](dashboard.md#73-matching-opportunities)):

- **Opportunities → Matches**, ranked by fit — the full, unfiltered list of the professional's current matches.
- **Home's "Matching opportunities" module** — a promoted preview of the professional's strongest current matches, same underlying `Match` objects, just the top few ranked per the Dashboard priority engine ([`dashboard.md` §4](dashboard.md#4-dashboard-priority-engine)).

**Scope boundary:** `match-card.md` owns presentation and interaction. `dashboard.md` remains the source of truth for the Match object, matching/eligibility logic, the priority engine, and module-level visibility, ordering, and composition relative to other Home modules.

## 2. Card content

Per [`dashboard.md` §7.3](dashboard.md#73-matching-opportunities), each Match card must include:

- Opportunity title.
- Partner name, or an approved anonymized label per partner-visibility policy.
- Opportunity type (§3 below).
- Match tier — a plain-language fit tier, never the internal numeric score (§4).
- Fit explanation — a concise, evidence-grounded reason (§4.1).
- Compensation and engagement terms, when available (§3.1).
- Duration, when a confirmed timeframe was posted (§3.2).
- Deadline/urgency, only when material to the decision — never a generic freshness indicator.
- Application-readiness state (§5).
- Missing-requirement summary, when blocked (§5.1).
- Saved state, with a toggle affordance (§6.1).
- Recommended action — the single primary CTA for the card's current state (§6).

Required data does not mean every field must be displayed in every state — deadline/urgency and the missing-requirement summary in particular are conditional, not always-on (see the open question in §8, inherited from [`dashboard.md` §7.3](dashboard.md#73-matching-opportunities)'s unresolved note on this).

The system must never expose the internal numeric match score by default ([`dashboard.md` §7.3](dashboard.md#73-matching-opportunities)).

## 3. Opportunity type

Per [`dashboard.md` §11.1](dashboard.md#111-opportunity-types), a Match's underlying Opportunity is one of two types, shown as a plain-language badge distinct from the match tier (§4):

| Opportunity type | Meaning                                                                                          |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| Engagement        | Secured, contract-based work once pursued — a defined project, ongoing capacity, or a single scoped deliverable. Its actual engagement terms (time commitment) and duration (§3.2) are shown as separate content, not folded into this badge. |
| Talent Network    | No immediate project — joining a qualified pool for future consideration, not active pursuit of a specific opportunity. |

This badge is independent of compensation/engagement-terms content and of the match tier — see [`contract-card.md` §3.2](contract-card.md#32-engagement-terms) for the full Engagement-terms model this card's compensation/terms content reuses.

### 3.1 Compensation: advertised range vs. agreed amount

The Match card shows the Opportunity's **advertised** compensation, which — unlike a Contract card ([`contract-card.md` §3.3](contract-card.md#33-compensation-terms-and-expected-workload)) — may itself be a **range**, e.g. `$95–115k/yr` or `$75–$95/hour`, not just a single value. This is the one point where Match-card and Contract-card compensation display diverge, and the divergence is intentional, not an inconsistency to reconcile:

- **Match card (this doc):** nothing has been agreed yet ([§1](#1-what-the-match-card-is)) — the Opportunity itself may be posted with a compensation range, and the card must be able to display that range as-is, using the same unit-specific formats as [`contract-card.md` §3.3.1](contract-card.md#331-compensation-display-variants) (hourly, salary, fixed fee, etc.), extended to allow a range for any of those units, not only hourly/salary.
- **Contract card:** once a professional has signed, [`contract-card.md` §3.3.1](contract-card.md#331-compensation-display-variants)'s rule applies instead — "a range is shown only when the contract itself specifies one" — and [§3.3.2](contract-card.md#332-additional-compensation-states) requires showing the actual agreed amount (e.g. `$85/hour`) rather than the opportunity's original advertised range, once that amount is known.

A Match card must never collapse an advertised range into a single point value (e.g. picking the low or high end) — doing so would misrepresent what the partner actually posted. Conversely, once the same opportunity becomes a Contract post-application, the Contract card is the one that narrows to the single agreed value; the Match card is not expected to track that transition since the underlying object changes ([§1](#1-what-the-match-card-is)'s Match → Opportunity → Contract lifecycle, [`engagements.md` §4](engagements.md#4-offers-and-contracting)).

`Compensation not disclosed` and `Rate pending confirmation` ([`contract-card.md` §3.3.2](contract-card.md#332-additional-compensation-states)) apply here unchanged — omit the field entirely when not disclosed, rather than showing $0 or a placeholder range.

### 3.2 Duration

Duration is a shared, optional data point across the Match, Application, and Contract cards; only its source differs by card — see [`contract-card.md` §3.2.1](contract-card.md#321-duration) for the full three-card model. On the Match card specifically:

- Duration shown here is the **advertised or estimated duration**, as posted on the Opportunity — never a confirmed or agreed value, since nothing has been agreed yet ([§1](#1-what-the-match-card-is)).
- Show duration only when a confirmed timeframe was actually posted with the opportunity; hide it entirely for a one-time task with no defined duration, rather than showing a placeholder.
- Support values such as `2 weeks`, `3 months`, or `Ongoing` — `Ongoing` is itself a posted value (a known open-ended opportunity), distinct from omission (no duration information posted at all).
- Duration is separate from Deadline/urgency (§2) — duration describes the engagement's expected length; deadline/urgency describes a specific date the professional must act by. The two are never merged into one field or string.
- Once the same opportunity produces an Application and, later, a signed Contract, those cards show their own duration values (expected, then agreed) — the Match card is not expected to track that narrowing, consistent with §3.1's compensation-range precedent.

## 4. Match tier and fit explanation

**Match tier** is the plain-language fit label shown on the card (e.g. "Strong match") — the numeric confidence score behind it is never exposed by default ([`dashboard.md` §7.3](dashboard.md#73-matching-opportunities)). The exact tier vocabulary and thresholds are not yet finalized; see the open question in §8.

> ⚠️ **Decision needed:** [`dashboard.md` §21](dashboard.md#21-open-questions) leaves the definition of Strong/Good/Possible (or whatever the final tier names are) open — this card's tier badge cannot be finalized until that taxonomy is confirmed. Treat any tier name used in this doc's examples as illustrative, not settled.

### 4.1 Fit explanation

The fit explanation is a concise reason grounded in supported professional and opportunity signals — what the professional will recognize as evidence (e.g. "Matches your 5 years of FP&A experience and your stated hourly rate"), never scoring machinery or internal confidence language ([`dashboard.md` §7.3](dashboard.md#73-matching-opportunities), [§12](dashboard.md#12-ux-content-requirements)). It must be:

- **Evidence-based**, citing signals the professional actually confirmed or provided (skills, experience, domain, rate, availability, location/authorization alignment — [`dashboard.md` §9.4](dashboard.md#94-match-fields)) — never a generic "great fit for you" with no cited reason.
- **Never implying a guarantee.** A strong fit explanation still describes a Match, not a secured outcome — the card must not use language that reads as a promise of an interview, offer, or work.

> 🙋 Whether the fit explanation is always visible on the card or progressively disclosed (e.g. behind a "why this match" affordance) is open — see [`dashboard.md` §21](dashboard.md#21-open-questions)'s "Should match reasons be always visible or progressively disclosed?"

## 5. Application-readiness state

Per [`dashboard.md` FR-4](dashboard.md#fr-4-matching-and-eligibility) and [§7.3](dashboard.md#73-matching-opportunities), a Match's application-readiness is distinct from its match tier — a professional can be a strong fit for an opportunity and still be unable to apply yet, or a weaker fit and immediately eligible. The card must present four distinct readiness states, never collapsing them into a single "matched/not matched" binary:

| Readiness state              | Meaning                                                                                   | Card behavior                                                                                     |
| ------------------------------ | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Not a fit                      | Doesn't meet the opportunity's requirements.                                                | Should not surface as a promoted Match at all in ordinary flows — included here for completeness of the readiness enum, not as an expected card state. |
| Potential fit with missing data | Alignment signals are incomplete — Verita can't yet confirm fit with confidence.            | Card should prompt completing the missing profile/preference data, not present it as blocked or rejected. |
| Matched but blocked            | Confirmed fit, but the professional has an outstanding requirement before they can apply.    | Show the missing-requirement summary (§5.1) and a CTA that resolves the blocker, per [`dashboard.md` §7.5](dashboard.md#75-contextual-application-blocker). |
| Ready to apply                 | Confirmed fit, no outstanding requirement.                                                  | Primary CTA is "Apply" (or the equivalent recommended action, §6).                                     |

This mirrors [`applications-card.md` §2.1](applications-card.md#21-progress-display)'s principle of never inventing or approximating a state the underlying data doesn't support — a Match card must not default to "ready to apply" when readiness is actually unconfirmed, and must not silently drop to a generic "not eligible" when the real state is "missing data," since the recommended next action differs by state.

### 5.1 Contextual application blocker

When `matched but blocked`, per [`dashboard.md` §7.5](dashboard.md#75-contextual-application-blocker):

- Keep the role visible — a blocked match is not hidden or demoted out of the list.
- Name the specific missing requirement inline on the card, rather than requiring a separate screen ([`dashboard.md` §7.3](dashboard.md#73-matching-opportunities)'s missing-requirement summary field).
- Explain that completing it enables the application.
- Route the CTA directly to the correct task.
- Return the professional to the role (or resume the application) after task completion.
- Recalculate readiness immediately, or explain any processing delay, rather than leaving the card in a stale blocked state.

## 6. Recommended action

The card's single primary CTA reflects its current readiness state (§5) — never more than one action competes for primary attention. Per [`dashboard.md` §7.3](dashboard.md#73-matching-opportunities), the possible recommended actions are:

- Learn more
- Apply
- Complete requirement to apply
- Finish assessment
- Resume application
- Interview
- Review offer
- Start onboarding

The card must not show a CTA promising more than the current readiness state supports — e.g. never "Apply" while `matched but blocked` is the actual state (§5).

### 6.1 Saved state

Whether the professional has bookmarked this match — surfaces the card in the Saved view ([`dashboard.md` §6.3](dashboard.md#63-opportunity-views)) and must be toggleable from the card itself, not only from a detail screen.

> ⚠️ **Decision needed:** [`dashboard.md` §7.3](dashboard.md#73-matching-opportunities) leaves the Saved toggle's interaction pattern open — icon affordance vs. menu action — pending confirmation against [`dashboard.md` §13](dashboard.md#13-interaction-and-motion-requirements)'s motion requirements.

## 7. Row interaction

Selecting a Match card takes the professional to the same match detail used within Opportunities, regardless of whether the card was reached from Home or from Opportunities → Matches ([`dashboard.md` §6.3](dashboard.md#63-opportunity-views)).

> 🙋 Whether the entire card is a single click target (matching [`applications-card.md` §4](applications-card.md#4-row-interaction)'s row-interaction model) or whether the primary CTA (§6) is a separate, distinct control from the row's own click-through is not yet defined here — needs Figma examples before this can follow either precedent.

## 8. Visibility and empty states

The Home "Matching opportunities" module is a filtered, top-of-list preview over the same underlying Match objects as the full Opportunities → Matches view — not a separately-scoped concept ([`dashboard.md` §6.3](dashboard.md#63-opportunity-views)).

> ⚠️ **Decision needed:** [`dashboard.md` §6.3](dashboard.md#63-opportunity-views) leaves the cap on matches shown in the Home module unresolved (e.g. top 2–4) versus the full, paginated Matches view within Opportunities.

### 8.1 Empty states

Per [`dashboard.md` §7.4](dashboard.md#74-matching-opportunities-empty-states), the Matching opportunities module has no matches to show under multiple distinct circumstances that must not share the same copy or visibility rule:

| Professional state                                          | Behavior                                                                             |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| New professional, matching-readiness not yet met                | Hide the module entirely — prioritize Next steps and profile completion.              |
| Matching-readiness met, matching not yet run                     | Hide the module — do not show an empty state prematurely.                             |
| Matching in progress                                             | Show a loading/processing state, not "No matches yet."                                |
| Matching completed, zero results                                 | Show **No matches yet** — title/body/CTA per the table below.                         |
| Matching completed, results available                            | Show the matched opportunities (§2's card content).                                   |
| Professional has previously seen matches, none active now        | Show **No new matches** instead of "No matches yet" — a materially different situation (temporary unavailability, not first-time discovery). |

**Confirmed empty-state copy** ([`dashboard.md` §7.4](dashboard.md#74-matching-opportunities-empty-states)):

| State                                              | Title            | Body                                                                                                                    | CTA                    |
| ---------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| First-time, zero results                             | No matches yet    | We haven't found opportunities that align with your profile. Keep your experience and preferences up to date to improve future matches. | Review your profile      |
| Previously had matches, none currently available     | No new matches    | Not yet drafted — see the open question below.                                                                             | Not yet drafted            |

Both empty states are deliberately framed to avoid implying the professional did something wrong, and to avoid promising that completing their profile guarantees future matches — they frame profile/preference upkeep as improving *future* matches, not as a fix for a failure ([`dashboard.md` §7.4](dashboard.md#74-matching-opportunities-empty-states)).

> 🙋 The exact "No new matches" body/CTA copy is not yet drafted — see [`dashboard.md` §21](dashboard.md#21-open-questions).

## 9. Component content model

The component receives a summary of one authoritative Match. This is a presentation model, not a finalized API schema. The parent surface (Home's "Matching opportunities," or the full Opportunities → Matches list) selects which matches to show and in what order, ranked by fit; the card determines how each supplied summary is presented.

### 9.1 Composition and fallback rules

- Present identity (title, partner, opportunity type) first, then match tier and fit explanation, then compensation/terms and deadline when applicable, then readiness state and recommended action — following §2's field order.
- Collapse an absent optional field without a blank row or placeholder text, consistent with [`applications-card.md` §6.2](applications-card.md#62-composition-and-fallback-rules)'s fallback rules — a missing deadline is omitted, not shown as "No deadline."
- The missing-requirement summary (§5.1) only renders while `matched but blocked` — it must never render as an empty affordance for any other readiness state.
- Never render the internal numeric match score, under any state (§2, §4).

## 10. Open questions

- 🙋 What defines Strong/Good/Possible (or the final tier names) — the match-tier taxonomy itself remains undefined. (§4)
- 🙋 Whether the fit explanation is always visible or progressively disclosed. (§4.1)
- 🙋 Which rationale is safe, accurate, and useful to expose in the fit explanation, without exposing scoring machinery. (§4.1)
- 🙋 Confirm whether Deadline/urgency and the Missing-requirement summary should always render on the card or only when applicable. (§2)
- 🙋 Confirm the Saved toggle's interaction pattern — icon affordance vs. menu action. (§6.1)
- 🙋 Whether the entire card is a single click target or the primary CTA is a separate control from the row click-through. (§7)
- 🙋 Confirm the cap on matches shown in the Home "Matching opportunities" module vs. the full, paginated Opportunities → Matches view. (§8)
- 🙋 What is the exact "No new matches" body/CTA copy for a professional who has previously seen matches but currently has none. (§8.1)
- 🙋 Which signals drive matching, and which are hard eligibility gates. (§4)
- 🙋 How should missing or low-confidence profile data affect recommendations. (§5)
- 🙋 How quickly are matches refreshed after profile, rate, or availability changes.

## 11. Related docs

- `product-specs/dashboard.md` — the Home/Dashboard PRD. Matching opportunities is Home module 4 ([§6](dashboard.md#6-information-architecture)); the full card-content table, empty states, and functional requirements this card surfaces live in [§7.3](dashboard.md#73-matching-opportunities)–[§7.5](dashboard.md#75-contextual-application-blocker), [§9.4](dashboard.md#94-match-fields), and [FR-4](dashboard.md#fr-4-matching-and-eligibility)/[FR-5](dashboard.md#fr-5-application-readiness).
- `product-specs/applications-card.md` — the sibling Home-module card PRD for Applications, used here as the structural precedent for row-interaction, fallback rules, and status-conditionality patterns — while remaining a categorically different object (a pursued Application vs. a not-yet-pursued Match, §1).
- `product-specs/contract-card.md` — source of truth for the Engagement-terms model (§3.2), the shared Duration field (§3.2.1), and compensation display variants (§3.3) this card's compensation/terms content reuses, with the advertised-range vs. agreed-amount divergence noted in §3.1 above.
- `product-specs/engagements.md` — [§2](engagements.md#2-engagement-views) defines the Opportunities/Engagements boundary a Match sits on the discovery side of (pre-Apply).

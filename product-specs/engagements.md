<!--
Created: Sep 8, 2026
Created by: Julio Caunedo
Last updated: Sep 18, 2026
Scope: Verita AI professional Engagements page — Applications, Offers, Contracts, Assessments, Talent Network, plus the Training and Payments concerns that hang off an active Contract.
Purpose: Define the product, UX, and data requirements for the Engagements destination, split out of the Dashboard PRD (product-specs/dashboard.md) once Engagements grew into its own page-level scope.
-->

# Engagements PRD

**Status:** Draft for product and design alignment
**Primary users:** Independent professionals and experts across various fields and professions who use Verita to find, apply to, and get paid for project-based work opportunities.

**Related doc:** `product-specs/dashboard.md` — the Home/Dashboard PRD. Home surfaces filtered, top-of-list previews of `Applications`, `Offers`, and `Contracts` (its modules 3, 5, 6) backed by the same objects and rules defined here; this doc is the source of truth for those objects' full field lists, status models, and resolved decisions. See [dashboard.md §6](dashboard.md#6-information-architecture) for the Home module list and [`product-specs/main-navigation.md` §2.3](main-navigation.md#23-engagements) for how the `Engagements` nav item fits the overall navigation model.

## 1. What Engagements is

Engagements houses the user's ongoing and historical interactions with opportunities **the user is actively pursuing** — applications, qualification activity, offers, and contracts — across different opportunity models. It does not include opportunities the user has only bookmarked; see §2's transition-point rule.

This is deliberately worded as "interactions with" rather than "actions taken on," since some items — like an assessment — may be assigned by Verita rather than initiated by the user.

Engagements pairs with Opportunities ([`main-navigation.md` §2.2](main-navigation.md#22-opportunities)–[§2.3](main-navigation.md#23-engagements)): `Opportunities` is where the professional finds new work; `Engagements` is where they manage work or opportunities they've already actively pursued. The pairing reads as _find something relevant_ → _manage what I've acted on_.

> ✅ **Resolved (amended 2026-09-09 — `Talent Network` added as a fifth view):** "Engagements" is broader than contracts only — it represents the user's relationship with opportunities from the point they start actively pursuing one, or join a pool for future consideration, providing a single destination for the user's ongoing and historical interactions with opportunities (applications, qualification activity, offers, contracts, and talent-pool membership). It is organized into **Engagement views** (§2): `Applications`, `Offers`, `Contracts`, `Assessments`, and `Talent Network`. `Saved` was originally included here as a view; it has since moved to Opportunities ([dashboard.md §6.3](dashboard.md#63-opportunity-views)) because bookmarking an opportunity starts no actual relationship with it — the Engagements boundary is now Apply (or Join, for Talent Network), not discovery. These views are different marketplace objects/relationships, not sequential lifecycle stages or mutually exclusive buckets — an opportunity's history can appear under more than one view at once (e.g. a rejected application still shows under `Applications` even if it once produced an entry under `Offers`). **Engagement views are distinct from Opportunity types** ([dashboard.md §11.1](dashboard.md#111-opportunity-types): Engagement, Talent Network) — Opportunity type describes whether the Opportunity offers secured work at all; an Engagement view describes which marketplace object the user is looking at. `Talent Network` is the one exception where the view name and the Opportunity type name coincide — see §2's resolved note on why that's intentional, not a taxonomy collision.
>
> ⚠️ **Decision needed:** Confirm whether "Your applications," "Contracts," and "Offers" remain distinct Home-page modules ([dashboard.md §6](dashboard.md#6-information-architecture), items 3/5/6) pointing into this Engagements destination, or should be merged/renamed to match the views named here.

## 2. Engagement views

Views within Engagements that organize the user's interactions with opportunities. These views represent different marketplace objects or relationships, not stages of a single sequential lifecycle — an opportunity's history can span more than one view at once (e.g. an application that led to an offer stays visible under `Applications` even after the offer appears under `Offers`).

Listed below in tab order (see the resolved note below the table): `Applications → Offers → Contracts → Assessments → Talent Network`.

| View            | Meaning                                                                                                                                                                                                                                                                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Applications    | Specific opportunities the user has pursued. All opportunities the user has started or applied to, including active and historical applications and their current stage — user-facing labels: `Not submitted`, `Applied`, `In review`, `Interview`, `On hold`, `Not selected`, or `Withdrawn` (backed by the system status enum, §8 — `Not submitted` is a proposed addition, not yet backed by a system status; see §8). Rejected and withdrawn applications remain visible here rather than being removed from the user's history. |
| Offers          | Proposals the user has received. Opportunities for which the user has received an offer, including pending, accepted, declined, or expired offers.                                                                                                                                                                                                                                                              |
| Contracts       | Work agreements. The opportunity has reached the contractual stage, including upcoming, active, completed, or terminated work.                                                                                                                                                                                                                                                                |
| Assessments     | Qualification activities. Tests, AI interviews, screening exercises, or other qualification activities used to establish expertise or qualify the user for specific opportunities — whether general (not tied to a role) or opportunity-specific.                                                                                                                                                        |
| Talent Network  | Pools the user joined for future consideration. Membership in one or more Talent Network-type Opportunities ([dashboard.md §11.1](dashboard.md#111-opportunity-types)) — no active project or application, just standing eligibility for Verita or a partner to match or invite the user when relevant work becomes available.                                                                                                                                                        |

`Saved` is **not** an Engagement view — see the resolved note below on why it moved to Opportunities ([dashboard.md §6.3](dashboard.md#63-opportunity-views)).

Object model this supports:

`Opportunity` → discoverable work
`Application` → pursuit of an opportunity
`Offer` → proposal of work
`Contract` → formalized work
`Assessment` → qualification activity
`TalentNetworkMembership` → the user's join relationship to a Talent Network-type `Opportunity` ([dashboard.md §11.1](dashboard.md#111-opportunity-types))

`Saved` (user bookmark relationship) and `Match` (system-identified relevance) live in [dashboard.md §6.3](dashboard.md#63-opportunity-views)'s object model instead.

> ✅ **Resolved — Applications preserves history:** an application is never removed or "graduated out" of the `Applications` view when it progresses to an offer or ends in rejection/withdrawal — it stays accessible there with its terminal stage shown, while the offer (if any) also appears under `Offers`. This avoids silently erasing records from the user's mental model.
>
> ✅ **Resolved — Assessment is a first-class object, not an opportunity attribute:** `Assessment` is its own object (general or opportunity-specific), not "an opportunity where an assessment is pending." This matches the AI-marketplace model, where qualification activity (e.g. a general AI interview) can exist independently of any single opportunity.
>
> ✅ **Resolved — no separate Interviews view:** an interview is represented as an `Interview` stage within `Applications` and/or an interview-type `Assessment`, not a sixth top-level view. Adding a dedicated category here would fragment the workflow; a dedicated scheduling surface can be introduced later if interview volume warrants it, without changing this taxonomy.
>
> ✅ **Resolved — Contracts over Active Work:** `Contracts` is the durable container name; `Active` is one possible status a contract can hold (alongside `Awaiting start`, `Paused`, `Completed`, `Terminated`). `Active Work` would misdescribe most non-active contract states, so the container keeps the neutral name and status is tracked separately.
>
> ✅ **Resolved — Applications stage list backed by system enum:** the `Applications` stage list above now maps to the canonical system status enum documented in §8, rather than standing as an independent, informally-defined list. §3's stage model still needs reconciling against this same enum (flagged there).
>
> ⚠️ **Decision needed:** Confirm whether an `Assessment` can be linked to more than one `Opportunity` at once (e.g. a general assessment reused across several applications).
>
> ✅ **Resolved (amended 2026-09-09) — Engagement views tab order:** the tab group is ordered **Applications → Offers → Contracts → Assessments → Talent Network**. `Applications`, `Offers`, and `Contracts` lead as the primary pursuit-to-contract progression (what am I actively pursuing → what's been proposed to me → what I've secured as a contract); `Assessments` follows as supporting qualification activity rather than a destination in itself; `Talent Network` is last as the lowest-urgency, standing-eligibility view — pools joined for future consideration, not active pursuit of a specific opportunity. This supersedes the previous **Applications → Assessments → Offers → Contracts** order (itself keyed to a "Pursuing → Qualifying → Offered → Working" mental model) now that a fifth view exists; the ordering principle is unchanged — progress toward a contract, not object type — it's just re-applied across five views instead of four. (This order at one point also included `Saved` last, as a "secondary queue" — `Saved` has since moved out of Engagements entirely; see the next resolved note.)
>
> ✅ **Resolved — `Saved` moved from Engagements to Opportunities (Discovery):** `Saved` is no longer an Engagement view or object. Although a saved opportunity can technically be considered a lightweight engagement, from an IA and user-mental-model perspective it fits better under **Opportunities** ([dashboard.md §6.3](dashboard.md#63-opportunity-views)) — no actual relationship with the opportunity has started yet at the point of saving. The clearer product boundary:
>
> - **Discovery (Opportunities):** Search → Browse/Match → View opportunity → **Save for later**.
> - **Engagements:** Apply → Assess/Qualify → Receive offer → Contract/Work.
>
> The transition point is **Apply**: an opportunity enters Engagements when the user begins actively pursuing it, or Verita initiates qualification activity tied to it (e.g. an assigned assessment) — not when the user merely bookmarks it. This keeps Engagements from reading as a catch-all for everything the user has touched, and gives the IA a single clean rule: discover the right opportunity, then progress toward work. `Saved` now lives as an Opportunities view alongside `Matches` ([dashboard.md §6.3](dashboard.md#63-opportunity-views)'s object model and views table).
>
> ✅ **Resolved (2026-09-09) — `Talent Network` added as a fifth Engagement view:** unlike the other four views, `Talent Network` doesn't represent pursuit of a specific opportunity — it represents standing membership in a pool for future consideration ([dashboard.md §11.1](dashboard.md#111-opportunity-types)'s `Talent Network` Opportunity type: "no immediate project — the professional joins a qualified pool so Verita can match or invite them when relevant work becomes available"). It belongs in Engagements rather than Opportunities because joining a pool is an affirmative, ongoing relationship the user has entered into — closer to Apply than to Save — even though it doesn't produce an `Application`, `Offer`, or `Contract` on its own. The Engagements transition rule (above) is extended accordingly: an opportunity or pool enters Engagements when the user begins actively pursuing it, **joins it**, or Verita initiates qualification activity tied to it — not when the user merely bookmarks it.
>
> This is the one place an Engagement view and an Opportunity type ([dashboard.md §11.1](dashboard.md#111-opportunity-types)) share a name — `Talent Network` names both the Opportunity type on the `Opportunity` and the Engagement view showing the user's memberships in that type. This is intentional, not the taxonomy collision §1 otherwise warns against: the other Opportunity type (`Engagement` — secured, contract-based work) still has no dedicated Engagement view of its own — a professional's secured work shows up under `Applications`/`Contracts` like any other opportunity type. `Talent Network` gets a dedicated view specifically because membership itself (not an application or contract event) is the object worth surfacing.
>
> ⚠️ **Decision needed:** Confirm the `TalentNetworkMembership` object's fields (at minimum: user ID, Opportunity/pool ID, joined date, status — active/left/removed) and whether a professional can belong to more than one Talent Network pool at once.

## 3. Applications

Each application summary must include:

- Opportunity title and partner label.
- Current stage and status.
- Last meaningful update.
- Next action.
- Next-action owner: professional, Verita, or partner.
- Deadline when applicable.
- Progress only when it maps to meaningful completed requirements; avoid cosmetic percentages.

### Row interaction

The entire application row is a single click target routing to the application detail (where the full next-action and owner state live) — there is no separate CTA button on the row itself. On hover, reveal a trailing arrow affordance to signal the row is interactive, consistent with restrained motion (no delay to interactivity).

> ⚠️ **Decision needed — next-action owner scoped to the professional for now:** at this stage, outstanding steps shown on an application (e.g. "2 of 4 steps completed") are modeled as always belonging to the professional — not yet distinguishing "waiting on you" from "waiting on Verita" or "waiting on partner" inline on the row. This narrows the "Next-action owner: professional, Verita, or partner" requirement above to professional-only for the row summary; whether owner must still surface inline (vs. only after clicking through to detail) needs confirmation with product before this is treated as final.

Suggested application lifecycle:

`Interested → Application started → Requirements pending → Submitted → Under review → Interview → Selected → Offer → Contracting → Onboarding → Active → Completed`

Terminal alternatives must include at least rejected and withdrawn.

> ⚠️ **Decision needed:** This lifecycle predates the canonical system status enum now documented in §8 and does not fully align with it (e.g. the enum has no `Selected` distinct from `ACCEPTED`, and stages past `Offer` belong to the `Contract` object per §2, not the `Application`). Reconcile this suggested lifecycle against §8 — likely narrowing it to the pre-offer stages only, since `Offer`/`Contracting`/`Onboarding`/`Active`/`Completed` are separate objects (`Offer`, `Contract`) in the §2 model, not later Application stages.

## 4. Offers and contracting

> ⚠️ **Decision needed:** The Offer definition, flow position, and field list below are a proposed model, not yet confirmed with product. Verify against actual marketplace/operating-model behavior before treating this as final.

**Offer:** a formal proposal for the professional to perform work, issued after they have been selected for an opportunity and before the engagement is finalized.

An Offer is typically created after the company or Verita decides they want to engage the professional. It means _"we want to work with you under these proposed terms"_ and sits at a specific point in the flow:

`Opportunity → Application / Match → Review / Assessment → Offer → Contract → Active work`

An Offer can include:

- Role or project
- Company or partner
- Compensation or rate
- Engagement type
- Expected hours
- Start date
- Duration
- Scope or responsibilities
- Offer expiration date
- Any conditions or remaining requirements

The professional can then:

- Accept
- Decline
- Potentially request changes or discuss terms, depending on the marketplace model

Once accepted, the offer typically moves into Contract or contract preparation.

> ℹ️ Depending on Verita's operating model, the offer may technically come from Verita on behalf of the client rather than directly from the company — hence the generic definition above rather than one naming a specific issuing party.
>
> ⚠️ **Decision needed:** A dedicated "Offer fields" data-model subsection (parallel to [dashboard.md §9.4](dashboard.md#94-match-fields) Match fields, this doc's §7 Application fields) is intentionally not added yet — hold until the definition above is confirmed with product, so the data model isn't built on an unconfirmed object shape.

> ✅ **Resolved — Offer is not a Match:** a `Match` means the system thinks the opportunity is a good fit for the professional ([dashboard.md §6.3](dashboard.md#63-opportunity-views), [§9.4](dashboard.md#94-match-fields)) — it is a system-generated relevance signal, produced before the professional applies. An `Offer` means the company (or Verita on its behalf) has actually selected the professional and is proposing work — it is a real proposal issued after selection. These are different objects at opposite ends of the flow above and must not be conflated in card content, CTAs, or status language.
>
> ✅ **Resolved — Offer cards show expiration, not a match tier:** a concrete consequence of the above — an Offer card (Home module or Engagements → Offers view) must not display a fit tier (`Strong match`, `Good match`, etc.); that vocabulary belongs to `Match` ([dashboard.md §6.3](dashboard.md#63-opportunity-views), [§7.3](dashboard.md#73-matching-opportunities)) and no longer applies once an opportunity has produced an offer. Instead, the Offer card's primary supporting fact is its **expiration** — the offer is available for a limited timeframe for the professional to accept, so the card must surface the expiration date/time prominently (material deadlines get date, time, and timezone), not a relevance signal. **Confirmed in Figma (2026-08-30):** the Offers card now shows "Expires on [date]" in place of a match tier.
>
> ✅ **Resolved — an opportunity with an active Offer is suppressed from Matches:** once an opportunity has produced an offer, it must not also surface in the Matches view or the Home "Matching opportunities" module ([dashboard.md §7.3](dashboard.md#73-matching-opportunities)) — the Offers module becomes the single place that opportunity is shown. A professional who already has an offer for a role has something more advanced to act on than a match, so re-surfacing it as "Strong match"/"Good match" elsewhere is both redundant and confusing about what stage they're actually at.
>
> ✅ **Confirmed in Figma (2026-08-30):** the Offers card now shows a different opportunity ("Sleep Specialist, Behavioral Sleep Medicine Professional") than any listed under `Matches for you` — the earlier duplication (the same "Clinical Expert" card appearing in both modules) is resolved.

An offer must become a distinct, high-priority state rather than being buried inside applications. The Dashboard/Engagements surfaces must support:

- Offer ready for review.
- Offer expiration.
- Contract ready to sign.
- Background check, tax paperwork, or payment setup when required.
- Training or orientation dependencies.

## 5. Active engagement

When work is active, current engagement information must outrank job discovery on Home ([dashboard.md §7.6](dashboard.md#76-applications-offers-active-engagement-training-payments) references this). The summary may include:

- Engagement and partner.
- Status, dates, expected hours, and rate.
- Current-week progress where supported.
- Required actions.
- Deliverables and upcoming milestones.
- Training status.
- Earnings and next payment where supported.
- Relevant messages or notifications.

### 5.1 Contract availability vs. Profile availability

> ✅ **Resolved:** an active `Contract` may require the expert to submit their planned availability or allocated hours at the beginning of each week. This `ContractAvailability` is a **separate data object** from `Profile`'s `Availability` ([`my-profile.md` §11.2](my-profile.md#112-typical-schedule)'s Typical schedule), not the same object read in a different context:

| | Profile availability ([`my-profile.md` §11.2](my-profile.md#112-typical-schedule)) | Contract availability |
| --- | --- | --- |
| What it represents | General working schedule | Specific weekly commitment |
| Cadence | Configured once, updated as needed | Submitted for each applicable week |
| Used for | Matching | Planning an active engagement |
| Belongs to | `Profile` | `Contract` |

`ContractAvailability` belongs to `Contract`, not to `Profile` — it exists only while the contract is active and has no bearing on matching. The recurring weekly submission this produces is a **Recurring** task per [`product-specs/next-steps-card.md` §3.1](next-steps-card.md#31-task-generation-model) (generated per active contract, on a weekly cadence), distinct from any one-time confirmation of Profile's Typical schedule.

## 6. Training

Training is a first-class workflow related to an engagement. It must support:

- Required versus optional training.
- Module and overall completion status.
- Estimated time.
- Deadline.
- Continue action.
- Completion, score, attempt, certification, or expiration data only where relevant and approved for display.

## 7. Payments

Payment setup should appear contextually when an engagement or first payment makes it relevant. It may show:

- Setup or verification status.
- Required tax or payout action.
- Earnings balance and pending payout.
- Next payout.
- Payment issue.

Sensitive payment details must remain in the dedicated payment flow and must not be exposed on the Dashboard or Engagements list surfaces.

## 8. Application status enum

`Current stage and status` (§3) is backed by a canonical system enum, distinct from the plain-language stage labels used for display in §2 and §3. Engagements/Dashboard surfaces must map the system enum to user-facing language rather than surface these values directly.

| System status       | Meaning                                                         | User-facing label |
| ------------------- | --------------------------------------------------------------- | ----------------- |
| `APPLIED`           | Initial state after submission.                                 | Applied           |
| `SCORING_PENDING`   | Waiting for AI scoring.                                         | In review         |
| `INTERVIEW_PENDING` | Scheduled for AI interview.                                     | Interview         |
| `UNDER_REVIEW`      | Ops is evaluating.                                              | In review         |
| `INTERVIEW`         | In interview stage.                                             | Interview         |
| `ACCEPTED`          | Offer extended — creates an `Offer` object (§2 Offers view).    | Offer received    |
| `REJECTED`          | Declined by ops.                                                | Not selected      |
| `ON_HOLD`           | Parked for later.                                               | On hold           |
| `WITHDRAWN`         | Candidate withdrew.                                             | Withdrawn         |

> ✅ **Resolved:** `ACCEPTED` is an **Application** status, not a Contract or Engagement status — it marks the moment an offer is extended and creates a corresponding `Offer` object (§2's object model: `Offer` → proposal of work). The application itself stays visible under `Applications` with this status, per §2's "Applications preserves history" resolution — it does not move to the `Offers` view, the `Offer` object does.
>
> ✅ **Resolved — `INTERVIEW_PENDING` and `INTERVIEW` intentionally share the "Interview" label:** confirmed as load-bearing, not incidental — [`applications-card.md` §2.4.1](applications-card.md#241-status-matrix) relies on `Interview` staying the single application-level status label across every interview-related condition (requested, scheduled, and completed/awaiting review), with the actual condition carried by that surface's supporting text instead of a second status label. Any future addition of an `INTERVIEW_COMPLETED`-style status (see that doc's open questions) must continue mapping to the same "Interview" label, not introduce a new one.
>
> ⚠️ **Decision needed:** `ON_HOLD` has no equivalent in the §2 Applications stage list (`Not submitted, Applied, In review, Interview, Not selected, Withdrawn`) or the §3 suggested lifecycle. Confirm whether "On hold" should be added as a user-facing stage in both places.
>
> ⚠️ **Decision needed — `Applied` → `In review` transition trigger:** `SCORING_PENDING` and `UNDER_REVIEW` both map to "In review" (label collapsing is resolved), but the authoritative *trigger* for the `Applied` → `In review` transition itself is not yet defined. `SCORING_PENDING` means AI scoring is queued, not that scoring or evaluation has actually started — transitioning the visible status the instant `SCORING_PENDING` is set risks the UI claiming an application is being reviewed before the system can substantiate it. Confirm whether entering `SCORING_PENDING` alone is sufficient to trigger the transition, or whether it should wait for `UNDER_REVIEW` (ops actually evaluating). See [`applications-card.md` §3](applications-card.md#3-stage-and-status-model) for the corresponding card-level supporting-text rule, which is independent of this decision.
>
> ✅ **Resolved — `Not submitted` replaces `In progress` as the pre-submission stage name:** the stage for an application that's been started but not yet submitted is named `Not submitted`, not `In progress` — it names the application's actual condition rather than an ambiguous phrase that could be misread as active review. This applies wherever this pre-submission stage is referenced across this doc and [`applications-card.md`](applications-card.md#241-status-matrix). It remains a proposed stage/label, not yet backed by a system status in the enum below — see the open item in §12.

## 9. Application fields

At minimum:

- Application, opportunity, and user IDs.
- Source: match-generated or user-discovered.
- Started and submitted timestamps.
- Current stage and status.
- Required and completed screening, assessment, and interview steps.
- Last meaningful update.
- Next action and next-action owner.
- Deadline.
- Rejection or withdrawal reason when applicable.

## 10. Talent Network membership fields

At minimum (per §2's resolved note — exact shape not yet confirmed):

- User and Opportunity/pool IDs.
- Joined timestamp.
- Membership status: active, left, or removed.

> ⚠️ **Decision needed:** see §2's resolved note on `Talent Network` — confirm this field list and whether a professional can hold more than one active membership at once.

## 11. Entities

Entities owned by this doc's scope (full list, including entities Home also references, lives in [dashboard.md §9.1](dashboard.md#91-entities)):

- `Application`
- `Interview`
- `Offer`
- `Engagement`
- `ContractAvailability` (§5.1) — belongs to `Contract`/`Engagement`, distinct from `Profile`'s `Availability` ([`my-profile.md` §11](my-profile.md#11-availability-tab))
- `Training`
- `Payment`
- `TalentNetworkMembership`

Relevant slice of [dashboard.md §9.2](dashboard.md#92-relationships)'s ownership tree (see that section for the full tree and how to read it):

```text
User
├── Applications
│   └── Opportunity
├── Interviews
├── Offers
├── Engagements
│   ├── ContractAvailability
│   ├── Training
│   └── Payments
├── TalentNetworkMemberships
│   └── Opportunity
```

## 12. Open questions

- 🙋 What is the canonical application stage/status model?
- 🙋 Which system owns next-action state and deadlines?
- 🙋 Can professionals have multiple active engagements?
- 🙋 What engagement progress, earnings, and performance data is appropriate for Home vs. the full Engagements page?
- 🙋 What happens when an opportunity closes while a professional completes a prerequisite?
- 🙋 Can a professional belong to more than one Talent Network pool at once (§2, §10)?

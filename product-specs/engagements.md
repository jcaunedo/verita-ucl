<!--
Created: Sep 8, 2026
Created by: Julio Caunedo
Last updated: Sep 25, 2026
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

> ✅ **Resolved (amended 2026-09-09 — `Talent Network` added as a fifth view):** "Engagements" is broader than contracts only — it represents the user's relationship with opportunities from the point they start actively pursuing one, or join a pool for future consideration, providing a single destination for the user's ongoing and historical interactions with opportunities (applications, qualification activity, offers, contracts, and talent-pool membership). It is organized into **Engagement views** (§2): `Applications`, `Offers`, `Contracts`, `Assessments`, and `Talent Network`. `Saved` was originally included here as a view; it has since moved to Opportunities ([dashboard.md §6.3](dashboard.md#63-opportunity-views)) because bookmarking an opportunity starts no actual relationship with it — the Engagements boundary is now Apply (or Join, for Talent Network), not discovery. These views are different marketplace objects/relationships. `Applications`, `Offers`, and `Contracts` are progressive destinations along one journey: an opportunity moves from one to the next rather than being copied into each (§2's "progressive destinations" resolved note). `Assessments` and `Talent Network` sit outside that sequence. **Engagement views are distinct from Opportunity types** ([dashboard.md §11.1](dashboard.md#111-opportunity-types): Engagement, Talent Network) — Opportunity type describes whether the Opportunity offers secured work at all; an Engagement view describes which marketplace object the user is looking at. `Talent Network` is the one exception where the view name and the Opportunity type name coincide — see §2's resolved note on why that's intentional, not a taxonomy collision.
>
> ⚠️ **Decision needed:** Confirm whether "Your applications," "Contracts," and "Offers" remain distinct Home-page modules ([dashboard.md §6](dashboard.md#6-information-architecture), items 3/5/6) pointing into this Engagements destination, or should be merged/renamed to match the views named here.

## 2. Engagement views

Views within Engagements that organize the user's interactions with opportunities. These views represent different marketplace objects or relationships. `Applications → Offers → Contracts` are progressive destinations: an application lives under `Applications` until it produces an offer, the offer lives under `Offers` until it's accepted and contracting completes, and the contract then lives under `Contracts` (see the "progressive destinations" resolved note below). `Assessments` and `Talent Network` sit outside that sequence.

Listed below in tab order (see the resolved note below the table): `Applications → Offers → Contracts → Assessments → Talent Network`.

| View            | Meaning                                                                                                                                                                                                                                                                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Applications    | Specific opportunities the user has pursued. Applications still in the application process, plus applications that ended without an offer, with their current stage. Once an application produces an offer it leaves this view, and the Offer takes over under `Offers`. User-facing labels: `Applied`, `Action required`, `Interview scheduled`, `In review`, `On hold`, `Not selected`, `Withdrawn`, or `Closed` (backed by the system status enum, §8 — `Closed` is a proposed addition, not yet backed by a system status; see §8). There is no draft or unsubmitted state: applying submits the application immediately (§3). Not selected, withdrawn, and closed applications remain visible here rather than being removed from the user's history, grouped under the `Not moving forward` filter (§3.1). |
| Offers          | Proposals the user has received. Offers awaiting a response, and accepted offers until contracting completes and the Contract takes over under `Contracts`. Declined offers stay here under the `Declined` filter as the Offers history (§4.1).                                                                                                                                                                                                                                                              |
| Contracts       | Work agreements. The opportunity has reached the contractual stage, including upcoming, active, paused, completed, or terminated work. `Completed` contracts are the history of work the professional secured, the same way `Not moving forward` is the history of applications that ended without an offer (where terminated contracts go is still open, §5.2).                                                                                                                                                                                                                                                                |
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

> ✅ **Resolved (2026-09-23) — Applications → Offers → Contracts are progressive destinations:** this replaces the earlier "Applications preserves history" rule, under which every application stayed in `Applications` after producing an offer. That rule treated `Applications` as a full archive, which conflicts with what `Open` now means: applications still in the application process (§3.1). The rule now:
>
> - An application stays in `Applications` while the application process is active, or when it ends without an offer. `Not moving forward` is the history of unsuccessful applications.
> - Once an offer is issued, the opportunity moves to `Offers` and leaves the `Applications` views. The Offer owns the proposed terms, the expiration, and Accept/Decline (§4).
> - Once the offer is accepted and contracting completes, it moves to `Contracts`. `Completed` contracts are the history of successful work.
>
> Each view answers one question. `Applications`: where did my candidacy end up? `Offers`: what proposal do I need to review or manage? `Contracts`: what work have I secured? Accepting an offer doesn't create a Contract by itself: the Offer stays the active object until contracting completes. This also means one real-world event never shows up as two actionable items in two views.
>
> Each view keeps its own history under a filter: `Not moving forward` in `Applications`, `Declined` in `Offers` (§4.1), and `Completed` in `Contracts` (§5.2).
>
> ⚠️ **Decision needed:** whether the Offer and Contract detail link back to the original application so the candidacy record is still reachable.
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

The entire application row is a single click target routing to the application detail (where the full next-action and owner state live) — there is no separate CTA button on the row itself. On hover or focus, the row reveals a `···` more-actions button (View Details, Share, Withdraw). There is no trailing arrow. The menu's items and behavior are defined in [`applications-card.md` §4.1](applications-card.md#41-actions-menu).

> ⚠️ **Decision needed — next-action owner scoped to the professional for now:** at this stage, outstanding steps shown on an application (e.g. "2 of 4 steps completed") are modeled as always belonging to the professional — not yet distinguishing "waiting on you" from "waiting on Verita" or "waiting on partner" inline on the row. This narrows the "Next-action owner: professional, Verita, or partner" requirement above to professional-only for the row summary; whether owner must still surface inline (vs. only after clicking through to detail) needs confirmation with product before this is treated as final.

Suggested application lifecycle:

`Interested → Applied → Interview → Selected → Offer → Contracting → Onboarding → Active → Completed`

✅ **Resolved (2026-09-23) — Apply submits immediately; no draft state:** in Verita's flow, clicking Apply submits the application at once. There is no `Not submitted`, `Draft`, or `In progress` application, so the earlier `Application started` and `Submitted` stages are gone from the lifecycle and `Applied` is the first Application stage. Requirements the professional still owes after applying (e.g. an assessment) are shown as `Action required` (or `Interview · Action required` during an interview, §8), not as a pre-submission stage. Conceptually:

- `Opportunity → Apply → Open → Offer → Contract` (the application leaves `Applications` at `Offer`, §2)
- `Opportunity → Apply → Open → Not moving forward`

Terminal alternatives must include at least rejected, withdrawn, and closed — surfaced together as the `Not moving forward` filter (§3.1).

> ⚠️ **Decision needed:** This lifecycle predates the canonical system status enum now documented in §8 and does not fully align with it (e.g. the enum has no `Selected` distinct from `ACCEPTED`, and stages past `Offer` belong to the `Contract` object per §2, not the `Application`). Reconcile this suggested lifecycle against §8 — likely narrowing it to the pre-offer stages only, since `Offer`/`Contracting`/`Onboarding`/`Active`/`Completed` are separate objects (`Offer`, `Contract`) in the §2 model, not later Application stages.

### 3.1 Application filters

The `Applications` view is filtered by two top-level groups that describe where an application stands, not its exact stage. The specific user-facing status label (§8) still renders on each row; the filter is a grouping over those labels, not a replacement for them.

| Filter                 | Meaning                                                                                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Open**               | Application is still in the application process: waiting on a decision, in an interview, or needing action from the professional. Ends when an offer is issued (the application then leaves `Applications` for `Offers`) or when the application stops progressing. |
| **Not moving forward** | Application is no longer progressing, for any reason.                                                                                                                                                   |

Inside `Not moving forward`, the row shows the specific outcome:

- **Not selected** — the partner chose another applicant or decided not to continue.
- **Withdrawn** — the applicant chose to stop pursuing the opportunity.
- **Closed** — the opportunity closed before the application advanced (it stopped accepting applications, or the available slots were filled).

The resulting model:

- `Opportunity → Apply → Open → Offers → Contracts`
- `Open → Not moving forward` (`Not selected`, `Withdrawn`, or `Closed`)

✅ **Resolved (2026-09-24) — `Moving forward` removed; `Open` covers every active application:** Engagements is a live tracking view of what the professional is pursuing, not an archive. For `Applications`, what matters is seeing every active application, its status, and any action required on it, in one list. A separate `Moving forward` filter split that list in two without telling the professional anything the row's status label doesn't already say. An application that advances doesn't need a filter of its own: once it produces an offer, the professional tracks it under `Offers`, and once the offer is accepted and contracting completes, under `Contracts`. History stays with the object the item ended as: `Not moving forward` for applications, `Declined` for offers (§4.1), and `Completed` for contracts (§5.2). This supersedes the three-filter model (`Open`, `Moving forward`, `Not moving forward`) from 2026-09-23.

✅ **Resolved (2026-09-23) — `Not moving forward` is the umbrella, `Closed` is one reason:** `Closed` is not used as the top-level filter name. As the umbrella, it would blur three different outcomes into one; as a concrete reason, it stays clearly distinct from `Not selected`. `Closed` is defined around the **opportunity**, not the applicant ("the opportunity closed before the application advanced"), while `Not selected` is a decision about the applicant. This extends the existing model, where `Not selected` and `Withdrawn` were already separate outcomes (§2, §8), rather than contradicting it.

Proposed status → filter mapping (labels per §8):

| Filter                 | User-facing statuses                                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Open**               | `Applied`, `Action required`, `Interview · Action required`, `Interview scheduled`, `In review`, `On hold` |
| **Not moving forward** | `Not selected`, `Withdrawn`, `Closed`                                                                       |

✅ **Resolved (2026-09-23) — `Offer received` is not an Applications list status:** `Open` means the application itself is still in the application process. Once an offer is issued, the application has reached its successful outcome and the `Offer` owns what happens next, so the row leaves `Applications` for `Offers` (§2's "progressive destinations" note). The Applications row keeps no "View offer" action: the row stays a single click target to application detail (§3's row interaction), and offer actions live on the Offer.

`Action required` has no filter of its own. Both forms sit under `Open`: the standalone status before an interview, and the `Interview · Action required` suffix during one.

**Counts:**

- **Filter counters:** `Open` shows no counter, because its count is already the `Applications` view-tab count (below) and repeating it on the filter is redundant. `Not moving forward` shows no counter either (design direction, 2026-09-24). So no `Applications` filter shows a counter; `Offers` and `Contracts` keep theirs on `Declined` and `Completed`. A filter with zero applications stays visible and selectable; only its counter is hidden, never shown as "0".
- **Applications total:** the count on the `Applications` view tab is the number of active applications, which is the `Open` count. Applications under `Not moving forward` are not included, but they stay visible under that filter. Offers aren't counted here either: an application that produced an offer has left this view, so each pending offer is counted once, on the `Offers` tab.

✅ **Resolved (2026-09-24) — no counter on `Open`:** the `Open` count and the view-tab count are the same number, shown a few pixels apart. The view tab keeps it; the `Open` filter drops it. The same rule applies to `Offers` (§4.1), whose view-tab count is also `Open` only, and to `Contracts`' `Current` filter (§5.2).

**Default sort (`Open`):** rows are ordered by what the professional needs to do next, most urgent first. Each status belongs to one rank, and ranks are listed top to bottom:

| Rank | Statuses                                         | Why it ranks here                                                                  | Order within the rank                                                   |
| ---- | ------------------------------------------------ | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1    | `Action required`, `Interview · Action required` | The application is waiting on the professional and can't advance until they act.   | Nearest deadline first. Rows without a deadline follow rows that have one. |
| 2    | `Interview scheduled`                            | A confirmed event the professional has to attend.                                  | Soonest interview first.                                                |
| 3    | `In review`                                      | The professional has finished the interview and a decision is the next step.       | Most recent update first.                                               |
| 4    | `Applied`                                        | Submitted and waiting on Verita or the partner. Nothing is needed from the professional. | Most recently applied first.                                       |
| 5    | `On hold`                                        | Paused. Nothing is expected from anyone right now.                                 | Most recent update first.                                               |

"Most recent update" is the application's last meaningful update (§9). Remaining ties break by most recently applied, then by application ID, so the list never reorders between visits without a status change ([dashboard.md §4](dashboard.md#4-dashboard-priority-engine)'s deterministic tie-breaking rule). A row moves when its status changes: once the professional completes a required action, the row drops to the rank of its new status.

**Sections (`Open`):** `Open` is split into three labeled sections, listed top to bottom. Each section is its own list. A section with no applications is hidden. The default sort above applies within each section.

| Section          | What it holds                                                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Need action**  | Every open application where the professional owns the next action (§3, §9), however old it is: complete an assessment, schedule an interview, finish an application step, provide requested information, or respond to another required step. In status terms: `Action required` and `Interview · Action required`. |
| **Last 15 days** | Every other open application whose last meaningful update (§9) was 15 days ago or less. This is the main monitoring area: `Applied`, `Interview scheduled`, `In review`, `On hold`. |
| **Older**        | Open applications whose last meaningful update was more than 15 days ago. They stay visible because they're still open, but lower in the page. |

`Need action` overrides recency. An application that has been waiting on the professional for 22 days belongs in `Need action`, not `Older`. Once the professional completes the action, the next-action owner changes and the row moves to `Last 15 days`, because completing the action is itself a meaningful update.

`Not moving forward` has no sections. It is the history of applications that ended, so a single list is enough.

✅ **Resolved (2026-09-25) — `Open` sections instead of more status filters:** Engagements is an operational tracking surface, not a chronological archive. Status filters answer "where does this application stand?", and each row's status label already answers that. Sections answer a different question: "what deserves my attention first?". The result:

- `Open` → `Need action` → `Last 15 days` → `Older`: the working queue.
- `Not moving forward`: the application history.

This adds no new filters. It maps to data the application already carries: the next-action owner (professional, Verita, or partner, §3 and [`applications-card.md` §2.2](applications-card.md#22-next-action-owner)) and the last meaningful update (§9). Figma: Verita → `Engagements` (`node-id=5672-4301`).

✅ **Copy fix:** the Figma section label reads "Last 15 day". The spec and the prototype use "Last 15 days".

⚠️ **Decision needed:** which events count as a "last meaningful update" for placing a row in `Last 15 days` or `Older`: status changes only, or also partner messages, document requests, and interview reschedules. A professional viewing the application should not count.

⚠️ **Dependency:** `Need action` depends on the next-action owner, which §3 currently models as professional-only for the row summary. The section needs the system to tell "waiting on you" apart from "waiting on Verita or the partner" for every open application, even if the row never shows the owner label.

⚠️ **Decision needed:** the default sort for `Not moving forward`, likely most recent outcome first, and whether the professional can change the sort in either filter.

**Search:** a search button sits before the filters. Collapsed, it is an icon-only button. Clicking it expands it in place into a search input. Search narrows the rows shown, alongside the selected filter.

⚠️ **Decision needed:** which fields search matches (e.g. opportunity title, partner name) and whether it searches only the selected filter or all applications. The same applies to what happens to the input when the professional switches filters or clears it.

Every application starts in `Open`: applying submits immediately, so there is no draft state that sits outside the two filters.

✅ **Resolved (2026-09-23) — `On hold` is `Open`:** an application on hold is paused, not ended. It is still an open application with no final partner decision, so it stays under `Open`. Where `ON_HOLD` sits in the lifecycle (§8) is a separate question and still open.

✅ **Resolved (2026-09-24) — interview statuses are `Open`:** this closes the earlier risk that an AI interview (`INTERVIEW_PENDING`, §8) might be a standard screening step rather than a positive partner signal, and so not belong under `Moving forward`. With `Moving forward` removed, every interview status sits under `Open`, whatever the interview means for the partner's decision.

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

Where it lives: an Offer appears under `Offers` from the moment it's issued, when the application leaves `Applications` (§2). It stays there through acceptance and contracting, and moves to `Contracts` once contracting completes. The view's filters are in §4.1.

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

### 4.1 Offer filters

The `Offers` view uses the same search button and filter row as `Applications` (§3.1) and `Contracts` (§5.2), with two filters:

| Filter       | Meaning                                                                              |
| ------------ | ------------------------------------------------------------------------------------ |
| **Open**     | Offers awaiting the professional's response, and accepted offers still in contracting. |
| **Declined** | Offers the professional declined.                                                    |

Search and counter behavior follow §3.1: the search button sits before the filters, `Open` shows no counter, and a filter with zero offers keeps its tab but hides its counter. The `Offers` view-tab count is `Open` only, so it reflects the offers that still need attention.

✅ **Resolved (2026-09-24) — offers are declined from the row's `···` menu:** an open offer's row, on the Home "New offer for you" module and in `Offers` → `Open`, reveals a `···` actions menu on hover, the same pattern as application rows ([`applications-card.md` §4.1](applications-card.md#41-actions-menu)). Its items are **View details** and a destructive **Decline**, with no separator between them. Decline moves the offer to `Declined`; on Home the card fades out and the module closes. A declined offer's menu has only View details, and its row no longer shows the expiration date, since a declined offer doesn't expire. This replaces the earlier hover X, which declined the offer while reading as "hide".

⚠️ **Gap:** Decline runs immediately, with no confirmation or undo, like Withdraw on applications ([`applications-card.md` §4.1](applications-card.md#41-actions-menu)). Declining an offer is irreversible, so the product likely needs the same confirmation step once UCL has a dialog component.

✅ **Resolved (2026-09-23) — `Declined` is the Offers history:** it works the same way as `Not moving forward` in `Applications` (§3.1) and `Completed` in `Contracts` (§5.2). Declined offers stay visible under this filter and aren't counted in the view-tab total.

⚠️ **Decision needed:** whether expired offers (and any offer withdrawn by the partner or Verita) also go under `Declined`. "Declined" describes the professional's choice, so using it as the umbrella for an expired offer would blur two different outcomes, the same reason `Closed` wasn't made the umbrella for `Not moving forward` (§3.1). Options: rename the filter to a neutral umbrella and show `Declined` / `Expired` as row-level reasons, or keep `Declined` and give expired offers their own treatment.

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

### 5.2 Contract filters

The `Contracts` view uses the same search button and filter row as `Applications` (§3.1), with two filters:

| Filter        | Meaning                                          |
| ------------- | ------------------------------------------------ |
| **Current**   | The contract is still in effect: awaiting start, active, or paused. |
| **Completed** | The work under the contract has finished.        |

Search and counter behavior follow §3.1: the search button sits before the filters, `Current` shows no counter (like `Open` in the other views), and a filter with zero contracts keeps its tab but hides its counter.

✅ **Resolved (2026-09-24) — the default contracts filter is `Current`, not `Open` or `Active`:** "Open contract" reads awkwardly for work in progress. `Active` would clash with the `Active` contract status: the filter also holds `Awaiting start` and `Paused` contracts, so an "Active" filter would list contracts badged `Paused`. `Current` describes every contract still in effect without naming a status. `Applications` and `Offers` keep `Open`.

✅ **Resolved (2026-09-24) — `Paused` is `Current`:** a paused contract is still in effect, just not running, so it stays under `Current` with `Awaiting start` and `Active`. This matches Home, which keeps paused contracts in "Current contracts" ([`contract-card.md` §6.1](contract-card.md#61-contract-status-rules)).

⚠️ **Decision needed:** where terminated contracts go is not defined: under `Completed`, or in a third filter.

⚠️ **Decision needed:** whether the `Contracts` view-tab count includes completed contracts or only current ones. The `Applications` count is active-only (§3.1 "Counts"). Hiding the `Current` counter assumes the view tab counts current contracts only: if it counts completed contracts too, the `Current` count is no longer redundant and should come back.

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
| `SCORING_PENDING`   | Waiting for AI scoring.                                         | Applied           |
| `INTERVIEW_PENDING` | Scheduled for AI interview.                                     | Interview scheduled |
| `UNDER_REVIEW`      | Ops is evaluating.                                              | Applied           |
| `INTERVIEW`         | In interview stage.                                             | In review         |
| `ACCEPTED`          | Offer extended — creates an `Offer` object (§2 Offers view).    | Offer received    |
| `REJECTED`          | Declined by ops.                                                | Not selected      |
| `ON_HOLD`           | Parked for later.                                               | On hold           |
| `WITHDRAWN`         | Candidate withdrew.                                             | Withdrawn         |
| *(none yet)*        | Opportunity closed (stopped accepting applications, or slots filled) before this application advanced. Proposed. | Closed            |

> ✅ **Resolved:** `ACCEPTED` is an **Application** status, not a Contract or Engagement status — it marks the moment an offer is extended and creates a corresponding `Offer` object (§2's object model: `Offer` → proposal of work). At this point the application leaves the `Applications` views and the `Offer` takes over under `Offers` (§2's "progressive destinations" note). The `Offer received` label stays for any surface that still shows the application record, such as application detail. It never renders as an Applications list row.
>
> ✅ **Resolved (2026-09-23) — interview labels:** `Interview · Action required` while the professional still has to book the interview, `Interview scheduled` (`INTERVIEW_PENDING`) once a time is confirmed, and `In review` (`INTERVIEW`) after it's completed and awaiting an outcome. This supersedes the earlier rule that `INTERVIEW_PENDING` and `INTERVIEW` share one "Interview" label; see [`applications-card.md` §2.4.1](applications-card.md#241-status-matrix).
>
> ⚠️ **Constraint:** `INTERVIEW` is defined above only as "In interview stage". Confirm it represents a completed interview awaiting an outcome, and that the system can tell "still has to book" apart from "time confirmed" within `INTERVIEW_PENDING`.
>
> ✅ **Resolved (2026-09-23) — `Closed` added as a proposed terminal outcome:** `Closed` joins `Not selected` and `Withdrawn` under the `Not moving forward` filter (§3.1). It describes the opportunity closing, not a decision about the applicant, so it must not be mapped from `REJECTED`. No system status backs it yet — see §12.
>
> ⚠️ **Decision needed:** `ON_HOLD` has no equivalent in the §2 Applications stage list (`Applied, Action required, Interview, Not selected, Withdrawn, Closed`) or the §3 suggested lifecycle. Confirm whether "On hold" should be added as a user-facing stage in both places.
>
> ✅ **Resolved (2026-09-23) — `In review` only after an interview:** `APPLIED`, `SCORING_PENDING`, and `UNDER_REVIEW` all show `Applied`, so the professional sees one status between submission and a decision. `In review` is used only after a completed interview (`INTERVIEW`), when the professional has done their part and is waiting for an answer. An application with an outstanding requirement before any interview shows `Action required` (warning tone, under `Open`).
>
> ✅ **Resolved (2026-09-23) — no pre-submission status:** `Not submitted` is removed from the model, superseding the earlier resolution that renamed `In progress` to `Not submitted`. Applying submits immediately (§3), so `APPLIED` is the first status and no backing enum value is needed for a draft state.

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
- Rejection, withdrawal, or closure reason when applicable.

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
- 🙋 What happens when an opportunity closes while a professional completes a prerequisite? Because applying submits immediately, the application already exists and becomes `Closed` (§3.1). Still open: what happens to a prerequisite the professional has started but not finished (e.g. a half-completed assessment).
- 🙋 Define a system status backing `Closed` (§8), and which event sets it: the opportunity closing to new applications, the last slot being filled, or both.
- 🙋 Can a professional belong to more than one Talent Network pool at once (§2, §10)?
- 🙋 Where do terminated contracts go in the `Contracts` filters, and does the view-tab count include completed contracts (§5.2)?
- 🙋 What is the default sort for `Not moving forward`, and can the professional change the sort in either Applications filter (§3.1)?
- 🙋 Applications search (§3.1): which fields does it match, does it search only the selected filter or all applications, and does the query persist when the filter changes?
- 🙋 Which events count as a "last meaningful update" when placing an open application in `Last 15 days` or `Older` (§3.1 "Sections")?

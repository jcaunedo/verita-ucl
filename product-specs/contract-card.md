<!--
Created: Sep 17, 2026
Created by: Julio Caunedo
Last updated: Sep 20, 2026
Scope: Verita AI Dashboard — the Contracts module's card content, split out of the Dashboard PRD (product-specs/dashboard.md) [§6](dashboard.md#6-information-architecture) and backed by the Active engagement definition in product-specs/engagements.md [§5](engagements.md#5-active-engagement).
Purpose: Define the Contract card's engagement-terms/contract-status/action-state component architecture, its content (tiered by Essential/Contextual/Actionable, compensation-model-aware), and its priority behavior as a Home-module surface over the underlying Contract object.
-->

# Contract Card

**Status:** Draft for product and design alignment

**Figma reference:** [Contract Card](https://www.figma.com/design/Q2IVVTNZQaWHDkUiWztX3C/verita.ds?node-id=5891-881&t=4kYL66ITNMr5u2AL-11) — the base component structure referenced throughout §3, including the confirmed anatomy layout (§3.1), icon-led Terms rows, and the `showDuration` toggle (§3.2.1).

## 1. What the Contract card is

The Contract card is how a professional sees their current work at a glance on Home and in Engagements/Contracts — a quick preview of a contract they're on or about to start, with just enough detail to know what it is and what, if anything, they need to do next. The full details of that contract live elsewhere; this card is only the summary.

The Contract card is a reusable component that represents an individual active work agreement on the Dashboard.
It maintains a consistent structure across engagements while adapting compensation, timeline information, progress indicators, and actions to the contract's specific characteristics.
Progress is conditional on reliable operational data and must never be simulated to achieve visual consistency.
The component supports multiple concurrent contracts independently. Its primary action opens the corresponding Verita work environment, while contract management remains within Engagements.

**Scope boundary:** `contract-card.md` owns presentation and interaction. `engagements.md` remains the source of truth for contract lifecycle and business data, while `dashboard.md` owns module-level visibility, ordering, and composition.

## 2. Component architecture

The card is driven by three independent axes rather than a single status enum. Keeping them separate is what lets one component cover every contract without branching into a different card per scenario — a contract with an ongoing weekly capacity can be `Active` or `Paused`; a contract scoped to a single deliverable can be `Active` with or without measurable completion progress; either can independently need `Action required` for an outstanding document or training. Collapsing these into one status field would force the component to enumerate every combination instead of composing three small ones.

| Axis                  | Determines                                                                   | Values                                                                                                                         |
| ---------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Engagement terms**   | Which information and progress indicators are relevant (§3).                 | Time commitment, shown as the actual agreed term rather than a categorical type (§3.2), plus the separate, optional Duration field (§3.2.1).                     |
| **Contract status**    | Whether the contract is operational, and which actions are available at all. | `Awaiting start` · `Active` · `Paused` · `Completed` · `Terminated` ([`engagements.md` §2](engagements.md#2-engagement-views)) |
| **Action state**       | The action presented to the professional on the card.                        | `Ready to work` · `In progress` · `Action required` · `Waiting` · `No action`                                                  |

The Home module surfaces only contracts whose **contract status** is `Awaiting start`, `Active`, or `Paused` (§1's "active or upcoming" scope; §4) — `Completed` and `Terminated` drop out of the Home card and remain visible only in the Engagements → Contracts view. **Engagement terms** governs §3's Contextual row (e.g. current-week progress only where the contract carries a measurable weekly capacity; a contract scoped to a single deliverable may instead show simple deliverable-based progress or none). **Action state** is independent of both — a `Paused` contract is not automatically `No action`; it can carry `Action required` (e.g. a resume condition the professional must fulfill) the same as an `Active` one, resolving what would otherwise need a separate flag.

**Confirmed: single component, boolean properties — not a variant per combination.** The Contract card is built as one component with boolean/conditional properties for its optional regions (status badge, work insights, primary action — §3.1.2), rather than a separate Figma variant or code branch for every axis combination. This follows directly from the independent-axes model above: if engagement terms × contract status × action state each produced their own variant, the component would need to enumerate the full cross-product instead of composing three independent toggles.

### 2.1 Recurring availability as an action state

Per [`engagements.md` §5.1](engagements.md#51-contract-availability-vs-profile-availability), an active contract may require the professional to submit `ContractAvailability` each week — a **Recurring** task per [`next-steps-card.md` §3.1](next-steps-card.md#31-task-generation-model), distinct from the one-time Profile `Availability` field. An unsubmitted `ContractAvailability` for the current week sets the card's action state to `Action required` rather than deferring it entirely to the Next steps module — the professional should be able to see and act on it from the same card that shows the engagement it belongs to.

> 🙋 If a `ContractAvailability` submission is also surfaced as a Next steps card ([`next-steps-card.md`](next-steps-card.md)) for the same contract, which module is the primary place to act on it — Contract card, Next steps, or both simultaneously? Needs product input to avoid duplicating the same action across two modules without a clear precedence rule.

## 3. Card content

The Contract card is a Home preview, not a compressed contract-detail page — the full contract detail ([`engagements.md` §5](engagements.md#5-active-engagement)) remains the source for comprehensive terms, history, deliverables, and any field not listed below. Card content is organized into three levels, each further from "always shown" than the last:

| Level          | Information                                                                                                                                                                                         |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Essential**  | Engagement title, partner label, contract status (§2), and the relevant date for that status (start date for `Awaiting start`, current period for `Active`, resume condition/date for `Paused`).    |
| **Contextual** | Compensation terms and expected workload (see below), current-week or deliverable progress where the engagement terms (§2) support it, and next deliverable or upcoming milestone when applicable. |
| **Actionable** | The action state (§2) and its outstanding action (e.g. an unsubmitted `ContractAvailability`, §2.1), deadline when applicable, and one primary CTA routed to the full contract/engagement detail.   |

Essential fields are always shown, except that a redundant status badge may be omitted when the module already communicates that status (see §3.1.1). Contextual and Actionable fields are shown only when they apply to that contract — a card must not display a field its contract type or current state doesn't support.

✅ **Confirmed via Figma** ([Contract Card](https://www.figma.com/design/Q2IVVTNZQaWHDkUiWztX3C/verita.ds?node-id=5891-881&t=PIUaa4bmM1VPq3x8-11)): the visual hierarchy across these three levels is settled, resolving the gap previously noted here — see §3.1's confirmed layout below.

### 3.1 Contract card anatomy

The card is organized into four content areas. These describe where information belongs within the component; the Essential, Contextual, and Actionable levels above determine when that information appears.

| Area         | Content                                    | Purpose                                                |
| ------------ | ------------------------------------------ | ------------------------------------------------------ |
| **Identity** | Partner logo, role or project title, `contract-status` badge (top-right) | Identify the work and its status at a glance. |
| **Terms**    | Compensation (below title, same large type size, regular weight), then partner and engagement terms/duration as two icon-led rows | Establish contractual context.                         |
| **Progress** | `work-insights` group (progress bar, metric, percentage) | Communicate the professional's current position. |
| **Action**   | Contextual primary CTA                     | Continue the work or address the next required action. |

**Confirmed layout, top to bottom** ([Contract Card](https://www.figma.com/design/Q2IVVTNZQaWHDkUiWztX3C/verita.ds?node-id=5891-881&t=PIUaa4bmM1VPq3x8-11)):

1. **Header row:** partner logo (left) and the `contract-status` badge (top-right, conditional per §3.1.2's status-badge visibility rule).
2. **Title block:** `contract-title` (semibold), then `compensation` directly beneath it at the same large type size but regular weight — compensation is visually part of the identity/title block, not folded into the smaller Terms rows below.
3. **Terms block**, two icon-led rows, each pairing a fixed leading icon with its text:
   - `building-03` icon + `partner-name`.
   - `calendar` icon + `engagement-terms` (time commitment) and, when shown, `· duration` composed on the same row (§3.2.1's `showDuration` toggle — see below).
4. **Progress block:** the optional `work-insights` group (§3.1.2).
5. **Action block:** the `primary-action` button.

The component keeps this shared structure across engagements, while its content adapts to the contract's status and action state. Progress appears only when reliable, applicable data exists; time remaining must not imply work completed. The primary CTA appears only when an action is available.

#### 3.1.1 Core information fields

These fields establish the shared component contract. Requirements refer to the underlying data; the Display column describes its presentation on the card.

| Field           | Requirement                            | Display                  |
| --------------- | -------------------------------------- | ------------------------ |
| Contract ID     | Required, internal                     | Not displayed            |
| Title           | Required                               | Product Design Advisor   |
| Partner         | Required, subject to visibility policy | Verita partner           |
| Logo            | Optional                               | Partner logo or fallback |
| Engagement terms | Required, as available                | Up to 30 hrs/week |
| Duration        | Conditional (§3.2.1)                   | 3 months |
| Compensation    | When available and permitted           | $85/hour                 |
| Contract status | Required                               | Active                   |
| Progress        | Conditional                            | 12 of 30 hours used      |
| Primary action  | Conditional                            | Open work                |
| Deadline        | Conditional                            | 24 days remaining        |

Required data does not mean every field must be displayed. For example, a card inside a module that contains only active contracts does not need an additional **Active** badge unless it conveys a meaningful distinction. When the module includes awaiting-start or paused contracts (§4), communicate those status differences explicitly.

Display values are illustrative. Compensation follows the contract's payment model below; progress requires reliable data, and session-related actions require confirmed support for that workflow.

#### 3.1.2 Finalized element behaviors

✅ **Confirmed:** the following per-element behaviors are settled for the base Contract card component.

| Element            | Behavior                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| `partner-logo`     | Optional, with fallback.                                                                               |
| `contract-status`  | Conditional badge — see the status-badge visibility rule below.                                        |
| `contract-title`   | Required, supports multiline.                                                                          |
| `compensation`     | Agreed contractual compensation (§3.3), never an advertised/opportunity range. Rendered directly beneath `contract-title`, at the same large type size as the title but regular (not semibold) weight (confirmed via Figma) — visually part of the identity/title block, not grouped with the smaller partner/engagement-terms rows below it. |
| `engagement-terms` | Required, as available — time commitment, shown as the actual agreed term (§3.2). Paired with a fixed leading `calendar` icon (confirmed via Figma). |
| `duration`         | **Optional to show, independent of `engagement-terms`** — the agreed engagement length, its own separate field (§3.2.1), gated by its own `showDuration` toggle in Figma. When shown, it composes onto the same row as `engagement-terms` with its own leading `·` separator (e.g. `Up to 30 hrs/week · 3 months`); when hidden, the separator is also removed, not left dangling — mirrors [`applications-card.md` §2.3.2](applications-card.md#232-duration)'s same rule. |
| `partner-name`     | Approved name or fallback. Paired with a fixed leading `building-03` icon (confirmed via Figma).                                                                             |
| `work-insights`    | Optional group containing the progress metric, bar, and percentage — see the work-insights rule below. |
| `primary-action`   | Contextual, based on available actions (§6.2) — see the primary-action default below.                  |

**Status badge visibility:** the badge keeps its current position (top-right of the card) but is hidden for `Active` contracts specifically within the **Active work** surface — that surface already communicates "these are your active contracts" at the module level, so a repeated `Active` badge on every card is redundant (consistent with §3.1.1's "a card inside a module that contains only active contracts does not need an additional Active badge"). On any other surface where a mix of statuses can appear (e.g. Home, or an Engagements view spanning multiple statuses), the badge is shown for every non-`Active` status so the professional can tell cards apart at a glance.

**Status badge tone:** the `contract-status` badge uses the shared [`Badge`](../src/components/data-display/badge/badge.tsx) component's `tone` prop — never a one-off color — mapped from contract status as follows:

| Contract status    | `tone`        | Rationale                                                                                    |
| ------------------ | ------------- | -------------------------------------------------------------------------------------------- |
| **Awaiting start** | `info`        | Informational, not yet underway — nothing is wrong, work just hasn't started.                |
| **Active**         | `success`     | Work is healthy and ongoing. Shown only on surfaces with mixed statuses, per the rule above. |
| **Paused**         | `warning`     | Needs the professional's attention — a resume condition may be outstanding (§2.1).           |
| **Completed**      | `neutral`     | Terminal and expected — no action needed, and deliberately muted rather than celebratory.    |
| **Terminated**     | `destructive` | Terminal outside the normal completion path — the one status that should read as negative.   |

This is the first place a status→tone mapping is established in this component library — no prior convention existed to reuse, so this table is now the source of truth for `contract-status` badge color. Any future status-driven badge elsewhere in the product should be evaluated against this same rationale (informational vs. healthy vs. needs-attention vs. neutral-terminal vs. negative-terminal) rather than picking tones ad hoc.

**Work insights is fully optional as a group, not just its individual fields:** if no verified progress metric exists for a contract, the entire `work-insights` region (metric text, bar, and percentage together) is removed, and Auto Layout closes the resulting gap. The region must never render empty or with placeholder/zero values standing in for missing data — this extends §5.2's "collapse an absent optional field without a blank row" to the group as a whole, not just its individual rows.

**Primary action default:** `Open work` is the default primary-action label for `Ready to work`/`In progress` contracts, routing to the contract's work destination generically. `Start session` is reserved for the specific case where session-based work functionality is confirmed for that destination (§6.2) — it is not the fallback label when session support is unconfirmed or unknown.

> Next: define the card's behavioral states — `default`, `awaiting start`, `action required`, `paused`, `completed`, `loading`, and `error` — establishing exactly when each element above appears and what the professional can do in each. §6 covers contract-status and action-state rules already; this remaining work is to consolidate them into named, implementation-ready states alongside the loading/error states in §6.4.

### 3.2 Engagement terms

**Engagement terms replaces the earlier `Project-based`/`One-time`/`Retainer` "Work arrangement" classification.** For Verita, every engagement is one-off and contract-based — there is no traditional employment-type distinction (e.g. "Contract" vs. "Project-based" vs. "Retainer" as if they were meaningfully different categories) the way a conventional job board would model it. Classifying engagements into named types didn't provide the professional with any differentiation a job board's "employment type" filter would — every engagement here already is a contract. The card instead shows the **actual terms of the engagement** — time commitment, with Duration as its own adjacent field (§3.2.1) — as concrete, factual values, not a categorical label standing in for them.

This still lets a single component represent every combination — `Up to 30 hrs/week` × `3 months`, `10 hrs/week` × `Ongoing`, a single scoped deliverable with no ongoing time commitment at all — without needing a separate card variant per combination, and without treating any two attributes as mutually exclusive.

#### Time commitment

Defines how much time the professional is expected to work, shown as the actual agreed hours — never a categorical label like `Full-time`/`Part-time`.

| Field              | Definition                                                                     | Example              |
| ------------------- | ------------------------------------------------------------------------------- | --------------------- |
| Time commitment     | The actual expected weekly hours, or absence of a fixed weekly commitment.     | `Up to 30 hrs/week`, `10 hrs/week`, or omitted entirely for a single scoped deliverable with no ongoing weekly commitment. |

Compensation is a separate field (§3.3) and is never inferred from time commitment or vice versa — showing `$85/hour` does not imply any particular weekly hour count, and showing `Up to 30 hrs/week` does not imply any particular rate.

### 3.2.1 Duration

**Duration is its own field, not a component of Engagement terms** — `engagement-terms` here carries only time commitment (§3.2 above); Duration sits beside it as a separate, optional anatomy element, matching [`applications-card.md` §2.3](applications-card.md#23-card-anatomy)'s anatomy (`compensation · engagement-terms · duration · partner-name`) and [`match-card.md` §3.1](match-card.md#31-compensation-advertised-range-vs-agreed-amount)'s equivalent field. This is the shared model across all three cards; only the *source* of the value differs by card:

| Card         | Duration source                                                              |
| ------------ | ----------------------------------------------------------------------------- |
| Match card   | Advertised or estimated duration, from the Opportunity as posted.             |
| Application card | Expected duration of the opportunity — still pre-agreement.               |
| Contract card (this doc) | **Confirmed, agreed duration from the signed agreement** — never the original opportunity estimate, once an agreed value exists. |

| Field    | Definition                                                          | Example      |
| -------- | --------------------------------------------------------------------- | ------------- |
| Duration | The agreed length of the engagement, when the contract has a defined end. Omitted (not shown as "Ongoing" or any other placeholder) when the engagement has no fixed end date — unless "Ongoing" is itself the confirmed agreed term (distinct from omission: it asserts a known open-ended duration, not an unknown one). | `3 months`, `Ongoing` |

This mirrors §3.3.2's compensation rule for the same lifecycle point: for an active contract, show the agreed duration rather than the opportunity's originally advertised or estimated duration whenever the signed terms are available — e.g. an opportunity advertised as `~3 months`, but if the professional signed for a 4-month term, the Contract card shows `4 months`, not the original estimate. The advertised/estimated duration belonged to the Opportunity and then the Application before an agreement existed ([`engagements.md` §4](engagements.md#4-offers-and-contracting)); once a Contract exists, its own agreed duration is authoritative.

**Duration is an optional element to show, confirmed via Figma's `showDuration` toggle** ([Contract Card](https://www.figma.com/design/Q2IVVTNZQaWHDkUiWztX3C/verita.ds?node-id=5891-881&t=PIUaa4bmM1VPq3x8-11)) — it renders on the same row as `engagement-terms`, with its own leading separator, and both the separator and the value are shown or hidden together as one unit, never a dangling `·` with no value after it. This is a display toggle layered on top of the data-availability rule above: `showDuration` should be derived from the same "confirmed timeframe exists" check (§3.2.1's table), never toggled independently of whether the underlying data actually supports it.

#### 3.2.2 Additional dimensions

Engagement terms (time commitment) and Duration (§3.2.1) compose dynamically with the other attributes below — the card shows whichever of these actually have data for a given contract, never a fixed set of labeled slots that must all be filled:

| Dimension           | Possible values / content                     |
| -------------------- | ------------------------------------------------ |
| Engagement terms      | Time commitment (e.g. `Up to 30 hrs/week`) — see §3.2. |
| Duration              | Agreed length of the engagement (e.g. `3 months`, `Ongoing`) — its own field, shown alongside Engagement terms when available (§3.2.1). Composed together in display when both exist — see §3.2's example: `$85/hour · Up to 30 hrs/week · 3 months`. |
| Compensation model    | `Hourly` · `Fixed fee` · `Per task` · `Salary` — the actual compensation amount is what's displayed (§3.3), the model determines its unit/format, not a separate visible label. |

Work location (`Remote`/`Hybrid`/`On-site`) is removed from this model — location is not a dimension Verita's marketplace models by default, unlike a typical job board.

The card composes these dynamically based on available data per contract — it does not need a variant per combination, and it never shows an empty/placeholder value for a dimension with no data (§3.1.2's work-insights rule extends to this too).

#### Talent Network: an opportunity type without a contract card

**Talent Network** means joining a qualified pool for consideration when relevant work becomes available; there is no immediate project or secured work. For example, a professional may join the Product Design expert network. This remains a genuinely distinct kind of Opportunity — not an engagement-terms classification, but a state of "no secured work yet" — and is unaffected by the Engagement terms simplification above (see [`dashboard.md` §11.1](dashboard.md#111-opportunity-types)).

Membership alone does not produce a Contract card, compensation, work progress, or a work CTA. It belongs in Engagements → Talent Network ([`engagements.md` §2](engagements.md#2-engagement-views)). If membership later leads to a contract, that separate contract uses its actual engagement terms and follows §4's visibility rule.

#### Shared behavior across dimensions

- Engagement terms (time commitment) and Duration (§3.2.1) are the card's primary contextual content; Compensation model is modeled and displayed independently (§3.2.2), never inferred from either.
- Use the agreed contract terms. Do not infer an hourly rate from a given time commitment, or a fixed fee from the absence of one, and do not infer duration from time commitment or vice versa.
- Show time remaining separately from work completed. Omit progress bars when the underlying metric or denominator is unavailable.
- Choose the primary action from the supported workflow and current action state (§2). No particular engagement term alone guarantees a `Start session` or `Resume work` action.

### 3.3 Compensation terms and expected workload

Card content must state compensation according to the contract's engagement and payment model ([`dashboard.md` §11](dashboard.md#11-opportunity-data-required-by-the-dashboard)'s "Compensation type, range, currency" and [§11.1](dashboard.md#111-opportunity-types)'s Opportunity types), not assume an hourly rate. A contract with an ongoing weekly capacity shows a rate and expected hours (e.g. "$75/hr · 20 hrs/week"); a contract scoped to a single deliverable shows a fixed amount instead (e.g. "$1,500 per project"). Neither should require fields that don't apply to its engagement terms — a fixed-price card has no "expected hours" field to fill, and must not show a placeholder or zero value in its place.

#### 3.3.1 Compensation display variants

The Compensation model dimension (§3.2.2) renders as one of the unit-specific display formats below, never a generic number. A card shows the one variant that matches the contract's agreed terms; it must not construct a different unit than what was actually agreed (e.g. do not derive a daily rate from an hourly one).

| Type                | Example                |
| ------------------- | ---------------------- |
| Hourly rate         | $85/hour               |
| Hourly range        | $75–$95/hour           |
| Fixed project fee   | $5,000/project         |
| Per task            | $2,000/task            |
| Per deliverable     | $500/deliverable       |
| Daily rate          | $600/day               |
| Weekly rate         | $2,500/week            |
| Monthly retainer    | $6,000/month           |
| Annual salary       | $150,000/year          |
| Annual salary range | $150,000–$180,000/year |

A range (hourly or salary) is shown only when the contract itself specifies a range — a single-value contract must not be widened into one, per §5.1's "use a range only when the contract itself specifies one."

#### 3.3.2 Additional compensation states

> ⚠️ **Decision needed:** the scenarios and precedence rule below are proposed, not yet confirmed with product — validate against actual contracting/payments behavior before treating this as final.

Beyond the display variants above, the component must also accommodate:

| Scenario                   | Display           |
| -------------------------- | ----------------- |
| Negotiated rate            | $85/hour          |
| Variable compensation      | Base rate + bonus |
| Compensation not disclosed | Omit compensation |
| Rate pending confirmation  | Rate pending      |

`Negotiated rate` renders identically to a standard §3.3.1 display variant (e.g. `$85/hour`) — negotiation is provenance, not a distinct visual format, and the card must not mark or badge a rate as "negotiated" differently from any other agreed rate of the same unit. It's listed here only to confirm that a negotiated outcome is not a separate display case.

`Compensation not disclosed` follows §5.1's "missing compensation is not zero compensation" — omit the field entirely rather than showing $0 or a placeholder. `Rate pending confirmation` is a distinct state from omission: it tells the professional a rate exists but isn't finalized yet, rather than implying none was agreed.

For an active contract, display the agreed compensation rather than an opportunity's advertised range whenever the final terms are available — e.g. an opportunity advertised $75–$95/hour, but if the professional signed at $85/hour, the Contract card shows $85/hour, not the original range. The advertised range belonged to the Opportunity before an offer existed ([`engagements.md` §4](engagements.md#4-offers-and-contracting)); once a Contract exists, its own agreed terms are authoritative.

## 4. Visibility rule

The Contract card/module renders only while the professional has at least one contract whose **contract status** (§2) is `Awaiting start`, `Active`, or `Paused`. Once no such contract exists, the module is removed from Home entirely, consistent with [`next-steps-card.md` §4](next-steps-card.md#4-visibility-rule)'s pattern for empty-state modules on Home — no confirmation message stands in its place.

## 5. Component content model

The component receives a summary of one authoritative Contract and its related requirements, terms, and progress. This is a presentation model, not a new contract lifecycle or a finalized API schema. The parent module selects eligible contracts and orders them; the card determines how each supplied summary is presented.

### 5.1 Content groups

| Group                 | Content                                                                                                                 | Rendering rule                                                                                                                                                                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Identity**          | Contract ID, title, permitted partner label, optional logo, contract-detail destination                                 | Require a stable ID and title for a normal card. Use the permitted partner label and a neutral logo fallback when needed; never reveal a hidden partner through image alternative text.                       |
| **Arrangement**       | Engagement terms (time commitment) and Duration, as separate fields                                                     | Show the actual agreed terms defined in §3.2/§3.2.1, not a categorical type. Keep compensation model separate from engagement terms and duration.                                                             |
| **Terms**             | Agreed compensation amount or range, currency, unit/payment period; expected workload and its period when applicable    | Display only available, permitted terms. Distinguish per hour, per task, per project, and per period. Use a range only when the contract itself specifies one. Missing compensation is not zero compensation. |
| **Status and dates**  | Authoritative contract status; applicable start, end, resume, or deadline values, including timezone where time matters | Show the date relevant to the current status. Omit unavailable dates rather than inventing them. Status differences remain visible when a module contains mixed statuses.                                     |
| **Progress**          | Metric kind, current value, total/allocation, unit, measurement period, and counted status such as recorded or approved | Show one primary metric appropriate to the work. A bar requires a meaningful positive total and comparable values from the same period and counting basis. Deadline text remains separate.                    |
| **Requirement**       | Requirement ID, description, owner, blocking/nonblocking designation, due date when present, completion state           | Explain the outstanding obligation and who must act. Reference the same requirement used by Next steps; do not create a second task for the card.                                                             |
| **Primary action**    | Action label, destination or supported operation, availability, unavailable reason when applicable                      | Show at most one primary CTA. Select it using §6; do not construct a work action solely from the arrangement label.                                                                                           |
| **Data availability** | Initial load/refresh state, errors, last successful update when available                                               | Keep technical availability separate from contract and action status. Missing or failed data must not become an empty contract list or a completed contract.                                                  |

### 5.2 Composition and fallback rules

- Present identity first, then applicable terms, progress/context, and the primary action, following §3.1. Exact spacing and visual emphasis remain subject to design examples.
- Collapse an absent optional field without a blank row, placeholder amount, or decorative progress bar. Preserve valid identity and terms when only progress fails to load.
- If required identity or status cannot be established, show an unavailable state with recovery rather than a normal actionable card. An unrecognized work type may use the shared identity/terms layout, but must not infer type-specific progress or work actions.
- Display zero progress only when zero is a known value. When utilization exceeds its allocation, preserve the actual numbers in text and cap the visual bar at its full length; do not infer whether more work is permitted.
- Label the metric precisely, for example `12 of 30 hours recorded this week` or `3 of 5 deliverables accepted`. Do not combine submitted and approved values or treat elapsed time as completion.
- Card/title navigation opens contract details. The primary CTA resolves the named action through those details or a confirmed work destination; a button activation must not also trigger card navigation. Both entry points must be keyboard accessible and have distinct accessible names.

### 5.3 Utilization bar direction and fill

For this utilization bar, progress always fills in one direction: left to right. Assuming a left-to-right interface, 0% starts on the left and 100% ends on the right.

The important distinction is that the bar represents hours consumed, not hours remaining.

| State           | Fill             | Meaning        |
| --------------- | ---------------- | -------------- |
| No hours used   | 0%               | 0 of 30 hours  |
| Partially used  | 40%              | 12 of 30 hours |
| Fully used      | 100%             | 30 of 30 hours |
| Over allocation | 100% + indicator | 35 of 30 hours |

PRD rules:

- Fill increases as recorded hours increase.
- Never reverse the direction to represent remaining hours.
- Cap the visual fill at 100%; communicate overages through text or a separate indicator.
- Reset at the start of the next reporting period, once the period and tracking rules are confirmed.
- Always accompany the bar with a numerical value.

This extends §5.2's existing overage rule (cap the visual bar, preserve actual numbers in text) with the fill direction and per-state fill values above.

## 6. Component state rules

These are draft component behavior rules. Each card combines contract status, action state, and data availability; the combinations must not be flattened into one status label. Work-session support, exact action destinations, and backend mappings remain validation items.

### 6.1 Contract status rules

| Contract status    | Content behavior                                                                                                                                        | Action behavior                                                                                                                                               | Home visibility    |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| **Awaiting start** | Show the start date when known and any outstanding preparation requirement. Do not imply that work is already underway.                                 | Permit available preparation actions. Work actions require authoritative permission to begin; reaching the displayed start date alone does not activate them. | Included under §4. |
| **Active**         | Show applicable current terms, progress, deadlines, and outstanding requirements.                                                                       | Resolve the primary CTA from the action state below.                                                                                                          | Included under §4. |
| **Paused**         | Show an explicit paused state and the reason or resume condition when available. Existing progress remains factual, without implying work can continue. | Suppress start/resume-work actions. Allow an available action that addresses the pause condition.                                                             | Included under §4. |
| **Completed**      | Show completion context and any retained summary in Engagements. A full progress bar alone never sets this status.                                      | No work CTA. Details remain accessible where the card is shown.                                                                                               | Removed from Home. |
| **Terminated**     | Show the authoritative terminated status in Engagements without presenting the work as completed.                                                       | No work CTA. Details remain accessible where the card is shown.                                                                                               | Removed from Home. |

### 6.2 Action state rules

| Action state        | Trigger                                                                                                                 | Primary action and supporting content                                                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ready to work**   | Work is permitted, a supported work destination exists, and no blocking professional requirement remains.               | Default to `Open work`. Use `Start session` only where session functionality is confirmed for that work destination — it is the reserved, not default, label. |
| **In progress**     | Existing work can be continued, or a supported session is currently running.                                            | Use `Resume work` for resumable work or `Return to session` for an actual running session. Recorded hours alone do not establish a running session.           |
| **Action required** | An outstanding requirement belongs to the professional, including the recurring availability requirement in §2.1.       | Name the action, such as `Submit availability` or `Complete setup`, and show the relevant deadline. State whether it blocks work; not every obligation does.  |
| **Waiting**         | The next necessary step belongs to Verita or the partner and the professional has no action that can advance that step. | Explain what is pending and identify the owner when known. Do not show an enabled CTA implying the professional can resolve it. Details remain accessible.    |
| **No action**       | There is no applicable professional action or supported work operation.                                                 | Omit the primary CTA. Preserve details navigation; do not add a disabled generic button merely to fill the action area.                                       |

### 6.3 State precedence

1. Establish valid identity, status, and permission data before enabling an action. An unavailable or unverifiable action stays unavailable even if cached content suggests it was previously allowed.
2. Apply contract-status restrictions first: completed and terminated contracts cannot offer work actions; paused and awaiting-start contracts only expose permitted actions.
3. Give a blocking professional requirement precedence over a start/resume action. For concurrent nonblocking requirements and ongoing work, the proposed default is to show the requirement as the primary CTA and preserve access to work through contract details. Confirm this priority before implementation.
4. With no professional requirement taking precedence, offer a permitted continuation/start action. Use Waiting only when an external dependency prevents the next step; an unrelated pending review must not hide otherwise available work.
5. Deadline warnings and progress conditions modify supporting content. They do not independently change contract status, permissions, or the action state.

If several requirements compete, the card uses the authoritative task priority rather than inventing a new order. The requirement-priority policy and alignment with Next steps remain to be defined.

### 6.4 Display and recovery states

| State                           | Trigger                                                                                               | Component rule                                                                                                                                                               |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Loading**                     | Initial data has not resolved.                                                                        | Show a structural skeleton with no interactive work CTA. Do not flash an empty-module message.                                                                               |
| **Refreshing**                  | Existing data is being updated.                                                                       | Preserve the last known content without presenting it as newly verified. Revalidate permissions before a consequential work action.                                          |
| **Partial data / no progress**  | Optional terms, dates, or progress are absent or unavailable.                                         | Keep valid content and omit unsupported fields. If a fetch failed, communicate that the affected information could not load; never substitute zero.                          |
| **Approaching deadline**        | A confirmed deadline is within 24 hours of the current time (§6.4's resolved warning window, below).  | Emphasize the deadline with text as well as visual styling (e.g. a warning/destructive text color) — never color alone. Outside this window, the deadline uses the card's default text color. |
| **Overdue**                     | An authoritative deadline has passed and its obligation remains incomplete.                           | Replace future countdown text with an overdue label and the due date. Keep only actions permitted by the contract; lateness does not automatically terminate or complete it. |
| **Allocation reached/exceeded** | Valid recorded usage reaches or exceeds the period allocation.                                        | Show actual utilization. Disable additional work only if the authoritative rules prohibit it; a full bar alone is insufficient.                                              |
| **Action pending**              | A user-triggered operation is awaiting a result.                                                      | Show progress on the triggering control and prevent duplicate submissions. Do not claim completion or advance contract status before confirmation.                           |
| **Action failed**               | The requested operation fails.                                                                        | Preserve the prior confirmed state, show an actionable error, and restore the action when retry is permitted. Do not erase the card.                                         |
| **Unavailable/error**           | Required card data fails, access is no longer available, or an action destination cannot be resolved. | Show a concise explanation and retry only when recovery is supported. Do not invent a destination or treat the failure as proof that no contract exists.                     |

✅ **Resolved: the "Approaching deadline" warning window is 24 hours.** A deadline (e.g. an `Action required` deadline per §6.2, or any other confirmed contract deadline) renders in the emphasized/urgent style only once it is within 24 hours of the current time; outside that window it uses the card's default text color, never the warning/destructive one. This replaces the prior "requires product definition; do not hardcode an assumed threshold" note — 24 hours is now that definition, chosen as a threshold narrow enough that the emphasized styling reliably signals genuine urgency rather than applying to every named action's deadline by default (which would dilute its meaning). Any future contract-card deadline display must use this same 24-hour threshold rather than introducing a second, inconsistent one.

### 6.5 Transitions and synchronization

- After confirmed requirement completion, refresh the card and any Next steps representation of the same requirement. Recompute the action state from remaining requirements and permissions; do not automatically assume Ready to work.
- Reflect authoritative pause, resume, completion, and termination changes across the card and its parent module. Apply §4 only after eligibility has been established successfully.
- A successful response containing no eligible contracts hides the Home module. Loading, errors, and unknown eligibility do not satisfy that empty-state condition.
- On period rollover, show progress for the new authoritative period once available. Do not reset a cached count to zero merely because the local clock crossed a boundary.
- Announce action results and errors accessibly, preserve keyboard focus through updates, and provide text for status, warnings, and progress rather than relying on color alone.

## 7. Multiple active contracts

✅ **Confirmed capability:** a professional can have more than one active contract.

Each contract must have an independent card with its own data, state, and destination.

Required behaviors:

- Each card opens its corresponding work environment.
- Progress information, when supported, belongs to the individual contract.
- A contract-specific error must not affect other contract cards.
- Completing one contract must not remove or modify another.
- Card order should be deterministic, with contracts requiring attention prioritized once the ordering policy is approved.

The number of cards displayed on Home remains an open design decision.

## 8. Open questions

- 🙋 When both the Contract card and a Next steps card could represent the same outstanding `ContractAvailability` submission, which is the primary surface for acting on it? (§2.1)
- 🙋 Are `Ready to work`, `In progress`, `Action required`, `Waiting`, and `No action` (§2) a complete and final action-state taxonomy, and what determines `Waiting` specifically (waiting on partner vs. Verita, per the professional/Verita/partner ownership model in [`engagements.md` §3](engagements.md#3-applications))?
- 🙋 What is the ordering policy for multiple Contract cards on Home, and how many cards are displayed at once? (§7)
- 🙋 Confirm the proposed action precedence in §6.3, the priority of multiple requirements, and which obligations block work.
- 🙋 Confirm supported session/work destinations, authoritative permission checks, and progress counting bases (§5–§6). The deadline warning threshold itself is resolved — 24 hours (§6.4).
- 🙋 Confirm which of Compensation model and Duration (§3.2.1, §3.2.2) are launch requirements vs. future extensions, now that the `Project-based`/`One-time`/`Retainer`/`Full-time`/`Part-time`/`Flexible` categorical taxonomy and Work location have been retired in favor of Engagement terms.
- 🙋 Consolidate §3.1.2's named behavioral states (`default`, `awaiting start`, `action required`, `paused`, `completed`, `loading`, `error`) against the existing §6.1/§6.2/§6.4 rules — confirm the named-state list is complete and reconcile naming (e.g. `default` vs. `Ready to work`/`In progress`) before treating it as implementation-ready.

## 9. Related docs

- `product-specs/dashboard.md` — the Home/Dashboard PRD. Contracts is referenced there as Home module 3 ([§6](dashboard.md#6-information-architecture)) and must outrank job discovery whenever at least one exists ([§6](dashboard.md#6-information-architecture)'s resolved note, [§7.6](dashboard.md#76-applications-offers-active-engagement-training-payments)).
- `product-specs/engagements.md` — the Engagements PRD. [§2](engagements.md#2-engagement-views) defines `Contracts` as an Engagement view (work agreements: upcoming, active, completed, or terminated); [§5](engagements.md#5-active-engagement) is the source-of-truth field list this card surfaces a filtered preview of; [§5.1](engagements.md#51-contract-availability-vs-profile-availability) defines `ContractAvailability`, the recurring weekly submission referenced in §2 above.
- `product-specs/dashboard.md` [§11](dashboard.md#11-opportunity-data-required-by-the-dashboard) and [§11.1](dashboard.md#111-opportunity-types) — the compensation-type/opportunity-type taxonomy behind §2's engagement-terms axis and §3's compensation-model-aware card content.

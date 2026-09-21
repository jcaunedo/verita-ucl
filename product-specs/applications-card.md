<!--
Created: Sep 17, 2026
Created by: Julio Caunedo
Last updated: Sep 21, 2026
Scope: Verita AI Dashboard — the Applications module's row/card content, split out of the Dashboard PRD (product-specs/dashboard.md) [§6](dashboard.md#6-information-architecture) and backed by the Applications view definition in product-specs/engagements.md [§3](engagements.md#3-applications).
Purpose: Define the Applications card's stage/status model, content fields, row-interaction behavior, and priority behavior as a Home-module surface over the underlying Application object.
-->

# Applications Card

**Status:** Draft for product and design alignment

**Figma reference:** [Application Card](https://www.figma.com/design/Q2IVVTNZQaWHDkUiWztX3C/verita.ds?node-id=5914-1764&t=PIUaa4bmM1VPq3x8-11) — the base component structure referenced throughout §2.3, confirming the two-zone layout (left: logo, `partner-name` eyebrow, title, `compensation · engagement-terms · duration`; right: `supporting-text`, `application-status`) and the `Default`/`Hover` variants (§4.1's hover-revealed `actions-menu`). Revised from an earlier single-line anatomy to differentiate this card's layout from comparable competitor listings (§2.3). The Home module's zero-applications empty state is confirmed via [Empty State — A](https://www.figma.com/design/hdxBo3xOg3uMSovZwidJF5/Verita?node-id=5642-2215) (§5). The Engagements → Applications empty state (zero applications) reuses the shared [Section Empty State](https://www.figma.com/design/Q2IVVTNZQaWHDkUiWztX3C/verita.ds?node-id=5669-4731&t=4kYL66ITNMr5u2AL-11) component (§5.1) — already implemented in code as `SectionEmptyState` (`src/components/cards/section-empty-state/`).

## 1. What the Applications card is

The Applications card is how a professional sees an opportunity they've applied to at a glance on Home and in Engagements → Applications — enough to know where it stands and what happens next, without opening the full application detail. The full history and step-by-step detail of that application live elsewhere; this card is only the summary.

The Applications card is a reusable component that represents one application (an opportunity the professional has actively pursued) on the Dashboard and in the Engagements list. It maintains a consistent structure across every application regardless of stage, adapting only its status label, next-action text, and progress indicator to the application's current state. The component supports multiple concurrent applications independently, and its entire row is the interactive surface — there is no separate CTA button — routing to the application detail where the full next-action and owner state live.

**Scope boundary:** `applications-card.md` owns presentation and interaction. `engagements.md` remains the source of truth for application lifecycle, the status enum, and business data, while `dashboard.md` owns module-level visibility, ordering, and composition relative to other Home modules.

## 2. Card content

Per [`engagements.md` §3](engagements.md#3-applications), each application summary must include:

- Opportunity title and partner label.
- Current stage and status (§3 below — the user-facing label, never the raw system enum).
- Last meaningful update.
- Next action.
- Next-action owner: professional, Verita, or partner — determines whether a numeric step count or a plain status renders (§2.2).
- Deadline, when applicable.
- Progress, only when it maps to meaningful completed requirements and the owner is the professional — never a cosmetic percentage, and never a partner/Verita-side step count (§2.2).

Required data does not mean every field must be displayed in every state. Progress is conditional on both having a countable step set and the professional being the owner (§2.1–§2.2); deadline only appears when the application has one.

### 2.1 Progress display

Progress appears on the row only when both are true: the next action belongs to the professional (§2.2), and it maps to a countable set of completed requirements — for example, "2 of 4 steps completed." An application with no defined step set, one whose stage doesn't carry meaningful sub-steps (e.g. `Applied`, awaiting a decision), or one currently owned by Verita or the partner, shows no numeric progress indicator — the last case shows a plain status instead (§2.2), never an empty bar or an invented percentage. This follows the same principle as [`contract-card.md` §3.1.2](contract-card.md#312-finalized-element-behaviors)'s work-insights rule: an optional metric group is fully omitted, not rendered empty, when no reliable or user-relevant data backs it.

### 2.2 Next-action owner

Numeric step progress is professional-only by design, not a temporary gap. A step _count_ (e.g. "2 of 4 steps completed") is only meaningful when the professional is the one clearing those steps — it's their checklist, and the number reflects their own measurable progress. Once the next action belongs to Verita or the partner, there is no user-meaningful step count to expose: a partner's internal review process might have 1 stage or 20, but that's the partner's own process, not something the professional needs — or is entitled to — visibility into. Surfacing a partner-side count (e.g. "3 of 7 partner steps") would show real information with no action attached to it, which is noise, not a next action.

This produces a concrete display rule, not just a data-scoping note:

| Next-action owner     | Card shows                                                                                                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Professional**      | The numeric step count/progress (§2.1), because the professional can act on and measure it.                                                                                   |
| **Verita or partner** | A plain qualitative status only (e.g. "Pending review," "Waiting on [partner]") — no step count, because the underlying step total isn't the professional's to see or act on. |

This resolves the "next-action owner: professional, Verita, or partner" field from §2 for the row: owner is tracked for all three parties, but only changes _whether a step count or a plain status renders_ — it does not require exposing the partner's or Verita's internal step total, which was the actual blocker on this field before. Whether the owner label itself ("Waiting on you" vs. "Waiting on [partner]") surfaces inline on the row or only in the application detail remains open — see §8.

The card must not imply a next-action owner it cannot substantiate — e.g. it must not label a step "waiting on Verita" without a supported data source for that distinction, and it must never fabricate a partner-side step count where none is exposed.

### 2.3 Card anatomy

The following per-element behaviors are settled for the base Applications card component, mirroring [`contract-card.md` §3.1.2](contract-card.md#312-finalized-element-behaviors)'s finalized-element-behaviors format. This anatomy is treated as fixed; new permanent fields are not introduced without revisiting this table — variability within a given state is handled through §2.4's supporting-text region instead.

**Two-zone layout (revised):** the card is laid out as two horizontal zones, not a single flat row — a left identity zone and a right status/metadata zone, distinct from every other card family in this library (Contract card, Match card) which keep a single-column stack. This intentionally departs from the more common single-column "everything stacked under the title" pattern seen in comparable competitor listings, in favor of a layout distinct to Verita:

- **Left zone (identity):** `partner-logo`, then a stacked text block of `partner-name` (small eyebrow, above the title — moved out of the details line), `application-title`, and the `terms-row` line (`compensation · engagement-terms · duration` only — `partner-name` no longer appears here, since it now lives in the eyebrow).
- **Right zone (status/metadata):** `supporting-text` and the `application-status` badge, right-aligned; `actions-menu` appears here too on hover (§4.1).

| Element              | Behavior                                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `partner-logo`       | Optional, with fallback. Left zone.                                                                                                                                            |
| `partner-name`       | Approved name or fallback. Rendered as a small eyebrow line above `application-title`, in the left zone — no longer part of the `terms-row` line (revised from the earlier single-line anatomy). |
| `application-title`  | Required, supports multiline. Left zone, below `partner-name`.                                                                                                                                       |
| `compensation`       | Conditional; preserve amount, currency, and payment unit — never collapse to a bare number. May render as a range (e.g. `$95–115k/yr`), not only a single value — see §2.3.1. Left zone, in the `terms-row` line. |
| `engagement-terms`   | Conditional; per [`contract-card.md` §3.2](contract-card.md#32-engagement-terms)'s Engagement terms model — the actual time commitment (e.g. "Up to 30 hrs/week"), never a categorical type label (`Project-based`/`One-time`/`Retainer`, retired) and never a location value (`Remote`/`Hybrid`/`On-site`, not a modeled dimension for Verita's marketplace). Since `compensation` (above) already has its own dedicated field on this card, `engagement-terms` here shows only time commitment — not compensation or duration, unlike [`contract-card.md` §3.2](contract-card.md#32-engagement-terms)'s combined example string. Left zone, in the `terms-row` line. |
| `duration`           | Optional; the opportunity's expected duration (e.g. "3 months," "2 weeks," "Ongoing") — its own separate field from `engagement-terms`, shown only when a confirmed timeframe exists (§2.3.2). Left zone, in the `terms-row` line. |
| `supporting-text`    | Conditional on content, not an independent toggle — renders whenever it has confirmed content for the current application state, omitted entirely otherwise (§2.4). Right zone. |
| `application-status` | Required; always represents the actual application status (§3), never omitted or approximated. Right zone, trailing edge (§2.4's "status positioning" rule still holds under the new layout).                                                                      |
| `actions-menu`       | Optional, revealed on hover/focus; never permanently visible. Item set is status-gated, not fixed (§4). Right zone.                                                             |

> ⚠️ **Out of scope for now:** Figma's current component also exposes a `Discipline` field (default hidden, `showDiscipline`) in the right zone. This is intentionally **not specified here** — it needs a team discussion on what it represents and where it should surface (possibly the application/opportunity detail page rather than this card) before it's added to this anatomy. Do not implement it against this card until that's resolved.

#### 2.3.1 Compensation: advertised range vs. agreed amount

An application has not yet produced a signed Contract — that only happens once `ACCEPTED` leads to an Offer and then contracting (§3.1) — so `compensation` here still reflects the underlying Opportunity's **advertised** terms, same as the Match card ([`match-card.md` §3.1](match-card.md#31-compensation-advertised-range-vs-agreed-amount)) and unlike the Contract card, which shows only the professional's actual agreed amount ([`contract-card.md` §3.3](contract-card.md#33-compensation-terms-and-expected-workload)). Concretely:

- The card must be able to display a range (e.g. `$95–115k/yr`, `$75–$95/hour`) exactly as posted, using the unit-specific formats in [`contract-card.md` §3.3.1](contract-card.md#331-compensation-display-variants) extended to allow a range for any unit, not only hourly/salary.
- It must never collapse an advertised range into a single point value (e.g. picking the low or high end).
- Once the application reaches `Offer received` and eventually a signed Contract, the Contract card is the one that narrows to the single agreed value — this card is not expected to track that narrowing, since at that point a separate Contract object is the source of truth (§3.1).
- `Compensation not disclosed` and `Rate pending confirmation` ([`contract-card.md` §3.3.2](contract-card.md#332-additional-compensation-states)) apply here unchanged — omit the field entirely when not disclosed, rather than showing $0 or a placeholder range.

#### 2.3.2 Duration

`duration` is a separate, optional anatomy element from `engagement-terms` (§2.3) — the two are never combined into one string on this card. It reflects the **expected duration of the opportunity**, still pre-agreement, the same shared model used by the Match card (advertised/estimated, [`match-card.md` §3.1](match-card.md#31-compensation-advertised-range-vs-agreed-amount)) and the Contract card (confirmed/agreed, [`contract-card.md` §3.2.1](contract-card.md#321-duration)) — only the source of the value differs by card; see that section's table for the full three-card model.

Display rules:

- Show `duration` only when a confirmed timeframe exists for the opportunity — never an invented or estimated-looking placeholder standing in for missing data.
- Hide it entirely for one-time tasks without a defined duration — omitted, not shown as "N/A" or blank.
- Support values such as `2 weeks`, `3 months`, or `Ongoing` — `Ongoing` is itself a confirmed value (a known open-ended engagement), distinct from omission (an unknown one), per [`contract-card.md` §3.2.1](contract-card.md#321-duration).
- Keep deadlines (§2.4) separate from duration — a deadline is a specific date the professional must act by; duration is the engagement's expected length. The two must never be merged into a single field or string.
- When `duration` is hidden, remove its separator from the `terms-row` line rather than leaving a dangling `·` — this preserves a consistent card structure without introducing unnecessary placeholders, consistent with §6.2's fallback rules.

✅ **Confirmed via Figma:** the `application-card` component ([Application Card](https://www.figma.com/design/Q2IVVTNZQaWHDkUiWztX3C/verita.ds?node-id=5914-1764&t=4kYL66ITNMr5u2AL-11)) now exposes an explicit `showDuration` boolean toggling `duration` and its leading separator together as one unit — matching [`contract-card.md` §3.2.1](contract-card.md#321-duration)'s identical `showDuration` toggle. `showDuration` should be derived from the same "confirmed timeframe exists" check above, never toggled independently of the underlying data.

**Task-delivery deadlines vs. stage deadlines:** when an opportunity is a task with its own delivery deadline, that deadline is only shown when it's relevant to the application's *current* stage, and it is surfaced through `supporting-text` (§2.4), not through `duration` or a fixed anatomy field — `duration` stays focused on the engagement's expected length, while `supporting-text` stays focused on what matters in the current state:

- An application-submission deadline or an assessment deadline identifies that specific action (e.g. "Schedule your interview by Sep 22," "Complete your assessment by Sep 20" — already how §2.4.1's matrix names stage-specific deadlines).
- A task-delivery deadline is only surfaced once delivery is the actually relevant next step for that stage — not while the application is still, say, `In review` and delivery isn't yet the professional's concern.
- This is the same "name the specific action, never a generic deadline" principle §2.4's status matrix already applies to submission/assessment/interview deadlines — extended here to explicitly exclude task-delivery deadlines from the `duration` field.

### 2.4 Supporting text

The `supporting-text` element is where contextual information about an application's state is introduced without adding permanent visual complexity to the card — it is the one element in §2.3 designed to vary its content per status, rather than a fixed field like `compensation` or `engagement-terms`. It works together with `application-status` (right-aligned, §2.3) as two distinct concepts:

- **`application-status`** — where the application stands, plus whether the professional owes an action (`Action required`, composed as a suffix — see §3).
- **`supporting-text`** — the most relevant contextual information: progress, the latest confirmed event, or a deadline. A single optional line (§2.4.2) — its content can combine more than one detail into one string when a scenario calls for it, but it is never a second, separate element.

**Value, not a timestamp:** `supporting-text` is reserved for content that brings the professional value on the row itself — progress toward something, guidance on what to do next, or context on why no action is expected of them right now (e.g. "Awaiting partner review"). A bare elapsed-time or event-happened phrase with no guidance or action attached (e.g. "Applied 4 days ago," "Withdrawn Sep 18") is not that — it's historical detail that belongs on the application detail page, not this row. Per §2.3's anatomy rule, `supporting-text` is conditional on content: a status with nothing valuable to say here shows no `supporting-text` at all, rather than falling back to a plain timestamp to fill the line. §2.4.1 marks which scenarios clear this bar.

#### 2.4.1 Status matrix

This is the canonical scenario table for the two elements together — it supersedes ad hoc combinations and is the source of truth for what renders in each application scenario.

| Application scenario                                    | Status (right)              | Supporting text (left)                              |
| ------------------------------------------------------- | --------------------------- | --------------------------------------------------- |
| Started, not submitted — draft with measurable steps    | Not submitted               | "2 of 4 steps completed"                            |
| Started, not submitted — draft without measurable steps | Not submitted               | *(omitted — no measurable progress or action; "started" is a timestamp, not guidance)* |
| Submitted                                               | Applied                     | *(omitted — "Applied" the status already says this; a bare submission timestamp adds no guidance)* |
| Under review                                            | In review                   | *(omitted — nothing for the professional to act on yet; see the detail page for the submission date)* |
| Under review, additional requirements                   | In review · Action required | "Complete your assessment · 2 of 4 steps completed" |
| Interview requested                                     | Interview · Action required | "Schedule your interview by Sep 22"                 |
| Interview scheduled                                     | Interview                   | "Interview scheduled for Sep 24 at 10 AM EDT"       |
| Interview completed, review owner unconfirmed           | In review                   | *(omitted — "Interview completed" alone is a bare event, not guidance, once no owner can be named)* |
| Interview completed, partner owns next review           | In review                   | "Awaiting partner review"                           |
| Interview completed, Verita owns next review            | In review                   | "Awaiting Verita review"                            |
| On hold                                                 | On hold                     | *(omitted — no confirmable reason/owner exists yet, per the note below; a bare date is a timestamp, not guidance)* |
| Offer received                                          | Offer received              | *(omitted — the status already says this; see the Offer object/detail page for the received date)* |
| Not selected                                            | Not selected                | *(omitted — terminal, nothing actionable; see the detail page for the closed date)* |
| Withdrawn                                               | Withdrawn                   | *(omitted — terminal, nothing actionable; see the detail page for the withdrawal date)* |

> Post-interview evaluation reuses `In review`, not a new `Interview completed` status: once an interview is completed and the application moves back into evaluation, `application-status` reverts to **`In review`** (`SCORING_PENDING`/`UNDER_REVIEW`, already in the [`engagements.md` §8](engagements.md#8-application-status-enum) enum) rather than introducing a distinct `Interview completed` status. This avoids adding an unnecessary status the enum doesn't need — the underlying system state genuinely is "under review" again, just with different prior context. `supporting-text` carries that context instead, when it clears the value bar in §2.4's rule above:
>
> - **Review owner confirmed as the partner:** "Awaiting partner review."
> - **Review owner confirmed as Verita:** "Awaiting Verita review."
> - **Review owner not confirmed/available:** omitted entirely — "Interview completed" alone is a bare event with no guidance attached, and the card must not guess or default to naming an owner it can't confirm.
>
> The transition itself only happens once the authoritative system confirms evaluation has resumed — the card must not infer this from the interview's scheduled time having passed. Whether the review-owner detail is shown at all (vs. always omitted) is still open — see §8.

> `Not submitted` is one status covering two draft scenarios, distinguished only by `supporting-text`: a draft application can either have a countable step set (e.g. profile sections, required fields) or not. Both cases render the identical `Not submitted` status — the card never introduces a second draft-only status — and differ only in what `supporting-text` shows, following §2.1's existing progress-conditionality rule:
>
> - **Draft with measurable steps:** `supporting-text` shows the step count, e.g. "2 of 4 steps completed."
> - **Draft without measurable steps:** `supporting-text` is omitted entirely — per §2.4's value rule, "when the application was started" is a timestamp, not guidance, and does not stand in for the missing step count. The start date remains available on the application detail page.
>
> This is the pre-submission counterpart to §2.1's rule that progress only renders "when it maps to a countable step set" — here applied to the one status where that condition can genuinely go either way depending on the opportunity's own requirements, not the professional's actions.

> `On hold`'s `supporting-text` is omitted: unlike the post-interview `In review` rows (§2.4.1), no reason or owner (partner vs. Verita) is currently captured for why an application goes `ON_HOLD` — it's presently just a flag, per [`engagements.md` §8](engagements.md#8-application-status-enum)'s "parked for later" definition. With no reason or owner to name, the only remaining candidate is the hold date, which per §2.4's value rule is a timestamp, not guidance — so `supporting-text` is omitted rather than falling back to "Placed on hold [date]." If the underlying data model later captures a specific reason (e.g. "role requirements changed") or owner (e.g. "paused by [Partner]"), `supporting-text` should show that instead, following the same confirmed-data-only pattern already established for the post-interview `In review` rows above — but that data does not exist today, so there's nothing to render.

> `Interview` is the single application-status label while an interview is pending or scheduled: `application-status` reads **`Interview`** for both the requested and scheduled scenarios — never a different label like "In interview" for one of them. The professional is not asked to interpret a distinction between "Interview" and "In interview"; the actual condition (requested with a deadline, or scheduled with a date/time) is carried entirely by `supporting-text`, per the two interview rows in the matrix above. Once the interview is completed, the status moves on to `In review` rather than staying `Interview` — see the resolved note above. This resolves the label conflict previously flagged here between this matrix and [`engagements.md` §8](engagements.md#8-application-status-enum)'s enum table — `engagements.md` §8 already mapped `INTERVIEW_PENDING` and `INTERVIEW` to the same "Interview" label (§3's local copy of that table below is corrected to match); no change to the canonical enum's labels was needed, only to this card's now-fixed local copy of it.

All dates, deadlines, and progress values above are illustrative copy examples, not final strings — see [`ucl-ux-copywriter`](../.claude/skills/ucl-ux-copywriter/) for final wording once the underlying events are confirmed. The card must only display a specific event, owner, or date when the underlying data actually confirms it — never a plausible-looking placeholder standing in for unconfirmed data, consistent with §2's "required data does not mean every field must be displayed" principle and [`contract-card.md` §3.1.2](contract-card.md#312-finalized-element-behaviors)'s work-insights rule against rendering empty/invented values.

**Last meaningful update lives on the detail page, not in `supporting-text`:** §6.1's "Update" content group (last meaningful update, timestamp) is still tracked as part of the card's data model, but per §2.4's value rule it is not surfaced as `supporting-text` on the row itself when there is no accompanying guidance or action — "Applied 2 days ago," "Review started 2 days ago," and similar bare event-elapsed-time phrasing belong on the application detail page (§1's "full history and step-by-step detail... live elsewhere"), not this card. This corrects an earlier version of this section, which treated a precisely-named elapsed-time event (e.g. "Review started 2 days ago" over a generic "Application updated X ago") as sufficient justification for showing it in `supporting-text` — naming the event precisely was the right instinct, but a precisely-named timestamp is still a timestamp, not the value/guidance §2.4 now requires. `supporting-text` only ever surfaces the last meaningful event when that event itself doubles as guidance the professional can act on or is waiting on (e.g. "Awaiting partner review" above) — never as a standalone "X happened N days ago" line.

#### 2.4.2 `supporting-text` is a single optional line, not two separate fields

`supporting-text` is one element, not a `supporting-text` + `supporting-detail` pair. Per the base `application-card` component in Figma ([Application Card](https://www.figma.com/design/Q2IVVTNZQaWHDkUiWztX3C/verita.ds?node-id=5914-1764&t=4kYL66ITNMr5u2AL-11)), the left zone has exactly three text rows: `partner-name` (eyebrow), `application-title`, and the `terms-row` line (`compensation` · `engagement-terms` · `duration`, §2.3/§2.3.2). `supporting-text` is a separate, optional line in the right zone (§2.3), not a fourth left-zone row or a nested sub-field for progress/detail.

For the "Under review, additional requirements" scenario (§2.4.1), where the card needs to communicate both the requested step and the professional's progress against it, that's still just one `supporting-text` line — its _content_ combines both pieces into a single string (e.g. "Complete your assessment · 2 of 4 steps completed"). This is a content/copy concern, not a second component element.

`supporting-text` as a whole remains fully optional per §2.3's anatomy row: it renders only when it has confirmed content for the application's current state, and is omitted entirely (not shown empty) otherwise — consistent with §6.2's fallback rules. The Figma component's `showSupportingText` prop must be derived from that same content-presence check, never set independently of the data and never used to hide content that does exist.

**Clearing the requirement:** once the professional completes an outstanding requirement, `Action required` is removed from `application-status` (it reverts to the plain stage label, e.g. `In review` or `Interview`), and `supporting-text` re-evaluates against §2.4.1's matrix for that now-plain status — typically becoming omitted (e.g. the plain `In review` row) rather than continuing to reference the now-resolved requirement or its now-stale progress count. It must never keep showing the cleared requirement or a stale count.

**Status positioning:** `application-status` (§2.3) stays consistently positioned at the trailing/right edge of the card across every scenario — it is the one element the professional can always find in the same place regardless of what `supporting-text` is currently showing.

> 🙋 The "started, not yet submitted" state (§2.4.1's `Not submitted` row) has no equivalent in the [`engagements.md` §8](engagements.md#8-application-status-enum) canonical status enum, which begins at `APPLIED`. The user-facing label is resolved — **`Not submitted`**, not `In progress` — and [`engagements.md` §2](engagements.md#2-engagement-views) has been updated to match (see [`engagements.md` §8](engagements.md#8-application-status-enum)). What remains open is only the backing system status: the existing canonical enum supports every post-submission scenario in §2.4.1, but has no value yet for this pre-submission state, and none for the `Action required` indicator either — both remain proposed extensions. See the related item in §8 of this doc.
>
> 🙋 Whether `supporting-text` should ever name the review owner after an interview completes (e.g. "Awaiting partner review" vs. "Awaiting Verita review"), or should always stay owner-agnostic ("Interview completed" alone) — the post-interview status itself is resolved (`In review`, no new enum value needed), but whether/when the owner-specific copy variants in §2.4.1's matrix are shown is still to be discussed with the team.

## 3. Stage and status model

`Current stage and status` is backed by the canonical system enum in [`engagements.md` §8](engagements.md#8-application-status-enum), not a free-standing display list. The card maps system status to user-facing label exactly as that table defines:

| System status       | User-facing label |
| ------------------- | ----------------- |
| `APPLIED`           | Applied           |
| `SCORING_PENDING`   | In review         |
| `INTERVIEW_PENDING` | Interview         |
| `UNDER_REVIEW`      | In review         |
| `INTERVIEW`         | Interview         |
| `ACCEPTED`          | Offer received    |
| `REJECTED`          | Not selected      |
| `ON_HOLD`           | On hold           |
| `WITHDRAWN`         | Withdrawn         |

The card must never render the raw system value (`SCORING_PENDING`, `SELECTED`, etc.) — only the mapped user-facing label. `SCORING_PENDING` and `UNDER_REVIEW` intentionally collapse to the same "In review" label; the card does not need to (and per [`engagements.md` §8](engagements.md#8-application-status-enum)'s open decision, may not be able to) distinguish AI scoring from ops review for the professional.

**`Applied` → `In review` transition trigger — product decision needed, not yet finalized:** collapsing `SCORING_PENDING`/`UNDER_REVIEW` into one label (above) is a display-only decision; it does not by itself settle *when* the card is allowed to flip from `Applied` to `In review` in the first place. `SCORING_PENDING` literally means "waiting for AI scoring" ([`engagements.md` §8](engagements.md#8-application-status-enum)) — i.e., scoring hasn't happened yet — so transitioning the card to `In review` the instant `SCORING_PENDING` is set risks claiming an application is being reviewed before the system can substantiate it. The authoritative trigger event for this transition is not yet defined: whether entering `SCORING_PENDING` alone is sufficient, or whether the card should wait for `UNDER_REVIEW` (ops actually evaluating), is an open product decision — see §8.

**`supporting-text` is independent of that decision:** regardless of which system status triggers the status-label transition, the plain `Under review` row (no outstanding requirement) has no `supporting-text` at all, per §2.4's value rule and §2.4.1's matrix — a review-start event ("Review started 2 days ago") is itself a bare timestamp with no guidance attached, the same as the submission-event fallback it would otherwise use, so neither is shown on the row. The review-start date remains available on the application detail page. This section previously specified a confirmed-event-vs-submission-event fallback pair for this row; both were timestamps under the now-clarified §2.4 rule, so the row instead omits `supporting-text` entirely, same as plain `Applied`.

**`· Action required` is a display-only suffix, not a new enum value:** when an application is `In review` (`SCORING_PENDING`/`UNDER_REVIEW`) or `Interview` (`INTERVIEW_PENDING`) and the professional has an outstanding requirement, `application-status` renders the mapped label with an `· Action required` suffix — e.g. `In review · Action required`, `Interview · Action required` (§2.4.1's status matrix). This suffix is composed at display time from the mapped label above plus the existence of an outstanding requirement — it does not require (and must not be implemented as) a separate system status value. The underlying system status is unchanged throughout; only the card's rendering of it changes. This is a proposed extension to the current enum's display rules, not yet confirmed (§2.4.1's open questions).

**Status badge tone (proposed, pending review):** the `application-status` badge uses the shared [`Badge`](../src/components/data-display/badge/badge.tsx) component's `tone` prop — never a one-off color — following the same status→tone convention [`contract-card.md` §3.1.2](contract-card.md#312-finalized-element-behaviors) established (informational vs. healthy vs. needs-attention vs. neutral-terminal vs. negative-terminal), mapped from application status as follows:

| User-facing status              | `tone`    | Rationale                                                                                                       |
| ------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------- |
| **Not submitted**               | `neutral` | Pre-submission draft state — nothing is wrong or pending on anyone; deliberately the most muted tone available. |
| **Applied**                     | `info`    | Informational, not yet underway — submitted and waiting, nothing actionable yet.                                |
| **In review**                   | `success` | Healthy, forward-moving progress — the application is being actively evaluated, an initial positive signal, not merely inert waiting. Mirrors [`contract-card.md` §3.1.2](contract-card.md#312-finalized-element-behaviors)'s `Active` → `success` precedent (`success` means "healthy and progressing," not exclusively "final positive outcome"). |
| **In review · Action required** | `warning` | Needs the professional's attention — an outstanding requirement exists (§2.4.1).                                |
| **Interview**                   | `success` | Healthy, forward-moving progress — same rule as `In review`: an interview requested or scheduled is active momentum, not inert waiting.  |
| **Interview · Action required** | `warning` | Needs the professional's attention — the interview still needs to be scheduled (§2.4.1).                        |
| **On hold**                     | `purple`  | Distinct, parked state — deliberately not `warning`, since being on hold isn't the professional's outstanding requirement to resolve, unlike the `· Action required` rows above; a dedicated tone keeps it visually distinguishable from both active-review and action-needed states. |
| **Offer received**              | `success` | The positive, forward-moving outcome this whole flow is building toward.                                        |
| **Not selected**                | `neutral` | Terminal and outside the professional's control — muted, not negative; rejection isn't a professional failure.  |
| **Withdrawn**                   | `neutral` | Terminal by the professional's own choice — muted, not negative, consistent with `Not selected` above.          |

This follows [`contract-card.md` §3.1.2](contract-card.md#312-finalized-element-behaviors)'s established rationale categories rather than picking tones ad hoc: `info` reserved for `Applied` — the one state with no forward-momentum signal yet, just submitted and waiting — `success` for every state that's healthy and actively progressing (`In review`, `Interview`, `Offer received`) — reusing the Contract card's `Active` → `success` precedent, where `success` means "going well right now," not exclusively "arrived at the final outcome" — `warning` for anything carrying `· Action required` (an outstanding requirement the professional owes), `purple` reserved for `On hold` as its own distinct parked/awaiting-decision state rather than reusing `warning`, and `neutral` for both terminal states (`Not selected` and `Withdrawn` are deliberately treated the same — a rejection is not a "failure" tone, and a self-initiated withdrawal isn't either, so neither uses `destructive`). This card has no state that maps to `destructive`, unlike the Contract card's `Terminated` — there's no Applications status that represents an application ending in a way that should read as negative to the professional rather than simply concluded.

> ⚠️ **Decision needed:** [`engagements.md` §8](engagements.md#8-application-status-enum) leaves `ON_HOLD`'s placement in the suggested lifecycle unresolved, and the pre-offer suggested lifecycle in [`engagements.md` §3](engagements.md#3-applications) (`Interested → Application started → Requirements pending → Submitted → Under review → Interview → Selected → Offer → Contracting → Onboarding → Active → Completed`) predates and doesn't fully align with the §8 enum. This card follows the §8 enum/label table above as authoritative for status display; do not build stage-progress UI (e.g. a stepper) against the suggested lifecycle until it's reconciled against §8 — and, independent of that reconciliation, never build one that assumes `Interview` is a required stage (§3.2).

### 3.1 Status becomes an Offer, not a further Application stage

Per [`engagements.md` §8](engagements.md#8-application-status-enum)'s resolved note, `ACCEPTED` is an Application status, not a Contract or Engagement status — it marks the moment an offer is extended and creates a separate `Offer` object. The Applications card must:

- Continue to show that application under Applications with the `Offer received` label — it does not disappear or move to the Offers view/module.
- Never present the Applications card itself as also being the Offer card. Once `ACCEPTED`, the corresponding Offer surfaces separately per [`engagements.md` §4](engagements.md#4-offers-and-contracting) (Home module 6, per [`dashboard.md` §6](dashboard.md#6-information-architecture)) — with its own expiration-focused content per that section's resolved notes, not a match tier or application-stage language.

This mirrors [`engagements.md` §2](engagements.md#2-engagement-views)'s "Applications preserves history" rule: an application that produces an offer stays visible under `Applications` with its terminal-for-this-view stage shown, while the `Offer` object also appears under `Offers`.

### 3.2 Interview is a conditional stage, not a fixed step

`Interview` (§2.4.1's status matrix; `INTERVIEW_PENDING`/`INTERVIEW` in §3's enum table) does not occur for every application. Whether an application includes an interview is determined by the opportunity's qualification requirements, not by this card or by a fixed sequence the card enforces:

- **Interview required:** the application progresses through the `Interview` stage (`Interview` / `Interview · Action required` per §2.4.1) before reaching a terminal or offer state.
- **Interview not required:** the application progresses directly from `In review` to `Offer received` (or a terminal state) without ever passing through `Interview` — this is a valid, expected path, not a skipped or incomplete one.
- **Multiple interviews:** when an opportunity requires more than one interview, the application-level status remains `Interview` while any interview in the set is still pending or scheduled — individual interview instances are tracked as sub-detail within that stage, not as separate application-level statuses or additional rows on this card. Once the full set of required interviews is completed and evaluation resumes, the application-level status moves to `In review`, the same as the single-interview case (§2.4.1).

**Card consequence:** the Applications card must not assume or render a fixed sequence of stages where `Interview` always appears between `In review` and `Offer received`. Concretely:

- No universal application-progress stepper/timeline component should hardcode `Interview` as a required step — a stepper built against a fixed `Applied → In review → Interview → Offer received` sequence would misrepresent every application whose opportunity doesn't require an interview.
- `supporting-text` (§2.4) must derive its content from the application's actual current status and confirmed events, never from an assumed position in a universal stage sequence.
- This sharpens, not replaces, the existing stepper caution above: even after the §8 enum/lifecycle reconciliation lands, a stepper still must not treat `Interview` as mandatory.

This is a proposed lifecycle rule for [`engagements.md`](engagements.md) to adopt as the source of truth (per this doc's scope boundary, §1) — `engagements.md` §3's suggested lifecycle currently lists `Interview` as a fixed position in one linear sequence, which this rule would supersede for any opportunity that doesn't require an interview.

## 4. Row interaction

The entire application row is a single click target routing to the application detail, where the full next-action and owner state live — there is no separate primary CTA button on the row itself, unlike the Contract card's dedicated primary-action button ([`contract-card.md` §3.1](contract-card.md#31-contract-card-anatomy)). On hover, reveal a trailing arrow affordance to signal the row is interactive, consistent with restrained motion — no delay to interactivity, matching this repo's [Motion System](../CLAUDE.md#motion-system) guidance to keep hover/press feedback in the 120–180 ms range and avoid decorative or delayed feedback on direct interactions.

Both the row-as-click-target and the actions menu below must remain keyboard accessible with a clear, distinct accessible name — the row is a link/button semantically, not a generic clickable `div`.

### 4.1 Actions menu

Alongside the row click target, the card exposes a secondary `actions-menu` (`···`/overflow trigger) revealed on hover/focus, same visual treatment and timing as the trailing arrow affordance above — never permanently visible, so it doesn't compete with the row's own click target for attention on a dense list (§6.2).

**Menu items:**

| Item         | Behavior                                                                                                                                                                                                                                                                                       |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| View Details | Routes to the application detail — the same destination as the row click. Kept as an explicit item despite the overlap, since it gives keyboard and screen-reader users an unambiguous, directly-labeled equivalent to the row click, rather than relying solely on activating the row itself. |
| Share        | Shares the application/opportunity (exact mechanism — link copy, native share sheet, etc. — TBD with design).                                                                                                                                                                                  |
| Withdraw     | Withdraws the application. Destructive and effectively irreversible — requires a confirmation step before executing (§4.1's confirmation rule below); never fires directly off the menu item itself.                                                                                           |

**Status-gated availability:** the menu's item set is not fixed — it depends on the application's current status (§3), not shown uniformly across every row:

- **Withdraw** only appears while the application is still in an active, withdrawable state (e.g. `Not submitted`, `Applied`, `In review`, `Interview`, `On hold`, and their `· Action required` variants). It's hidden once the application has already reached a terminal state — `Withdrawn` (already withdrawn), `Not selected`, or `Offer received` (withdrawing no longer applies once an offer exists; that decision belongs to the Offer flow instead, not this card). This mirrors §2's "required data does not mean every field must be displayed in every state" principle, applied here to actions instead of content fields.
- **View Details** and **Share** are available regardless of status — both remain meaningful for a terminal application (reviewing history, sharing a past outcome).
- The exact status→action mapping above is a first pass; confirm the full mapping with design/product before implementation, particularly whether `Share` should be restricted for a `Not submitted` draft that isn't yet a real application (§8).

**Withdraw confirmation:** selecting `Withdraw` from the menu must not withdraw immediately — it opens a confirmation step (dialog or equivalent) that states the consequence and requires an explicit second action before the withdrawal executes. This follows this repo's [Motion System](../CLAUDE.md#motion-system) guidance for dialogs (§ Dialogs and Overlays: overlay fade, small scale/vertical movement for the surface, shorter exit than entrance) and must not block the rest of the row/list while open only for the affected row.

Selecting any menu item must not also trigger the row's own click-through to application detail — the menu is a distinct interactive target from the row body per §6.2's "no nested interactive control should compete with it for the same click" rule, which this section extends from "no competing control" to "the competing control that does exist must not double-fire both behaviors."

## 5. Visibility rule

> The Home module renders even with zero applications, as the Dashboard's default empty state: the Applications module is not hidden when the professional has no applications — per [Empty State — A](https://www.figma.com/design/hdxBo3xOg3uMSovZwidJF5/Verita?node-id=5642-2215), it is the module that carries the pre-Contract, pre-application default empty condition for the whole Dashboard (see [`dashboard.md` §7.6](dashboard.md#76-applications-offers-active-engagement-training-payments)'s resolved note for the full Dashboard-level fallback logic). This supersedes the earlier assumption that Home "drops the module entirely when no application exists" (§5.1's older wording, now corrected). Once at least one application exists, the module switches from its empty state to the row list (§5's other resolved note below); once an application progresses to an active Contract, the Contracts module (`dashboard.md` §6 item 3) takes over as dominant per its own resolution, but the Applications module keeps rendering its row list — it does not hide once a Contract exists, since the professional can still have other in-flight applications.

> Home preview: most-recently-applied first, capped at 5, with a link to see all: the Home "Your applications" preview (§6 module 5 of [`dashboard.md`](dashboard.md#6-information-architecture)) sorts by most recently applied first and shows at most 5 rows, regardless of status — including terminal ones (e.g. `Withdrawn`, `Not selected`). No separate terminal-state cutoff or recency window is needed beyond the fixed count: a terminal application simply ages out of the top 5 as more recent applications accumulate, the same as any other row. Below the list, a link routes to Engagements → Applications for the full, unfiltered history. This resolves the earlier open question about a distinct recency/filtering rule — the fixed-count-plus-link pattern replaces the need for one. This also resolves §7's related open item on Home ordering; the full Engagements → Applications list's own ordering remains open (§8).

Per [`engagements.md` §2](engagements.md#2-engagement-views), an application is never removed from the `Applications` view when it progresses to an offer or ends in rejection/withdrawal — it stays accessible there with its terminal stage shown. This applies to the full Engagements → Applications view; the Home preview instead uses the fixed-count-plus-link rule above.

### 5.1 Zero-state on Engagements → Applications

Home and the Engagements → Applications view both render something with zero applications rather than a blank/hidden state — Home for the reason in §5's resolved note above, and Engagements → Applications because it's a dedicated destination the professional can navigate to directly and must never render an empty page. The two zero-states use different components appropriate to their context, but the same confirmed copy:

- **Home module:** inline empty-state content within the module itself — title "No applications yet," description "Find opportunities that fit your expertise and interests.," CTA "Discover opportunities" — per [Empty State — A](https://www.figma.com/design/hdxBo3xOg3uMSovZwidJF5/Verita?node-id=5642-2215) and [`dashboard.md` §7.6](dashboard.md#76-applications-offers-active-engagement-training-payments).
- **Engagements → Applications destination:** reuses the shared `SectionEmptyState` component (`src/components/cards/section-empty-state/`; Figma: [Section Empty State](https://www.figma.com/design/Q2IVVTNZQaWHDkUiWztX3C/verita.ds?node-id=5669-4731&t=4kYL66ITNMr5u2AL-11)) rather than a bespoke empty state built for this card — the same pattern already used elsewhere for empty sections (e.g. "No engagements yet"). Use the same confirmed copy above unless the full-page destination context calls for different wording — not yet confirmed either way.

> Zero-state copy confirmed via Figma: "No applications yet" / "Find opportunities that fit your expertise and interests." / "Discover opportunities," per [Empty State — A](https://www.figma.com/design/hdxBo3xOg3uMSovZwidJF5/Verita?node-id=5642-2215). This resolves the earlier open question on this copy for the Home module; whether the Engagements → Applications destination should reuse this exact copy or get its own variant remains open.

## 6. Component content model

The component receives a summary of one authoritative Application. This is a presentation model, not a new lifecycle or a finalized API schema. The parent module (Home's "Your applications," or the full Engagements → Applications list) selects which applications to show and in what order; the card determines how each supplied summary is presented.

### 6.1 Content groups

| Group                 | Content                                                                                 | Rendering rule                                                                                                                                                                                                                |
| --------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Identity**          | Opportunity title, permitted partner label, application-detail destination              | Require a stable ID and title for a normal row. Use the permitted partner label; never reveal a hidden partner through image alternative text.                                                                                |
| **Status**            | Authoritative application status (§3), mapped user-facing label                         | Show the mapped label only, never the raw system enum. Status differences remain visible when the list contains mixed statuses.                                                                                               |
| **Update**            | Last meaningful update, timestamp                                                       | Tracked in the model, but per §2.4's value rule not rendered as this card's `supporting-text` on its own — a bare "X happened N days ago" timestamp with no attached guidance/action belongs on the application detail page, not the row. |
| **Next action**       | Next-action text, next-action owner (professional, Verita, or partner, §2.2)            | State the action in specific, destination-named terms — not a generic "Continue application." Owner determines whether Progress (below) renders a step count or is omitted in favor of a plain status.                        |
| **Deadline**          | Deadline value, when applicable                                                         | Omit unavailable deadlines rather than inventing them. Material deadlines get date, time, and timezone, consistent with [`engagements.md` §4](engagements.md#4-offers-and-contracting)'s resolved Offer-expiration precedent. |
| **Progress**          | Completed/total requirement counts, only when the owner is the professional (§2.1–§2.2) | Show a countable step metric only when the application's stage supports one and the professional owns the next action. Never a cosmetic percentage, an empty bar, or a partner/Verita-side step count.                        |
| **Data availability** | Initial load/refresh state, errors, last successful update when available               | Keep technical availability separate from application status. Missing or failed data must not become an empty list or a falsely resolved application.                                                                         |

### 6.2 Composition and fallback rules

- Present identity first, then status, then next action/deadline, then progress when applicable — following §2's field order.
- Collapse an absent optional field without a blank row or placeholder text. A missing deadline is omitted, not shown as "No deadline."
- If required identity or status cannot be established, show an unavailable state with recovery rather than a normal actionable row.
- Label progress precisely, e.g. "2 of 4 steps completed" — never a bare percentage divorced from the underlying count.
- The row itself is the only interactive target (§4); no nested interactive control should compete with it for the same click.

## 7. Multiple applications

A professional can have more than one active application at once ([`dashboard.md` §8](dashboard.md#8-functional-requirements) FR requires supporting "concurrent applications and engagements without reducing the user to a single irreversible state").

Required behaviors:

- Each row opens its corresponding application detail independently.
- An error loading one application's data must not affect other rows.
- A status change on one application must not affect another.
- Row order should be deterministic. Home's preview order is resolved — most recently applied first, capped at 5 (§5). The ordering policy for the full Engagements → Applications list remains open (§8).

## 8. Open questions

- 🙋 What `Discipline` represents (professional's or opportunity's discipline/specialty) and where it should surface — Figma's component exposes a `showDiscipline` toggle, but it's deliberately left out of this card's anatomy (§2.3) pending a team discussion; it may belong on the application/opportunity detail page instead of this card.
- 🙋 Define the authoritative event that transitions `application-status` from `Applied` to `In review` — whether entering `SCORING_PENDING` (AI scoring queued, not yet scored) is sufficient, or whether the transition should wait for `UNDER_REVIEW` (ops actually evaluating). This prevents the card from claiming an application is being reviewed before the system can substantiate it. (§3)
- 🙋 Review and confirm the proposed `application-status` badge tone table (§3) — first pass, awaiting sign-off before treating it as settled the way [`contract-card.md` §3.1.2](contract-card.md#312-finalized-element-behaviors)'s tone table is.
- 🙋 Whether the owner label itself (e.g. "Waiting on you" vs. "Waiting on [partner]") should surface inline on the row, or only after clicking through to the application detail — the step-count-vs-status rendering rule is resolved (§2.2), but this labeling-placement question is not.
- 🙋 Reconcile the suggested pre-offer lifecycle in [`engagements.md` §3](engagements.md#3-applications) against the canonical status enum in [`engagements.md` §8`](engagements.md#8-application-status-enum) before building any stage-progress UI (e.g. a stepper) on this card. (§3)
- 🙋 Confirm and adopt into [`engagements.md`](engagements.md) the rule that `Interview` is a conditional lifecycle stage (opportunity-dependent), not a fixed step every application passes through — `engagements.md` §3's suggested lifecycle currently lists it as a fixed position in one linear sequence. (§3.2)
- 🙋 Confirm `ON_HOLD`'s placement and user-facing treatment relative to the other statuses. (§3, [`engagements.md` §8](engagements.md#8-application-status-enum))
- 🙋 Define a canonical system status for "started, not yet submitted" in [`engagements.md` §8](engagements.md#8-application-status-enum) — the user-facing label is resolved (`Not submitted`, per [`engagements.md` §8](engagements.md#8-application-status-enum)'s resolved note), but no backing enum value exists yet, and this card's supporting-text model (§2.4) needs one to treat it as a real, orderable status distinct from `Applied`.
- 🙋 Confirm whether `· Action required` should be formalized as a display-only suffix composable onto any mapped status label (proposed in §3), and which statuses besides `In review`/`Interview` it applies to.
- 🙋 Whether `supporting-text` should name the review owner after an interview completes ("Awaiting partner review" / "Awaiting Verita review") or should always stay owner-agnostic ("Interview completed" alone) — to discuss with the team. (§2.4.1)
- 🙋 What is the ordering policy for the full Engagements → Applications list? Home's own ordering is resolved (most recently applied first, capped at 5; §5, §7).
- 🙋 Whether the Engagements → Applications destination zero-state should reuse the confirmed Home copy ("No applications yet" / "Find opportunities that fit your expertise and interests." / "Discover opportunities") verbatim, or use its own variant suited to a full-page destination rather than an inline module. (§5.1)
- 🙋 Confirm the full actions-menu status→availability mapping with design/product, particularly whether `Share` should be restricted for a `Not submitted` draft that isn't yet a real, submitted application. (§4.1)
- 🙋 Confirm the exact `Share` mechanism (link copy, native share sheet, or something else). (§4.1)

## 9. Related docs

- `product-specs/dashboard.md` — the Home/Dashboard PRD. Applications is referenced there as Home module 5 ([§6](dashboard.md#6-information-architecture)).
- `product-specs/engagements.md` — the Engagements PRD. [§2](engagements.md#2-engagement-views) defines `Applications` as an Engagement view; [§3](engagements.md#3-applications) is the source-of-truth row model this card surfaces a preview of; [§8](engagements.md#8-application-status-enum) is the canonical status enum behind §3's stage/status model; [§9](engagements.md#9-application-fields) is the underlying Application field list.
- `product-specs/contract-card.md` — the sibling Home-module card PRD for Contracts, used here as the structural precedent for a Home-preview-over-Engagements-view card, and source of truth for the compensation display variants (§3.3) referenced in §2.3.1 and the shared Duration field (§3.2.1) referenced in §2.3.2.
- `product-specs/match-card.md` — the sibling pre-Apply card PRD for Matches, sharing this card's advertised-range compensation model (§2.3.1, [`match-card.md` §3.1](match-card.md#31-compensation-advertised-range-vs-agreed-amount)) and duration model (§2.3.2, [`match-card.md` §3.2](match-card.md#32-duration)) since both precede a signed Contract.

<!--
Created: Sep 16, 2026
Created by: Julio Caunedo
Last updated: Sep 16, 2026
Scope: Verita AI Dashboard — the Next steps module (a generic self-directed task-card module; onboarding and profile-improvement tasks are its most common content today, but it is not scoped to those alone).
Purpose: Define the Next steps module's content, requirement-level badges, dismiss behavior, and visibility rule, split out of the Dashboard PRD (product-specs/dashboard.md) [§7.2](dashboard.md#72-next-steps).
-->

# Next Steps Card

**Status:** Draft for product and design alignment

**Related doc:** `product-specs/dashboard.md` — the Dashboard PRD. Next steps is referenced there as Home module 2 (§6) and as one of the Key Dashboard experiences (§7); this doc is the source of truth for the module's card content, badge model, dismiss behavior, and visibility rule. See [dashboard.md §5](dashboard.md#5-task-requirement-taxonomy) for the task requirement taxonomy this module's badges are backed by, and [§7.1](dashboard.md#71-opportunity-alert) for how Next steps differs from Opportunity alert.

**Figma reference:** [Next Steps Cards Examples](https://www.figma.com/design/hdxBo3xOg3uMSovZwidJF5/Verita?node-id=5885-11376&t=SXGi01R5HLsxNV4u-11) — the card examples in §6 below.

## 1. What Next steps is

Next steps is the task module referenced in [`dashboard.md` §6](dashboard.md#6-information-architecture) module 2. It renders as a row of individually-tappable task cards rather than a single dominant action.

> "Next steps" (not "Complete your profile") is the deliberate, final section title — chosen specifically because it's generic enough to hold any self-directed task, not only profile-completion items. Onboarding and profile-improvement tasks are its most common content today, but the module isn't scoped to those alone; any task that fits the §2.1–§2.3 badge/dismiss model belongs here.

> ℹ️ Next steps and Opportunity alert ([`dashboard.md` §7.1](dashboard.md#71-opportunity-alert)) are two different modules. Opportunity alert is the single-emphasis slot for an externally-initiated opportunity event (new offer, interview requested, contract ready to sign) — see [`dashboard.md` §7.1](dashboard.md#71-opportunity-alert) for the full distinction. Next steps is a multi-card module that can show several same-weight, self-directed tasks at once.

## 2. Card content

Each Next steps card must include:

- Requirement-level badge, using the user-facing label for the [`dashboard.md` §5](dashboard.md#5-task-requirement-taxonomy) taxonomy level that applies to that task — not a free-form or two-value label. §2.2 maps each system level to its badge text; §2.3 defines each level's precise behavior.
- Task title, stated as a specific, destination-named action ([`dashboard.md` §12](dashboard.md#12-ux-content-requirements)).
- Short explanation of why it matters or what it unlocks.
- One primary CTA routed to the task.
- A dismiss (X) affordance on hover, for non-required tasks only (§2.1).

### 2.1 Dismiss behavior

On hover, a card for a `Recommended` task shows an **X** affordance in the top-right corner, letting the professional dismiss it directly from the card. `Blocking` and `Required later` cards do not show the X; they cannot be dismissed while applicable, per [`dashboard.md` §5](dashboard.md#5-task-requirement-taxonomy)'s requirement-level treatment.

> Dismissing requires no confirmation step. The X is a direct, immediate action — clicking it removes the card without an "Are you sure?" interstitial. This keeps the interaction as low-friction as completing a task, consistent with §2.1's framing that dismissal is a legitimate, equally-valid way to clear Next steps, not a discouraged escape hatch that should be gated behind extra friction.

The goal for the professional is to reach zero cards in Next steps — dismissing a non-required task is a legitimate way to get there, not just completing it. This reframes the module's job: it isn't only a checklist to finish, it's a tray the professional can actively clear, whether by completing a task or by dismissing the ones that don't matter to them.

> A dismissed task re-surfaces in Next steps if it later becomes relevant again — e.g. a dismissed `Recommended` task that a specific application or opportunity now depends on re-enters the module at its new, higher requirement level (`Required later` or `Required now`, per §2.3). Dismissal suppresses a task only for as long as it stays `Recommended`; it is not a permanent, unconditional removal. This is the same mechanism as §2.3's requirement that every visible task have an identifiable benefit or dependency — dismissal doesn't create a separate rule, it just means the task was hidden while its benefit didn't yet warrant showing it again.

> There is no manual un-dismiss. A professional cannot reverse a dismissal from a settings or profile-completeness area, or by any other direct action — the only way a dismissed task re-surfaces is automatically, triggered by its requirement level changing (the mechanism described above). Dismissal is a one-way action from the professional's side; re-appearance is entirely system-driven.

### 2.2 Badge label: system level vs. user-facing text

The requirement-level badge never renders the system taxonomy name ([`dashboard.md` §5](dashboard.md#5-task-requirement-taxonomy)'s `Blocking`) on the card — that's engineering/data-model language, not something a professional should read about their own task. The card shows a friendly, conversational label instead:

| System level ([`dashboard.md` §5](dashboard.md#5-task-requirement-taxonomy)) | User-facing badge  |
| -------------------------------- | ------------------ |
| `Blocking`                       | **Required now**   |
| `Required later`                 | **Required later** |
| `Recommended`                    | **Recommended**    |

`Blocking` → "Required now" is the one level that needs translating; the other two already read naturally as-is. [`dashboard.md` §5](dashboard.md#5-task-requirement-taxonomy) also defines an `Optional` level, but per §2.3 it never appears as a badge in Next steps — see §2.3 for why.

### 2.3 Precise behavior per level

`Recommended` and `Optional` were both dismissible (§2.1) with no other stated behavioral difference between them — two badges that behave identically weren't earning their keep. Each level is defined precisely below so the distinction is explicit and testable, not left to badge color alone.

| Badge              | System level     | Definition                                                                                                                                            | Dismissible                                           | Requires                                                                          |
| ------------------ | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Required now**   | `Blocking`       | Prerequisite for an action or workflow the professional is currently pursuing.                                                                        | No — remains until completed or no longer applicable. | A defined blocking dependency.                                                    |
| **Required later** | `Required later` | Required for a known subsequent stage but does not prevent the professional from continuing their current workflow. May transition to `Required now`. | No                                                    | A known future dependency.                                                        |
| **Recommended**    | `Recommended`    | Provides an identifiable benefit to the professional — e.g. improves profile quality or supports matching.                                            | Yes                                                   | A clear, explainable benefit, grounded in the professional's actual profile data. |

The distinction that matters: **`Recommended` implies the product has a specific reason to suggest this task to this professional.** An `Optional` badge would only communicate that an action is available, with no claim of relevance or benefit — that's not a distinction worth a badge.

> `Optional` does not exist as a badge or a visible state. Every task shown in Next steps must have an identifiable benefit or dependency — one of the three rows above. A task with no established benefit or dependency does not surface in Next steps at all; it simply isn't shown until the system can attach a `Recommended`, `Required later`, or `Required now` reason to it. This applies to a dismissed task re-surfacing too (§2.1): it only comes back once it has earned one of these three levels, never as a bare "available, no reason given" card.

A task's benefit or dependency must be dynamic and re-evaluated as the professional's applications and matches change — not assigned once at task creation. A task with no current benefit or dependency can still gain one later (e.g. it becomes `Recommended` once it would measurably improve match quality, or `Required later` once a specific application or opportunity depends on it) and enter Next steps at that point.

## 3. Task eligibility rules

A task is eligible to appear in Next steps only when **all** of the following are true:

- The task is applicable to the professional.
- The underlying action is incomplete.
- The task has not been dismissed — unless a new requirement overrides that dismissal (§2.1).
- The action is currently available, or is a known future requirement.
- The task has a valid destination.

Additionally, the product must be able to state **why the task exists** — this is the same requirement as §2.3's identifiable-benefit-or-dependency rule, restated here as a gate every task must clear before it's eligible at all, not just a property of the `Recommended` badge.

| Task                  | Eligibility condition                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------- |
| Complete profile      | One or more essential profile fields are missing.                                           |
| Confirm availability  | Availability has not been configured.                                                       |
| Upload resume         | Resume is missing and enrichment is recommended.                                            |
| Complete AI interview | Interview is assigned or required.                                                          |
| Add certifications    | Relevant certifications are missing and there is a matching-related reason to request them. |

This prevents the Dashboard from becoming a generic list of empty profile sections — a task only earns a card once its specific eligibility condition is true, not because a profile field happens to be blank.

### 3.1 Task generation model

§3's conditions describe when an existing candidate task is _eligible to show_. This section describes the different ways a task is _generated_ in the first place — the trigger that creates or regenerates it. A task belongs to exactly one of these five types:

| Type                | Generated when                                                                                              | Example                                                                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **One-time**        | A specific requirement has not been fulfilled.                                                              | Complete profile, connect LinkedIn, confirm work authorization.                                                                                               |
| **Recurring**       | On a defined interval, while an underlying condition remains active.                                        | Submit weekly `ContractAvailability` for an active contract ([`engagements.md` §5.1](engagements.md#51-contract-availability-vs-profile-availability)) — distinct from Profile's one-time `Availability`, [`my-profile.md` §11.4](my-profile.md#114-profile-availability-vs-contract-availability). |
| **Event-triggered** | A relevant event requires action.                                                                           | A contract requests an updated document.                                                                                                                      |
| **Deadline-driven** | An existing obligation approaches its due date — generated ahead of the deadline, or escalated as it nears. | Complete a mandatory compliance requirement before a contract starts.                                                                                         |
| **Recommendation**  | The system identifies a relevant, non-mandatory improvement.                                                | Add certifications relevant to the expert's domain.                                                                                                           |

How generation type relates to the badge model (§2.3): a **Recommendation** task is what carries the `Recommended` badge — its existence _is_ the identifiable-benefit reason §2.3 requires. **One-time**, **Event-triggered**, and **Deadline-driven** tasks typically carry `Required now` or `Required later`, depending on whether the deadline or dependency is immediate. A **Deadline-driven** task is the clearest case of a task escalating badge level over time: it can be generated as `Required later` and escalate to `Required now` as its due date approaches, without changing its underlying generation type. **Recurring** tasks are generated repeatedly on a cadence rather than once — each occurrence is evaluated against §3's eligibility conditions independently (e.g. a new "Submit weekly availability" task is only eligible while the contract stays active).

> A `Recurring` task is always `Required later` or `Required now` — never `Recommended`. This follows directly from §2.1: dismissal only exists for `Recommended` tasks, and a `Recurring` task represents something the professional is actually being asked to do (e.g. submit `ContractAvailability`), not a suggestion. Since it's never dismissible in the first place, dismissal is not a valid way to clear a `Recurring` task's current occurrence — **completion is the only path.** If the current occurrence isn't completed before the next one is due to generate, the existing occurrence should escalate in urgency (following the same `Required later` → `Required now` pattern as **Deadline-driven** tasks) rather than being silently replaced or allowed to lapse. This also answers the "goal of zero cards" question (§2.1): a `Recurring` task must be completed each cycle to reach zero, the same as any other required task — it is not exempt from that goal, it simply returns on its next cycle after being properly completed.

## 4. Visibility rule

The Next steps module renders only while at least one eligible (§3) task exists for the professional. Once every task in the module is completed, dismissed, or no longer eligible, the module is removed from the Dashboard entirely — it must not remain visible in an empty state. This follows [`dashboard.md` §8](dashboard.md#8-functional-requirements)'s broader empty-state principle (FR-9, "no urgent tasks: confirm that nothing requires attention") but goes further for this specific module: the empty case is no module, not a confirmation message in its place. The dismiss affordance in §2.1 is one of the two paths (alongside completion) to reaching that empty state.

## 5. Open questions

- 🙋 What are the specific triggers (application events, match signals, profile changes) that establish or change a task's eligibility (§3) or identifiable benefit/dependency (§2.3), causing it to enter, re-enter, or level up within Next steps? This logic isn't defined anywhere yet and needs a source — likely the same priority/matching logic referenced in [`dashboard.md` §4](dashboard.md#4-dashboard-priority-engine). To be discussed with engineering.

  Design-perspective assumption, not yet confirmed: a task's eligibility/benefit is driven by the professional's own applications, not by matching activity — a **Match** being generated (`dashboard.md` §10.3) should not by itself surface or change a Next steps task. The likely trigger surface is: the professional starts an application and it's still in progress (a pending requirement on that application can surface), an opportunity is accepted and carries specific requirements, or additional onboarding/approval steps are still needed to be fully accepted. Separately, badge escalation driven by an approaching deadline (e.g. `Complete compliance training` moving from `Required later` to `Required now`, §3.1) implies a distinct date-checking mechanism must exist — something has to evaluate deadlines on an ongoing basis, not just react to a one-time event. Whether that's the same engine as the application-driven triggers above, or a separate scheduled process, is part of what needs engineering input.


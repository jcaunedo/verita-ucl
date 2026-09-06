<!--
Created: Aug 28, 2026
Created by: Julio Caunedo
Last updated: Aug 30, 2026
Scope: Verita AI professional Home/Dashboard after sign-in across onboarding, matching, applications, offers, engagements, training, and payments.
Purpose: Define the product, UX, information architecture, state, and data requirements needed to design the Dashboard.
-->

# Professional Dashboard PRD

**Status:** Draft for product and design alignment  
**Primary users:** Independent professionals and experts across various fields and professions who use Verita to find, apply to, and get paid for project-based work opportunities.

## 1. Summary

Verita AI is an AI-powered marketplace that connects experienced independent professionals with remote, project-based work. A professional describes their expertise; Verita interviews them, matches them with relevant opportunities, and trains them for engagements.

The Dashboard is the professional's landing page after sign-in. It must not behave like a fixed collection of widgets or a generic job board. It must operate as a state-driven orchestration layer that helps the professional understand:

1. What do I need to do now?
2. Which opportunities fit me?
3. What is happening with opportunities or work I have already engaged with?

Dashboard content, order, and calls to action must adapt to the professional's lifecycle state, unresolved requirements, time-sensitive events, match quality, application activity, and active engagements.

## 2. Problem

Onboarding contains both required and skippable questions. Some skipped items may become necessary only when the professional wants to apply, accept an offer, begin work, train, or receive payment. A static Dashboard risks:

- Giving all tasks equal visual weight even when their consequences differ.
- Showing profile administration without explaining why it matters.
- Showing open roles instead of explaining why a role fits.
- Separating a matched opportunity from the requirement blocking its application.
- Continuing to prioritize job discovery after the professional has active work.
- Hiding application, offer, training, or payment actions in secondary areas.

The Dashboard needs to convert these states into a clear, prioritized next step while preserving access to the broader marketplace and account details.

## 3. Product objective

Create a personalized Home experience that makes Verita's AI value visible by connecting professional data, opportunity data, and workflow state into contextual recommendations and actions.

### Goals

- Surface one clearly dominant next best action.
- Explain why recommended opportunities fit the professional.
- Convert missing requirements into contextual, actionable guidance.
- Show the state and next step of active applications.
- Adapt the information hierarchy when the professional receives an offer or begins an engagement.
- Let professionals understand what is required now, required later, recommended, or optional.
- Support the full journey from incomplete onboarding to completed engagement and renewed availability.
- Give design and engineering a reusable task and priority model rather than hard-coded Dashboard cards.

### Non-goals

- Defining the complete onboarding flow.
- Defining opportunity-detail, application, interview, contract, training, payment, or referral flows in full.
- Designing the employer or partner experience.
- Finalizing match-scoring algorithms or exposing an internal numeric score.
- Finalizing legal, identity, work-authorization, tax, background-check, or payment-provider requirements.
- Replacing dedicated marketplace, profile, applications, or work-management pages.

## 4. Primary user

An experienced independent professional seeking remote, project-based work whose profile, qualification, application, or engagement status may be incomplete or changing.

### Core user needs

- Understand what Verita needs from me and why.
- See roles that fit my expertise, availability, preferences, and rate.
- Know whether I can apply now, and if not, exactly what's missing and how to fix it.
- Resolve application blockers without losing the opportunity context.
- Track applications and know the next action and its owner.
- Respond to interviews, offers, contracts, training, and payment setup on time.
- Manage active work without irrelevant discovery content dominating the page.

## 5. Experience principles

### 5.1 State before sections

The page hierarchy must respond to the professional's current lifecycle rather than always rendering the same modules in the same order.

### 5.2 Opportunity-anchored requirements

When a task blocks a specific opportunity, keep the opportunity as the anchor and explain the required action in that context.

Example:

> **You're a strong match for Senior Product Designer**  
> Complete your AI interview to apply.

### 5.3 One dominant action

The highest-priority unresolved action should receive the strongest visual emphasis. Other actions remain available but must not compete equally.

### 5.4 Explain fit, not scoring machinery

Use a plain-language tier such as **Strong match** and a concise reason based on relevant evidence. Internal scores and confidence values should not be exposed by default.

### 5.5 Progressive requirements

Ask for information when it becomes useful or necessary. Do not front-load work-authorization, payout, tax, or training tasks before the corresponding journey stage unless policy requires it.

### 5.6 Honest status

Never imply that an application, interview, offer, contract, training module, or payment has advanced when it has not. Identify whether the next action belongs to the professional, Verita, or a partner.

### 5.7 Stable navigation, adaptive content

Primary navigation should remain predictable while Dashboard content changes with state.

## 6. Success measures

### Primary metrics

- Next-best-action completion rate.
- Percentage of eligible professionals who begin an application from a match.
- Application completion and submission rate.
- Median time from a blocking task being shown to completion.
- Interview, offer, contracting, and engagement-onboarding response times.
- Percentage of users with current availability data.

### Supporting metrics

- Match-card view-to-apply conversion.
- Match dismissal rate and dismissal-reason distribution.
- Resume or portfolio completion when prompted contextually.
- Return visits to application status.
- Training completion before deadline.
- Payout setup completed before first payment.
- Dashboard task snooze and dismissal rates.

### Guardrail metrics

- Incorrect or ineligible match reports.
- Application attempts blocked after the Dashboard indicated readiness.
- Stale or contradictory task states.
- Missed time-sensitive actions.
- Support contacts related to unclear status or requirements.

> ⚠️ **Decision needed:** Set baseline values, target improvements, attribution windows, and the launch evaluation period.

## 7. User lifecycle model

The Dashboard must support these product-level lifecycle states:

1. Account created
2. Profile started
3. Qualification pending
4. Marketplace ready
5. Matches available
6. Application active
7. Interviewing
8. Offer received
9. Engagement onboarding
10. Active engagement
11. Engagement completed
12. Available again
13. Inactive

The lifecycle is not strictly linear. A professional may have multiple applications, retain marketplace access while working, return to qualification for a role-specific assessment, or become available again after an engagement.

> ⚠️ **Decision needed:** Define the canonical lifecycle enum, transition rules, precedence when multiple states coexist, and whether `Inactive` is user-selected, system-derived, or both.

## 8. Dashboard priority engine

The system must rank candidate Dashboard items before rendering the page.

| Priority | Class                  | Definition                                                      | Examples                                                        |
| -------- | ---------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| P0       | Blocking action        | Prevents the professional from advancing in an active journey   | Sign contract, complete required assessment, verify eligibility |
| P1       | Time-sensitive action  | Has an approaching deadline or requires a prompt response       | Interview requested, offer expires tomorrow, role closes Friday |
| P2       | Strong recommendation  | High-value opportunity or action that is not currently blocking | New strong match                                                |
| P3       | Profile improvement    | Improves match quality, confidence, or readiness                | Add portfolio, confirm availability, link LinkedIn              |
| P4       | Discovery or ecosystem | Useful but secondary to current work and required actions       | Browse roles, referral program                                  |

### Ranking requirements

- Rank by priority class first.
- Within a class, consider deadline, lifecycle relevance, opportunity strength, age, and whether the item was already seen.
- A P0 or P1 item tied to an active opportunity, offer, or engagement should usually become the next best action.
- Do not let a generic profile recommendation outrank an application, interview, offer, contract, training, or payment deadline.
- Suppress completed, expired, superseded, and inapplicable items.
- Avoid duplicating the same underlying action in multiple modules.
- When several items share priority, use deterministic tie-breaking so the page does not reorder unpredictably.
- Preserve access to all unresolved items through a secondary task view or expandable list.

> ⚠️ **Decision needed:** Define scoring weights, tie-break rules, caps per module, refresh cadence, and whether operations can manually override ranking.

## 9. Task requirement taxonomy

Every task must have one of four requirement levels:

| Level          | Meaning                                                     | UX treatment                                                                        |
| -------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Blocking       | Must be completed now to advance in a current journey       | Highest urgency; state consequence explicitly; cannot be dismissed while applicable |
| Required later | Will be required before a known future step                 | Explain the future trigger; allow deferral until it becomes blocking                |
| Recommended    | Improves matching likelihood, readiness, or profile quality | Encourage without implying that it is mandatory                                     |
| Optional       | Adds value but has no workflow consequence                  | Low emphasis; may be dismissed                                                      |

Examples from the source model:

| Task                 | During onboarding | Later consequence                                        |
| -------------------- | ----------------- | -------------------------------------------------------- |
| Expertise summary    | Required          | Required to use the matching experience                  |
| Resume               | Skippable         | May be required for some opportunities                   |
| LinkedIn             | Optional          | Remains optional unless product policy changes           |
| Phone                | Skippable         | May be required for identity, communication, or recovery |
| Availability         | Skippable         | Needed for strong matching                               |
| Rate                 | Skippable         | Needed for rate alignment and strong matching            |
| General AI interview | Skippable         | May be required for some opportunities                   |
| Work authorization   | Skippable         | Required before certain applications or engagements      |

> ⚠️ **Policy validation:** The table above reflects the source proposal, not confirmed Verita policy. Each task's requirement level and trigger must be approved by product, operations, legal, and engineering as applicable.

## 10. Information architecture

The Dashboard may draw from these modules. Visibility and order are state-dependent.

1. **Next best action** — the highest-priority action now (§11.1).
2. **Next steps** — a row of individual blocking, required-later, and recommended tasks, shown only while at least one is applicable (§11.2).
3. **Contracts** — the professional's active and upcoming secured work, when any exists (§10.2 object model, §11.7).
4. **Matching opportunities** — AI-selected opportunities with fit explanations and readiness state (§10.3).
5. **Your applications** — active applications, current stage, and next action.
6. **Offers** — offers awaiting the professional's response, when any exist (§11.6).
7. **Discover more opportunities** — entry to broader marketplace browsing.
8. **Referrals** — secondary unless a referral event requires attention.

> ✅ **Resolved — "Contracts" names both a Home module and an Engagements view:** this follows the same pattern already established for Matches (§10.3): the Home module is a filtered, top-of-list surface over the same underlying `Contract` objects as the full Engagements → Contracts view (§10.2), not a competing or differently-scoped concept. The Home module shows active and upcoming contracts only; the Engagements view shows the full history (upcoming, active, completed, terminated, per §10.2's Contracts definition). Per §11.7, when a contract is active it must outrank job discovery — so unlike other Home modules, Contracts is not merely present, it is the most prominent content on the page whenever at least one exists. This supersedes the earlier "Current work" module name.
>
> ⚠️ **Decision needed:** confirm whether "Next steps" is a new, distinct module or supersedes/renames what this list previously called "Complete your profile" — the Figma design reviewed for §11.2 mixes blocking and required-later tasks into this module, not just non-blocking profile improvements, so the two names may now describe the same thing under different scopes.

### 10.1 Main navigation

Primary navigation is fixed and state-independent (per §5.7). Each item and its naming rationale:

| Navigation item | Purpose                                                                                                                                                                                                                                               | Rationale for the name                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Home            | Gives the user a personalized overview of what requires attention now: next steps, active applications, matches, active engagements, and relevant updates.                                                                                            | Home is the clearest label for the primary landing destination. It signals a personalized starting point rather than a specific workflow.                                                                                                                                                                                                                                                                                                                                                                                                  |
| Browse Work     | Takes the user to the marketplace to review available work, evaluate fit, and decide what to apply to — including project-based, one-time, retainer, or other engagement types. Includes a personalized Matches view (§10.3).                         | Balances clarity, action, and breadth. "Browse" signals an exploratory action without implying the user already knows exactly what they want. "Work" is broader than "Jobs" or "Roles," supporting project-based, one-time, retainer, contract, and full-time opportunities. More explicit than "Discover," less generic than "Explore." Avoids overusing "Opportunities" while still clearly communicating that this is where available work is found. See resolved note below for full rationale, including competitive differentiation. |
| Engagements     | Houses the user's ongoing and historical interactions with opportunities, organized into views: Saved, Applications, Assessments, Offers, and Contracts (§10.2). Can include project details, stage/status, hours, requirements, and related actions. | Engagements represents the user's relationship with opportunities after discovery. It provides a single destination for saved opportunities, applications, qualification activity, offers, and secured work across different opportunity models.                                                                                                                                                                                                                                                                                           |
| Earnings        | Gives the user visibility into compensation generated through their engagements, including earned, pending, paid, and upcoming payouts.                                                                                                               | Earnings communicates the user outcome directly. It is broader and more intuitive than "Payments," which can sound like a transaction or billing-management area.                                                                                                                                                                                                                                                                                                                                                                          |
| Referrals       | Lets users invite other professionals, track their referrals, understand referral status, and see any associated rewards.                                                                                                                             | Referrals is established marketplace terminology and immediately communicates both the action and the program. There is little benefit in introducing a more branded or abstract term here.                                                                                                                                                                                                                                                                                                                                                |

The overall IA follows a lifecycle sequence:

`Home` (what matters now) → `Browse Work` (work I can pursue) → `Engagements` (work I've taken action on) → `Earnings` (what I've earned) → `Referrals` (people I've introduced)

This gives navigation a coherent mental model — find work → do work → get paid — with Home as the orchestration layer (§1, §3) and Referrals as a secondary growth feature (§11.10).

> ✅ **Resolved (2026-08-30) — nav item renamed to "Browse Work":** the nav item previously called "Opportunities" is now **"Browse Work."** This is a decided rename, not an open option — the underlying `Opportunity` entity name (§13.1, §15, §10.2's object model) is unchanged; only the nav label changes. Full rationale:
>
> 1. **Balances clarity, action, and breadth.** "Browse" signals an exploratory action without implying the user already knows exactly what they want. "Work" is broader than "Jobs" or "Roles," so it supports project-based, one-time, retainer, contract, and full-time opportunities without stretching any one term.
> 2. **Positioned between the alternatives already considered.** More explicit than "Discover," less generic than "Explore" (§10.1's earlier-considered, not-adopted options).
> 3. **Avoids overusing "Opportunities"** as both the nav label and the underlying entity name, while still clearly communicating that this is where available work is found.
> 4. **Differentiates from Mercor**, a main competitor — a deliberate naming choice distinct from competitor conventions, not just an internal taxonomy fit.
> 5. **Completes a clean two-destination mental model with Engagements:** `Browse Work` is where the professional finds new work; `Engagements` is where they manage work or opportunities they've already interacted with. The pairing reads as _find something relevant_ → _manage what I've acted on_.
>
> "Discover more opportunities" and "Explore opportunities" remain the action-oriented CTA labels that route into this destination from elsewhere on the page (e.g. Home) — nav items name destinations, CTAs name actions, per §16's requirement to name the destination inside the action. Those CTAs should be revisited for consistency with the new nav label (e.g. "Browse more work" / "Explore open work") — not yet updated everywhere in this doc.
>
> ✅ **Resolved:** "Engagements" is broader than secured work only — it represents the user's relationship with opportunities after discovery, providing a single destination for the user's ongoing and historical interactions with opportunities (saved opportunities, applications, qualification activity, offers, and secured work). This is deliberately worded as "interactions with" rather than "actions taken on," since some items — like an assessment — may be assigned by Verita rather than initiated by the user. It is organized into **Engagement views** (§10.2): `Saved`, `Applications`, `Assessments`, `Offers`, and `Contracts`. These are different marketplace objects/relationships, not sequential lifecycle stages or mutually exclusive buckets — an opportunity's history can appear under more than one view at once (e.g. a rejected application still shows under `Applications` even if it once produced an entry under `Offers`). This supersedes the earlier "sequential application lifecycle" framing of this tab and the narrower "secured work only" description in §10's "Current work" module. **Engagement views are distinct from Opportunity types** (§15.1: Project-based, One-time, Talent Network, Full Time, etc.) — Opportunity type describes the work arrangement being offered; an Engagement view describes which marketplace object the user is looking at.
>
> ⚠️ **Decision needed:** Confirm whether "Your applications" (§10 module 5) and "Contracts" (§10 module 3) and "Offers" (§10 module 6) remain distinct Home-page modules pointing into this Engagements destination, or should be merged/renamed to match the §10.2 view names.
>
> ℹ️ **Superseded by the "Browse Work" rename above** — kept for historical reference only. "Opportunities" over "Jobs": "Jobs" was considered and rejected in favor of "Opportunities," which was itself later renamed to "Browse Work." Reasoning at the time:
>
> 1. **Fits the taxonomy, not just the vibe.** §15.1 includes non-job-shaped Opportunity types — `One-time` (e.g. "Review 50 AI-generated designs for $300") and `Talent Network` (e.g. "Join the Product Design expert network" — no active work at all). Neither is a "job" in the common sense; "Opportunities" covers all three types without stretching the word.
> 2. **Matches the underlying entity name.** `Opportunity` is the core entity throughout the doc (§13.1 data model, §15 opportunity data, §10.2's object model: `Opportunity` → discoverable work). Naming the nav item "Jobs" would create a mismatch between the nav label and the entity it actually points to everywhere else in the system.
> 3. **Avoids unintended employment framing.** "Jobs" can carry employee/W2 connotations that may work against a marketplace positioned around independent, contract-based engagements.
>
> Counterpoint noted for completeness: "Jobs" is shorter, more familiar in everyday language, and immediately legible without onboarding. This counterpoint predates the "Browse Work" rename and is not an open question either way.
>
> ℹ️ **"Discover" alternative — superseded, not adopted:** "Discover" was raised as a possible alternative to "Opportunities" for team discussion. The nav item has since been renamed to "Browse Work" instead, so "Discover" was not adopted. Kept for reference: it would have traded the entity-alignment argument above (`Opportunity` is the core entity throughout §13.1, §15, §10.2) and collided with the existing "Discover more opportunities" CTA — neither concern applies to "Browse Work."

### 10.2 Engagement views

Views within Engagements (§10.1) that organize the user's interactions with opportunities. These views represent different marketplace objects or relationships, not stages of a single sequential lifecycle — an opportunity's history can span more than one view at once (e.g. an application that led to an offer stays visible under `Applications` even after the offer appears under `Offers`).

| View         | Meaning                                                                                                                                                                                                                                                                                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Saved        | Opportunities the user has bookmarked for later consideration.                                                                                                                                                                                                                                                                                                                 |
| Applications | All opportunities the user has applied to, including active and historical applications and their current stage — user-facing labels: `Submitted`, `In review`, `Interview`, `On hold`, `Not selected`, or `Withdrawn` (backed by the system status enum, §13.5.1). Rejected and withdrawn applications remain visible here rather than being removed from the user's history. |
| Assessments  | Tests, AI interviews, screening exercises, or other qualification activities used to establish expertise or qualify the user for specific opportunities — whether general (not tied to a role) or opportunity-specific.                                                                                                                                                        |
| Offers       | Opportunities for which the user has received an offer, including pending, accepted, declined, or expired offers.                                                                                                                                                                                                                                                              |
| Contracts    | Secured work that has reached the contractual stage, including upcoming, active, completed, or terminated work.                                                                                                                                                                                                                                                                |

Object model this supports:

`Opportunity` → discoverable work
`Match` → system-identified relevance between a professional and an opportunity (§10.3)
`Saved` → user bookmark relationship
`Application` → pursuit of an opportunity
`Assessment` → qualification activity
`Offer` → proposal of work
`Contract` → formalized work

> ✅ **Resolved — Applications preserves history:** an application is never removed or "graduated out" of the `Applications` view when it progresses to an offer or ends in rejection/withdrawal — it stays accessible there with its terminal stage shown, while the offer (if any) also appears under `Offers`. This avoids silently erasing records from the user's mental model.
>
> ✅ **Resolved — Assessment is a first-class object, not an opportunity attribute:** `Assessment` is its own object (general or opportunity-specific), not "an opportunity where an assessment is pending." This matches the AI-marketplace model, where qualification activity (e.g. a general AI interview) can exist independently of any single opportunity.
>
> ✅ **Resolved — no separate Interviews view:** an interview is represented as an `Interview` stage within `Applications` and/or an interview-type `Assessment`, not a sixth top-level view. Adding a dedicated category here would fragment the workflow; a dedicated scheduling surface can be introduced later if interview volume warrants it, without changing this taxonomy.
>
> ✅ **Resolved — Contracts over Active Work:** `Contracts` is the durable container name; `Active` is one possible status a contract can hold (alongside `Awaiting start`, `Paused`, `Completed`, `Terminated`). `Active Work` would misdescribe most non-active contract states, so the container keeps the neutral name and status is tracked separately. This is the resolution to the naming question raised under §10.1.
>
> ✅ **Resolved — Applications stage list backed by system enum:** the `Applications` stage list above now maps to the canonical system status enum documented in §13.5.1, rather than standing as an independent, informally-defined list. §11.5's stage model still needs reconciling against this same enum (flagged there).
>
> ⚠️ **Decision needed:** Confirm whether an `Assessment` can be linked to more than one `Opportunity` at once (e.g. a general assessment reused across several applications).

### 10.3 Opportunity views

Views within Browse Work (§10.1) that organize how the professional discovers work. Unlike the browsable marketplace at large, **Matches** is a personalized view:

Matches is a personalized Browse Work view showing roles the system has identified as relevant based on the user's profile, expertise, preferences, availability, rate, and eligibility signals.

| View            | Meaning                                                                                                                                                                                              |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Matches         | Opportunities the system has proactively identified as relevant to this professional, ranked by fit. Surfaced both within Browse Work and, when strong, promoted to the Home module described below. |
| Browse / Search | The full open marketplace, unfiltered by personalization — the entry point named `Discover more opportunities` / `Explore opportunities` elsewhere in this doc (§10.1, resolved).                    |

A `Match` is not a copy of an `Opportunity` — it is a relationship object layered on top of one: the system's assessment of relevance between a specific professional and a specific opportunity, carrying its own tier, fit reasons, and readiness state independent of the opportunity's own data (§13.4 Match fields already models this distinction).

**Home module — "Matching opportunities":** this is the Home-page surface for the Matches view (§10 module 4), not a separate destination. It promotes the professional's strongest current matches — same underlying `Match` objects as the full Matches view within Browse Work, just the top few, ranked per the priority engine (§8). Selecting one takes the professional to the same match detail used within Browse Work.

> ⚠️ **Decision needed:** Confirm the cap on matches shown in the Home "Matching opportunities" module (e.g. top 2–4) versus the full, paginated Matches view within Browse Work, and whether "Browse / Search" needs its own named view or stays an unstructured entry point into Browse Work.

### State-driven hierarchy

| Dominant state                         | Primary content order                                                                    | Primary intent                      |
| -------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------- |
| Profile started                        | Next best action → Complete your profile → Matches preview or discovery                  | Reach useful matching readiness     |
| Qualification pending                  | Next best action → Qualification status → Relevant matches                               | Complete qualification with purpose |
| Marketplace ready / matches available  | Best match or next best action → Matches → Applications → Profile improvements           | Evaluate and apply                  |
| Application active / interviewing      | Next application action → Applications → New matches → Profile improvements              | Advance active applications         |
| Offer received                         | Offer action → Offer summary → Applications → New matches                                | Review before expiration            |
| Engagement onboarding                  | Contracting/onboarding action → Training/setup → Engagement summary                      | Become ready to work                |
| Active engagement                      | Current engagement → Required actions → Milestones/training/payments → New opportunities | Deliver current work                |
| Engagement completed / available again | Completion or payment status → Confirm availability → New matches                        | Close out and re-enter matching     |
| Inactive                               | Availability/status action → Relevant history                                            | Restore or manage availability      |

### Desktop layout guidance

- Keep the next best action in the first meaningful viewport.
- Use a primary content column for the dominant journey and a secondary region only for lower-priority context.
- Do not make every module a same-sized card grid.
- Allow opportunity and application cards enough width for fit reason, status, key terms, and action.
- Keep section headings descriptive and action-oriented.

### Mobile layout guidance

- Render a single prioritized column.
- Place the dominant action before secondary summaries.
- Preserve opportunity context when a requirement blocks application.
- Avoid horizontal card carousels when they hide status or create ambiguous ordering.
- Keep primary CTAs reachable without obscuring content or system navigation.

## 11. Key Dashboard experiences

### 11.1 Next best action

The Dashboard must render one primary action when an unresolved P0–P2 item exists.

The module must include:

- Action title.
- Short explanation of why it matters now.
- Relationship to an opportunity, application, offer, engagement, training, or payment when applicable.
- Deadline or estimated time when useful.
- One primary CTA.
- A secondary details action only when needed.

If there is no urgent action, the Dashboard may promote the strongest new match or confirm that no action is required.

### 11.2 Next steps

Next steps is the onboarding- and profile-improvement task module referenced in §10 module 2. It renders as a row of individually-tappable task cards rather than a single dominant action.

> ℹ️ Next steps and Next best action (§11.1) are two different modules. Next best action is the single, most-emphasized action on the page when a P0–P2 item exists (§5.3 "one dominant action"). Next steps is a multi-card module that can show several same-weight tasks at once. When a task shown in Next steps is also the current highest-priority item, it should be promoted into the Next best action module rather than only appearing here — Next steps must not become a second place the same top-priority item competes for attention (§8 "Avoid duplicating the same underlying action in multiple modules").

Each Next steps card must include:

- Requirement-level badge, using the §9 taxonomy label that applies to that task (`Blocking`, `Required later`, `Recommended`, or `Optional`) — not a free-form or two-value label.
- Task title, stated as a specific, destination-named action (§16).
- Short explanation of why it matters or what it unlocks.
- One primary CTA routed to the task.

> ⚠️ **Gap:** a design of this module has only used two badge values (`Required`, `Recommended`) rather than the four §9 levels. `Required` is ambiguous between `Blocking` and `Required later` — these two levels carry different urgency and dismissal rules per §9 and must remain visually distinguishable, not collapsed into one badge.

#### Visibility rule

The Next steps module renders only while at least one applicable (incomplete, non-dismissed, non-expired) task exists for the professional. Once every task in the module is completed, dismissed, or no longer applicable, the module is removed from the Dashboard entirely — it must not remain visible in an empty state. This follows §FR-9's broader empty-state principle ("no urgent tasks: confirm that nothing requires attention") but goes further for this specific module: the empty case is no module, not a confirmation message in its place.

### 11.3 Matching opportunities

The Home module and Browse Work → Matches view (§10.3) share the same card content.

| Field                       | Content                                                                                                                                                   | Source       |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Opportunity title           | The role or engagement name.                                                                                                                              | §15          |
| Partner                     | Partner name or an approved anonymized label, per partner-visibility policy.                                                                              | §15          |
| Opportunity type            | Project-based, One-time, Talent Network, etc. — shown as a plain-language badge.                                                                          | §15.1        |
| Match tier                  | Plain-language fit tier (e.g. "Strong match"). Never the internal numeric score.                                                                          | §13.4, §5.4  |
| Fit explanation             | Concise reason grounded in supported professional and opportunity signals — what the professional will recognize as evidence, not scoring machinery.      | §13.4, §16   |
| Compensation & terms        | Compensation, engagement type, remote/location constraints, hours, and duration, when available.                                                          | §15          |
| Deadline / urgency          | Shown only when material to the decision (e.g. a closing date) — not shown as a generic freshness indicator.                                              | §15          |
| Application-readiness state | One of: not a fit, potential fit with missing data, matched but blocked, ready to apply (§FR-4).                                                          | §FR-4, §13.6 |
| Missing-requirement summary | When blocked, names the specific missing requirement inline on the card rather than requiring a separate screen (§11.4 contextual blocker).               | §11.4, §13.4 |
| Saved state                 | Whether the professional has bookmarked this match — surfaces the card in the Saved view (§10.2) and lets the affordance be toggled from the card itself. | §13.4, §10.2 |
| Recommended action          | The single primary CTA for this card's current state.                                                                                                     | —            |

Possible recommended actions:

- Learn more
- Apply
- Complete requirement to apply
- Finish assessment
- Resume application
- Interview
- Review offer
- Start onboarding

The system should not expose the internal numeric match score by default.

> ⚠️ **Decision needed:** Confirm whether Deadline/urgency and the Missing-requirement summary should always render on the card or only when applicable (to avoid empty/placeholder states crowding the default card), and confirm the Saved toggle's interaction pattern (icon affordance vs. menu action) against §17 motion requirements.

### 11.4 Contextual application blocker

When the professional is a match but cannot apply:

- Keep the role visible.
- Name the missing requirement.
- Explain that completing it enables the application.
- Route the CTA directly to the correct task.
- Return the professional to the role or resume the application after task completion.
- Recalculate readiness immediately or explain any processing delay.

### 11.5 Applications

Each application summary must include:

- Opportunity title and partner label.
- Current stage and status.
- Last meaningful update.
- Next action.
- Next-action owner: professional, Verita, or partner.
- Deadline when applicable.
- Progress only when it maps to meaningful completed requirements; avoid cosmetic percentages.

#### Row interaction

The entire application row is a single click target routing to the application detail (where the full next-action and owner state live) — there is no separate CTA button on the row itself. On hover, reveal a trailing arrow affordance to signal the row is interactive, consistent with §17's motion requirements (restrained, no delay to interactivity).

> ⚠️ **Decision needed — next-action owner scoped to the professional for now:** at this stage, outstanding steps shown on an application (e.g. "2 of 4 steps completed") are modeled as always belonging to the professional — not yet distinguishing "waiting on you" from "waiting on Verita" or "waiting on partner" inline on the row. This narrows the "Next-action owner: professional, Verita, or partner" requirement above to professional-only for the row summary; whether owner must still surface inline (vs. only after clicking through to detail) needs confirmation with product before this is treated as final. Until decided, §5.6's "distinguish waiting on Verita/partner from action required" is not fully satisfied by the row alone.

Suggested application lifecycle:

`Interested → Application started → Requirements pending → Submitted → Under review → Interview → Selected → Offer → Contracting → Onboarding → Active → Completed`

Terminal alternatives must include at least rejected and withdrawn.

> ⚠️ **Decision needed:** This lifecycle predates the canonical system status enum now documented in §13.5.1 and does not fully align with it (e.g. the enum has no `Selected` distinct from `ACCEPTED`, and stages past `Offer` belong to the `Contract` object per §10.2, not the `Application`). Reconcile this suggested lifecycle against §13.5.1 — likely narrowing it to the pre-offer stages only, since `Offer`/`Contracting`/`Onboarding`/`Active`/`Completed` are separate objects (`Offer`, `Contract`) in the §10.2 model, not later Application stages.

### 11.6 Offers and contracting

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
> ⚠️ **Decision needed:** A dedicated "Offer fields" data-model subsection (parallel to §13.4 Match fields, §13.5 Application fields) is intentionally not added yet — hold until the definition above is confirmed with product, so the data model isn't built on an unconfirmed object shape.

> ✅ **Resolved — Offer is not a Match:** a `Match` means the system thinks the opportunity is a good fit for the professional (§10.3, §13.4) — it is a system-generated relevance signal, produced before the professional applies. An `Offer` means the company (or Verita on its behalf) has actually selected the professional and is proposing work — it is a real proposal issued after selection. These are different objects at opposite ends of the flow above and must not be conflated in card content, CTAs, or status language.
>
> ✅ **Resolved — Offer cards show expiration, not a match tier:** a concrete consequence of the above — an Offer card (Home module or Engagements → Offers view) must not display a fit tier (`Strong match`, `Good match`, etc.); that vocabulary belongs to `Match` (§10.3, §11.2) and no longer applies once an opportunity has produced an offer. Instead, the Offer card's primary supporting fact is its **expiration** — the offer is available for a limited timeframe for the professional to accept, so the card must surface the expiration date/time prominently (§16: material deadlines get date, time, and timezone), not a relevance signal. **Confirmed in Figma (2026-08-30):** the Offers card now shows "Expires on [date]" in place of a match tier.
>
> ✅ **Resolved — an opportunity with an active Offer is suppressed from Matches:** once an opportunity has produced an offer, it must not also surface in the Matches view or the Home "Matching opportunities" module — the Offers module becomes the single place that opportunity is shown. This directly applies §8's "avoid duplicating the same underlying action in multiple modules": a professional who already has an offer for a role has something more advanced to act on than a match, so re-surfacing it as "Strong match"/"Good match" elsewhere is both redundant and confusing about what stage they're actually at.
>
> ✅ **Confirmed in Figma (2026-08-30):** the Offers card now shows a different opportunity ("Sleep Specialist, Behavioral Sleep Medicine Professional") than any listed under `Matches for you` — the earlier duplication (the same "Clinical Expert" card appearing in both modules) is resolved.

An offer must become a distinct, high-priority state rather than being buried inside applications. The Dashboard must support:

- Offer ready for review.
- Offer expiration.
- Contract ready to sign.
- Background check, tax paperwork, or payment setup when required.
- Training or orientation dependencies.

### 11.7 Active engagement

When work is active, current engagement information must outrank job discovery. The summary may include:

- Engagement and partner.
- Status, dates, expected hours, and rate.
- Current-week progress where supported.
- Required actions.
- Deliverables and upcoming milestones.
- Training status.
- Earnings and next payment where supported.
- Relevant messages or notifications.

### 11.8 Training

Training is a first-class workflow related to an engagement. The Dashboard must support:

- Required versus optional training.
- Module and overall completion status.
- Estimated time.
- Deadline.
- Continue action.
- Completion, score, attempt, certification, or expiration data only where relevant and approved for display.

### 11.9 Payments

Payment setup should appear contextually when an engagement or first payment makes it relevant. The Dashboard may show:

- Setup or verification status.
- Required tax or payout action.
- Earnings balance and pending payout.
- Next payout.
- Payment issue.

Sensitive payment details must remain in the dedicated payment flow and must not be exposed on the Dashboard.

### 11.10 Referrals

Referrals remain secondary to the professional's work journey. Promote them when there is a meaningful event, such as an accepted referral or pending reward. Otherwise provide a lower-priority entry point.

## 12. Functional requirements

### FR-1: Personalization

- The Dashboard must address the signed-in professional using available account data.
- Content must be calculated for the current user and must not leak another user's profile, matches, applications, or engagement information.

### FR-2: Lifecycle-aware composition

- The Dashboard must determine the dominant lifecycle state.
- It must show, hide, and reorder modules based on that state.
- It must support concurrent applications and engagements without reducing the user to a single irreversible state.

### FR-3: Task generation and management

- Tasks must be generated from current data and workflow triggers, not only manually defined cards.
- Tasks must support status, priority, requirement level, blocking state, relationship, due date, CTA, and completion.
- Dismiss and snooze must be available only when allowed by task policy.
- Completing a task must update or remove its Dashboard representation.

### FR-4: Matching and eligibility

- Match recommendations must consider approved signals such as expertise, skills, experience, domain, rate, availability, location, and work authorization.
- Eligibility and match quality must remain distinct.
- The Dashboard must distinguish `not a fit`, `potential fit with missing data`, `matched but blocked`, and `ready to apply`.

### FR-5: Application readiness

- The system must calculate readiness per opportunity.
- Readiness must account for global requirements and opportunity-specific requirements.
- A professional may be ready for one role and blocked for another.
- The CTA must reflect the current readiness and application state.

### FR-6: Status synchronization

- Dashboard status must reflect authoritative application, interview, offer, engagement, training, and payment systems.
- Stale data must not produce an invalid CTA.
- When synchronization is delayed, show a processing state instead of contradictory content.

### FR-7: Notifications and lifecycle events

- The system must ingest lifecycle events such as new match, interview request, stage change, offer, missing requirement, expiring role, assigned training, ready contract, payment, stale availability, and referral reward.
- Event-driven items must link to their related entity and expire or resolve appropriately.

### FR-8: Availability freshness

- Store when availability was last confirmed.
- Derive a freshness state.
- Prompt the professional to reconfirm stale availability without silently changing it.

### FR-9: Empty and fallback states

- No matches: explain what Verita is doing and recommend the most useful profile or preference action.
- No applications: do not render an empty tracker as the dominant module.
- No urgent tasks: confirm that nothing requires attention and promote the best relevant next step.
- No active engagement: hide current-work modules.
- Data error: preserve navigation, explain the issue, and provide retry or support as appropriate.

## 13. Core data model

### 13.1 Entities

- `User`
- `ProfessionalProfile`
- `Expertise`
- `Skill`
- `WorkPreference`
- `Availability`
- `CompensationPreference`
- `Verification`
- `Assessment`
- `Task`
- `Opportunity`
- `Match`
- `Application`
- `Interview`
- `Offer`
- `Engagement`
- `Training`
- `Payment`
- `Referral`
- `Notification`

### 13.2 Relationships

This diagram shows entity ownership: which object each `User` owns directly, and what each of those objects in turn owns. It answers "what data hangs off what" — not the same question as §10.2's Engagement views, which group these same objects into user-facing navigation (§10.2's `Engagement` isn't this diagram's `Engagements` entity; see the note below the tree).

How to read it:

- Each line is an entity from §13.1.
- Indentation and `├──`/`└──` mark a child owned by the entity above it (e.g. `Expertise`, `Skills`, `WorkPreferences`, `CompensationPreference`, and `Availability` all belong to one `ProfessionalProfile`).
- A childless entity (e.g. `Verifications`, `Tasks`, `Referrals`) is a direct, flat collection on `User` with no further nesting shown here.
- The tree tracks ownership/containment only — it is not a sequence or lifecycle order, and a line's position top-to-bottom carries no priority meaning (contrast with §8's priority classes or §11.5's lifecycle sequence).

```text
User
├── ProfessionalProfile
│   ├── Expertise
│   ├── Skills
│   ├── WorkPreferences
│   ├── CompensationPreference
│   └── Availability
├── Assessments
├── Verifications
├── Tasks
├── Matches
│   └── Opportunity
├── Applications
│   └── Opportunity
├── Interviews
├── Offers
├── Engagements
│   ├── Training
│   └── Payments
├── Referrals
└── Notifications
```

### 13.3 Task fields

At minimum:

| Field                                       | Purpose                                                                            |
| ------------------------------------------- | ---------------------------------------------------------------------------------- |
| `id`                                        | Stable task identity                                                               |
| `type`                                      | Behavior and routing, such as `resume_upload`                                      |
| `title` / `description`                     | User-facing guidance                                                               |
| `status`                                    | Pending, in progress, completed, expired, or superseded                            |
| `priority`                                  | P0–P4 ranking class                                                                |
| `requirement_level`                         | Blocking, required later, recommended, or optional                                 |
| `blocking_reason`                           | Consequence of not completing the task                                             |
| `related_entity_type` / `related_entity_id` | Opportunity, application, offer, engagement, training, payment, or profile context |
| `trigger`                                   | Event or condition that created the task                                           |
| `cta_label` / `cta_destination`             | Action and route                                                                   |
| `created_at` / `due_at` / `completed_at`    | Timing                                                                             |
| `dismissible` / `snoozable`                 | Allowed user controls                                                              |
| `estimated_completion_time`                 | Optional effort guidance                                                           |
| `sort_priority`                             | Deterministic ordering within a class                                              |

### 13.4 Match fields

At minimum:

- User and opportunity IDs.
- Status and user-facing tier.
- Internal score and confidence, if implemented.
- Skills, experience, domain, rate, availability, location, and authorization alignment.
- Missing requirements.
- Structured recommendation reasons with evidence provenance.
- Created and refreshed timestamps.
- Viewed, saved, dismissed, dismissal reason, and interested states.
- Recommended action.

### 13.5 Application fields

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

#### 13.5.1 Application status enum

`Current stage and status` above is backed by a canonical system enum, distinct from the plain-language stage labels used for display in §10.2 and §11.5. The Dashboard must map the system enum to user-facing language rather than surface these values directly.

| System status       | Meaning                                                         | User-facing label |
| ------------------- | --------------------------------------------------------------- | ----------------- |
| `APPLIED`           | Initial state after submission.                                 | Submitted         |
| `SCORING_PENDING`   | Waiting for AI scoring.                                         | In review         |
| `INTERVIEW_PENDING` | Scheduled for AI interview.                                     | Interview         |
| `UNDER_REVIEW`      | Ops is evaluating.                                              | In review         |
| `INTERVIEW`         | In interview stage.                                             | Interview         |
| `ACCEPTED`          | Offer extended — creates an `Offer` object (§10.2 Offers view). | Offer received    |
| `REJECTED`          | Declined by ops.                                                | Not selected      |
| `ON_HOLD`           | Parked for later.                                               | On hold           |
| `WITHDRAWN`         | Candidate withdrew.                                             | Withdrawn         |

> ✅ **Resolved:** `ACCEPTED` is an **Application** status, not a Contract or Engagement status — it marks the moment an offer is extended and creates a corresponding `Offer` object (§10.2's object model: `Offer` → proposal of work). The application itself stays visible under `Applications` with this status, per §10.2's "Applications preserves history" resolution — it does not move to the `Offers` view, the `Offer` object does.
>
> ⚠️ **Decision needed:** `ON_HOLD` has no equivalent in the §10.2 Applications stage list (`In progress, Submitted, In review, Interview, Not selected, Withdrawn`) or the §11.5 suggested lifecycle. Confirm whether "On hold" should be added as a user-facing stage in both places, and reconcile `SCORING_PENDING` vs. `UNDER_REVIEW` — both map to "In review" here; confirm whether that distinction (AI scoring vs. ops review) should be visible to the professional or stays an internal-only distinction.

### 13.6 Derived values

The Dashboard should derive rather than independently store:

- **Profile completeness:** completed relevant profile attributes ÷ relevant profile attributes.
- **Application readiness:** all global requirements needed for application are satisfied.
- **Role eligibility:** global requirements + opportunity requirements + geography + authorization.
- **Strong matches:** open matches above the approved recommendation threshold.
- **Action count:** unresolved, applicable tasks in the current lifecycle.
- **Dominant lifecycle state:** highest-precedence current journey state.
- **Availability freshness:** elapsed time and policy since last confirmation.

Derived values must identify their source data and calculation version for debugging and analytics.

## 14. Profile and matching data

The professional profile may include:

- Identity and contact status.
- Location, country, timezone, and work authorization.
- Expertise summary, profession, seniority, experience, domains, specialties, skills, and industries.
- Management experience and IC/management preference.
- Resume, portfolio, and LinkedIn status.
- AI-generated profile and user confirmation.
- General and opportunity-specific assessments.
- Work types, availability, hours, schedule, and exceptions.
- Desired and minimum rates, fixed-project minimum, currency, and negotiability.
- Remote, hybrid, on-site, travel, company-stage, industry, project-duration, working-style, collaboration, client-facing, leadership, and team-size preferences.
- Negative preferences and exclusions.

Internal confidence or evaluation data may improve matching but must not be shown unless a specific user benefit and explanation are defined.

> ⚠️ **Privacy and fairness review:** Determine which profile and assessment signals may be used for matching, which require consent, how users can review or correct them, and how bias, provenance, retention, and explainability will be managed.

## 15. Opportunity data required by the Dashboard

At minimum:

- ID, title, partner, and partner-visibility policy.
- Opportunity type (§15.1) and work arrangement.
- Location and authorization constraints.
- Compensation type, range, currency, and expected hours.
- Duration and start date.
- Required and preferred expertise, skills, seniority, and industry.
- Openings, deadline, status, date posted, and urgency.
- Requirements needed to apply or begin the engagement.

Internal application counts or capacity should not be shown unless product explicitly approves their meaning and user value.

### 15.1 Opportunity types

These describe the kind of work arrangement an **Opportunity** offers before a professional applies — not the status of a secured Engagement (§10.1).

| Type           | Definition                                                                                                                             | Example                                       |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Project-based  | Hired for a defined project over a period of time, usually with ongoing work and an expected weekly capacity.                          | Product Designer for 20 hrs/week for 3 months |
| One-time       | A single, clearly scoped task or deliverable. The engagement ends once it's completed.                                                 | Review 50 AI-generated designs for $300       |
| Talent Network | No immediate project. The professional joins a qualified pool so Verita can match or invite them when relevant work becomes available. | Join the Product Design expert network        |

> ⚠️ **Decision needed:** These three types are a starting taxonomy, not final. Confirm naming, whether additional types are needed, and how each maps to application readiness, contracting, and Dashboard treatment before implementation.

## 16. UX content requirements

- State the action before supporting detail.
- Explain why an action matters and what it unlocks.
- Use specific nouns: `Complete interview`, `Review offer`, `Sign contract`.
- Avoid generic CTAs such as `Continue` when the destination can be named.
- Distinguish recommendations from requirements.
- Distinguish `waiting on Verita` or `waiting on partner` from `action required`.
- Describe match rationale using evidence the professional recognizes.
- Do not imply certainty when the recommendation is probabilistic.
- Do not present internally generated profile or assessment claims as user-confirmed facts.
- Show deadlines with date, time, and timezone when the time is material.

## 17. Interaction and motion requirements

- Completing a task should update related readiness and CTA state without disorienting reflow.
- When a blocking action resolves, the related opportunity should transition to its new state and remain easy to find.
- Use restrained layout transitions to explain card removal, reordering, or expansion.
- Do not animate every data refresh or routine status poll.
- Do not delay action availability for animation.
- Respect reduced-motion preferences and preserve equivalent state feedback without motion.

## 18. Accessibility requirements

- Meet WCAG 2.2 AA for the Dashboard experience.
- Preserve a logical heading hierarchy and landmark structure.
- Make priority, requirement level, match tier, stage, and status understandable without color alone.
- Ensure all actions are keyboard accessible with visible focus.
- Announce meaningful async status changes without repeatedly interrupting assistive-technology users.
- Provide accessible names that include enough context to distinguish repeated CTAs, for example `Apply to Senior Product Designer`.
- Do not encode progress only as a visual bar; provide status text.
- Do not use motion as the only indication of completion, removal, or reprioritization.
- Maintain readable touch targets, contrast, zoom behavior, and responsive reflow.
- Keep deadlines and compensation understandable to screen readers, including currency, rate unit, date, time, and timezone.

## 19. Loading, error, and edge states

Design must cover:

- Initial Dashboard loading.
- Partial loading when one data source is delayed.
- Newly completed onboarding with no generated matches yet.
- Match generation or assessment evaluation in progress.
- One or more stale matches.
- Opportunity closed while the professional is viewing or completing a blocker.
- A previously required task becoming inapplicable.
- The same task blocking multiple opportunities.
- Multiple P0 or P1 actions.
- Conflicting deadlines.
- Concurrent active engagement and active applications.
- Application updated by a partner while the page is open.
- Offer expired or withdrawn.
- Training assigned after engagement starts.
- Payment issue containing sensitive details.
- Professional changes availability to unavailable.
- Data unavailable, unauthorized, or out of sync.

## 20. Analytics events

Instrument at minimum:

- `dashboard_viewed` with lifecycle state and rendered module set.
- `next_best_action_impression` and `next_best_action_clicked`.
- `task_impression`, `task_clicked`, `task_snoozed`, `task_dismissed`, and `task_completed`.
- `match_impression`, `match_viewed`, `match_saved`, `match_dismissed`, and `match_apply_clicked`.
- `application_status_viewed` and `application_next_action_clicked`.
- `offer_action_clicked`, `engagement_action_clicked`, `training_action_clicked`, and `payment_action_clicked`.
- `availability_reconfirmation_prompted` and `availability_reconfirmed`.
- `dashboard_error_shown` with safe error classification.

Events must include the priority class, lifecycle state, related entity type, and surface position where applicable. Do not include sensitive profile, assessment, authorization, payment, or partner-confidential values in analytics payloads.

## 21. Acceptance criteria

### State and hierarchy

- Given a professional with a P0 blocker, the Dashboard displays that blocker as the dominant next best action.
- Given a time-sensitive interview or offer action and a generic profile recommendation, the time-sensitive action ranks higher.
- Given an active engagement, current work appears before new opportunities.
- Given no applicable content for a module, the module is hidden or replaced by a purposeful state rather than an empty shell.

### Matching and readiness

- A match explains fit using approved evidence and does not expose an internal numeric score by default.
- A role-specific blocker appears in the context of that role.
- Completing the final requirement updates the role CTA to `Apply` or the next valid application action.
- Eligibility and match strength are represented as distinct states.

### Tasks

- Every task has a requirement level and consequence.
- A blocking task cannot be dismissed while it remains applicable.
- A recommended or optional task does not use mandatory language.
- Completed, expired, superseded, or inapplicable tasks do not remain actionable.

### Applications and work

- Every active application shows its current stage, last update, next action, and next-action owner.
- Offers and expiring actions receive time-sensitive priority.
- Training and payout setup appear only when relevant to an engagement or required milestone.

### Quality

- Desktop and mobile designs cover the lifecycle states and edge cases listed in this PRD.
- Keyboard, screen-reader, reduced-motion, zoom, and responsive behavior are defined and verified.
- Analytics contain no prohibited sensitive values.

## 22. Design deliverables

The UX/UI design phase should produce:

1. A lifecycle-to-Dashboard state map.
2. A priority and collision matrix for P0–P4 items.
3. Low-fidelity layouts for each dominant lifecycle state.
4. Responsive desktop and mobile layouts.
5. Component states for next best action, task, match, application, offer, engagement, training, payment, notification, and empty/error states.
6. A match/readiness state matrix including eligible, blocked, processing, closed, saved, dismissed, application started, and applied.
7. Interaction flows for completing a contextual blocker and returning to the opportunity.
8. Content examples for every requirement level and next-action owner.
9. Accessibility annotations and keyboard order.
10. A prototype covering incomplete profile → strong match → blocker → apply → interview → offer → engagement onboarding → active work.

## 23. Dependencies

- Canonical professional profile and preference schema.
- Opportunity and requirement schema.
- Match generation, tiering, rationale, and refresh behavior.
- Application, interview, offer, and engagement status integrations.
- Task generation and priority service.
- Identity, authorization, payment, tax, background-check, and training providers as applicable.
- Notification/event infrastructure.
- Analytics taxonomy and privacy review.
- Operations tooling for exceptions, overrides, and support.

## 24. Risks

- Incorrect prioritization can hide a deadline or block progression.
- Poor match explanations can reduce trust or reveal sensitive/internal logic.
- Stale availability and opportunity data can create invalid recommendations.
- Over-personalization can make navigation or page order feel unstable.
- A completeness percentage can encourage irrelevant data collection or falsely imply readiness.
- Multiple concurrent journeys can make a single lifecycle state misleading.
- Assessment and eligibility data can introduce privacy, fairness, and legal risk.
- Contextual tasks can become repetitive if the same underlying requirement is rendered once per opportunity.
- Partner status latency can create contradictory next actions.

## 25. Open questions

### Product and policy

- Which onboarding fields are truly required, skippable, recommended, or optional?
- Which requirements apply globally, per opportunity, before engagement, or before payment?
- Can a professional browse, save, or express interest before they are eligible to apply?
- Which partner and client names may be shown?
- Is `Profile completeness` useful to professionals, or should the product show only specific improvements?
- When should a professional be considered inactive or unavailable?

### Matching

- Which signals drive matching, and which are hard eligibility gates?
- What defines Strong, Good, and Possible match tiers?
- How should missing or low-confidence profile data affect recommendations?
- What rationale is safe, accurate, and useful to expose?
- How quickly are matches refreshed after profile, rate, or availability changes?

### Priority engine

- What are the exact rank weights and tie-break rules?
- How are multiple deadlines compared?
- Can users pin, snooze, or reorder tasks?
- Can operations promote, suppress, or correct an item?
- How many items appear before the user must open a full task view?

### Applications and engagements

- What is the canonical application stage/status model?
- Which system owns next-action state and deadlines?
- Can professionals have multiple active engagements?
- What engagement progress, earnings, and performance data is appropriate for Home?
- What happens when an opportunity closes while a professional completes a prerequisite?

### UX/UI

- Should the next best action be a dedicated hero, the first item in a feed, or a stateful summary panel?
- How much application and engagement history belongs on Home versus dedicated pages?
- What is the navigation model for Dashboard, Opportunities, Applications, Work, Profile, and Referrals?
- Should match reasons be always visible or progressively disclosed?
- What content order feels stable enough while still adapting to lifecycle changes?

### Technical and operations

- Which proposed entities and fields already exist?
- What freshness guarantees are available for partner status and opportunity data?
- What is the fallback when match rationale or priority calculation fails?
- How are task deduplication, supersession, and audit history handled?
- What administrative tools are required to diagnose a wrong task or status?

## 26. Recommended MVP boundary

The MVP should validate the central orchestration model before implementing every downstream domain.

Include:

- Dominant lifecycle state.
- Next best action.
- Generic task model with P0–P4 priority and four requirement levels.
- Matches with plain-language fit explanation.
- Opportunity-specific application readiness and blocker handling.
- Active application summaries with next-action owner.
- Profile improvements and availability freshness.
- Empty, loading, processing, stale, and error states.
- Core analytics and accessibility requirements.

Defer unless already supported:

- Detailed active-engagement hours, earnings, deliverables, and performance.
- Full training, payment, referral, and contract summaries.
- Complex manual priority overrides.
- Exposed profile-completeness percentage.
- Advanced multi-engagement aggregation.

> ⚠️ **Decision needed:** Confirm whether offer, contracting, engagement, training, payment, and referral states are launch requirements or future-state requirements before design fidelity increases.
